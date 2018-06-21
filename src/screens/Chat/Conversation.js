import React, { Component } from 'react'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import { observe } from 'mobx'
import { Link } from 'react-router-dom'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import moment from 'moment'
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import ChatBubble from '../../components/Chat/ChatBubble'
import productClient from '../../services/graphql/productClient'
import chatClient from '../../services/graphql/chatClient'
import { convertToMoneyFormat } from '../../utils'

import styles from './css/conversation.scss'
import loadingTheme from './css/loading.scss'
import loadingSubmitTheme from './css/loading-submit.scss'

import {
  appStack,
  badges,
  chat,
  user,
} from '../../services/stores'

@observer
class Conversation extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
    this.messagesRef = []
  }

  state = {
    title:
      this.props.location.state && this.props.location.state.sender
        ? this.props.location.state.sender
        : 'Penjual',
    message: '',
    messages: {
      total: 0,
      data: [],
    },
    product: null,
    loadingProduct: true,
    loadingMessage: true,
    loadingIncomingMessage: true,
    loading: false,
    showed: false,
    scrolledToBottom: false,
    gettingOlderMessage: false,
    error: '',
  }

  async componentWillMount() {
    this.getThreadId()
    this.disposer = observe(user, 'isLoading', () => {
      if (!user.isLoading) {
        this.getThreadId()
      }
    })
  }

  async componentDidMount() {
    if (this.props.location.state && this.props.location.state.index) {
      if (chat.threads[this.props.location.state.index]) {
        chat.threads[this.props.location.state.index].isRead = true
      }
    }
    window.addEventListener('scroll', this.checkScroll)
    window.addEventListener('gesturechange', this.checkScroll)

    navigator.serviceWorker.onmessage = e => {
      if (
        e.type === 'message' &&
        e.data.threadId === Number(this.props.match.params.id)
      ) {
        this.getMessages(undefined, true)
      }
    }

    badges.set(badges.CHAT, 0)
  }

  componentDidUpdate(props) {
    if(props.match.params.id === 'new' && this.props.match.params.id !== 'new') {
      console.log('existing chat', props.match.params.id, this.props.match.params.id)
      this.getMessages()
    }
  }

  componentWillUnmount() {
    appStack.pop()
    window.removeEventListener('scroll', this.checkScroll)
    window.removeEventListener('gesturechange', this.checkScroll)
  }

  checkScroll = async () => {
    let scrollPosition = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop,
    )

    if (
      scrollPosition < 10 &&
      this.state.messages &&
      !this.state.loadingMessage &&
      this.state.messages.total !== 0 &&
      !this.state.gettingOlderMessage
    ) {
      this.setState({ gettingOlderMessage: true })

      const currentTopMessage = this.messagesRef[0]
      // fetch more message
      await this.getMessages(
        this.state.messages.data[this.state.messages.data.length - 1].id,
      )
      currentTopMessage.scrollIntoView()
      window.scrollBy(0, -180)

      this.setState({ gettingOlderMessage: false })
    }
  }

  scrollToBottom() {
    console.log('scroll to bottom')
    this.messagesEnd.scrollIntoView({ behavior: 'auto' })
    this.setState({ scrolledToBottom: true })
  }

  async getThreadId() {
    // check if user logged in
    if (!user.isLoading && !user.isLoggedIn) {
      return this.props.history.replace('/account')
    } else {
      // fetch thread id if new
      if (this.props.match.params.id === 'new') {
        console.log('checking existing chat')
        const {
          data: { thread },
        } = await chatClient.query({
          query: getThreadId,
          fetchPolicy: 'network-only',
          variables: {
            productId: this.props.location.state.productId,
          },
        })

        console.log('thread is', thread)
        if (thread !== null) {
          return this.props.history.replace(`/chat/${thread.id}`)
        } else {
          console.log('not an existing chat')
          this.setState({
            loadingMessage: false,
            loadingIncomingMessage: false,
          })
          return this.getProduct(this.props.location.state.productId)
        }
      }

      this.getMessages()
    }
  }

  async getProduct(productId) {
    try {
      const {
        data: { product },
      } = await productClient.query({
        query: getProductQuery,
        variables: {
          id: productId,
        },
      })

      this.setState({
        loadingProduct: false,
        product,
        title: product.seller.name,
      })
    } catch (err) {
      this.setState({
        loadingProduct: false,
        error: 'Tidak dapat mengambil informasi produk',
      })
    }
  }

  async getMessages(before = undefined, fromNotification = false) {
    console.log('fetching messages', before)

    // get messages
    try {
      this.setState({ 
        loadingMessage: !fromNotification,
        loadingIncomingMessage: fromNotification 
      })

      const {
        data: { thread },
      } = await chatClient.query({
        fetchPolicy: 'network-only',
        query: getMessagesQuery,
        variables: {
          id: this.props.match.params.id,
          before,
        },
      })

      if (before) {
        // append message
        this.setState({
          loadingMessage: false,
          messages: {
            total: thread.messages.total,
            data: [...this.state.messages.data, ...thread.messages.data],
          },
        })
      } else {
        this.setState({
          loadingMessage: false,
          loadingIncomingMessage: false,
          messages: thread.messages,
        })

        if (!fromNotification) this.scrollToBottom()
      }

      // after get message, get product detail
      if (!before && !this.state.product) this.getProduct(thread.productId)
      return true
    } catch (err) {
      console.log(err)
      this.setState({
        loadingMessage: false,
        error: 'Tidak dapat mengambil chat',
      })

      return false
    }
  }

  handleInput(event) {
    this.setState({ message: event.target.value })
    this.messageInput.style.height = ''
    this.messageInput.style.height =
      Math.min(this.messageInput.scrollHeight, 300) + 'px'
  }

  renderMessages() {
    const messages = this.state.messages.data.slice().reverse()
    return messages.map((message, index) => {
      let isOtherDay = false

      if (index === 0) {
        isOtherDay = true
      } else {
        const messageDate = moment(message.createdAt)
        const prevMessageDate = moment(messages[index - 1].createdAt)
        if (prevMessageDate.isBefore(messageDate, 'day')) {
          isOtherDay = true
        }
      }

      return (
        <div
          className={styles.bubble}
          ref={el => {
            this.messagesRef[index] = el
          }}
          key={message.id}
        >
          <ChatBubble
            isOtherDay={isOtherDay}
            avatarImage={message.createdBy.profilePicture}
            avatarTitle={message.createdBy.displayName[0]}
            message={message.text}
            time={message.createdAt}
            isMe={message.createdBy.isMe}
          />
        </div>
      )
    })
  }

  async sendMessage() {
    const { message, loading } = this.state
    if (message.length === 0 || loading) return

    this.setState({ loading: true })

    const { data: res } = await chatClient.mutate({
      mutation: sendMessageMutation,
      variables: {
        id:
          this.props.match.params.id === 'new'
            ? -1
            : this.props.match.params.id,
        message,
        productId: this.props.location.state ? this.props.location.state.productId : null,
      },
    })

    if (!res.error) {
      // clear input
      this.setState({ message: '', loading: false })
      // reset height
      this.messageInput.style.height = ''
      // refetch the message

      // check if new message
      if (this.props.match.params.id === 'new') {
        // if new message change history to id
        this.setState({ scrolledToBottom: false })
        this.props.history.replace(`/chat/${res.pushMessage.threadId}`)
      } else {
        // if not new message, refetch
        await this.getMessages(undefined, true)
        this.scrollToBottom()
      }
    }
  }

  render() {
    if (user.isLoading) return <div />

    const {
      loadingProduct,
      loadingMessage,
      loadingIncomingMessage,
      gettingOlderMessage,
      product,
      message,
      title,
      loading,
    } = this.state
    return (
      <PopupBar
        onBack={e => {
          e.preventDefault()
          this.props.history.goBack()
        }}
        title={`Hubungi ${title}`}
        {...this.props}
        anim={ANIMATE_HORIZONTAL}
        style={{
          background: 'rgb(239, 239, 239)',
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 56,
        }}
      >
        <Link
          onClick={e => (!product || loadingProduct) && e.preventDefault()}
          to={`${
            product ? (loadingProduct ? '' : `/product/${product.id}`) : ''
          }`}
        >
          <div className={styles.productBar}>
            <div className={styles.imagePlaceholder}>
              {product &&
                (!loadingProduct && <img src={product.images[0].url} />)}
            </div>
            <div className={styles.content}>
              <p>
                {product && !loadingProduct ? product.name : 'Memuat produk...'}
              </p>
              {product ? (
                loadingProduct ? (
                  <span>memuat...</span>
                ) : (
                  <span>
                    {convertToMoneyFormat(
                      product.price.value,
                      product.price.currency,
                    )}
                  </span>
                )
              ) : (
                <span>memuat...</span>
              )}
            </div>
            <span className={`mdi mdi-chevron-right ${styles.chevronRight}`} />
          </div>
        </Link>
        {loadingMessage || loadingIncomingMessage ? (
          <div className={styles.loading}>
            <ProgressBar theme={loadingTheme} mode="indeterminate" />
          </div>
        ) : (
          ''
        )}
        <div className={styles.messages}>
          {(!this.state.loadingMessage || gettingOlderMessage) &&
            this.state.messages &&
            this.renderMessages()}
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={el => {
              this.messagesEnd = el
            }}
          />
        </div>
        <div className={styles.input_area}>
          <textarea
            value={message}
            rows={1}
            ref={el => (this.messageInput = el)}
            onChange={this.handleInput.bind(this)}
            placeholder="Ketik pesanmu disini..."
          />
          <button
            className={styles.sendButton}
            onClick={() => this.sendMessage()}
          >
            {loading ? (
              <ProgressBar
                type="circular"
                mode="indeterminate"
                theme={loadingSubmitTheme}
              />
            ) : (
              <span
                className={`mdi mdi-send ${styles.sendIcon} ${message.length >
                  0 && styles.active}`}
              />
            )}
          </button>
        </div>
      </PopupBar>
    )
  }
}

const getMessagesQuery = gql`
  query MessageQuery($id: Int!, $before: Int) {
    thread(threadId: $id, perspective: BUYER) {
      productId
      messages(before: $before) {
        total
        data {
          id
          text
          createdBy {
            id
            displayName
            profilePicture
            isMe
          }
          createdAt
        }
      }
    }
  }
`

const getProductQuery = gql`
  query Product($id: ID!) {
    product(productId: $id) {
      id
      name
      price {
        currency
        value
      }
      images {
        url
      }
      seller {
        name
      }
    }
  }
`

const getThreadId = gql`
  query ThreadId($productId: String!) {
    thread(perspective: BUYER, threadId: -1, productId: $productId) {
      id
      productId
    }
  }
`

const sendMessageMutation = gql`
  mutation SendMessage($id: Int!, $message: String!, $productId: String) {
    pushMessage(text: $message, threadId: $id, productId: $productId) {
      status
      threadId
    }
  }
`

export default Conversation
