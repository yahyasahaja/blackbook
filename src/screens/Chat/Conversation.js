import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import moment from 'moment'
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import ChatBubble from '../../components/Chat/ChatBubble'
import client from '../../services/graphql/chatClient'

import styles from './css/conversation.scss'
import loadingTheme from './css/loading.scss'
import loadingSubmitTheme from './css/loading-submit.scss'

import { appStack } from '../../services/stores'

@observer
class Conversation extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
    this.messagesRef = []
  }

  state = {
    title: this.props.location.state
      ? this.props.location.state.sender
      : 'Penjual',
    message: '',
    loading: false,
    showed: false,
    scrolledToBottom: false,
    refetchSending: false,
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data.loading) {
      this.setState({ showed: true })
    }

    if (!this.props.data.loading) {
      if (!this.state.showed) {
        this.props.data.refetch()
        this.scrollToBottom()
      }
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.checkScroll)
    window.addEventListener('gesturechange', this.checkScroll)
  }

  componentWillUnmount() {
    appStack.pop()
    window.removeEventListener('scroll', this.checkScroll)
    window.removeEventListener('gesturechange', this.checkScroll)
  }

  componentDidUpdate() {
    if (!this.state.scrolledToBottom && !this.props.data.loading) {
      this.scrollToBottom()
    }
  }

  checkScroll = async () => {
    let scrollPosition = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop,
    )
    let screenHeight = document.body.offsetHeight

    if (
      scrollPosition < 10 &&
      !this.props.data.loading &&
      (this.props.data.thread && this.props.data.thread.messages.total !== 0)
    ) {
      const currentTopMessage = this.messagesRef[0]
      await this.props.data.fetchMore()
      currentTopMessage.scrollIntoView()
      window.scrollBy(0, -180)
    }
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: 'auto' })
    this.setState({ scrolledToBottom: true })
  }

  handleInput(event) {
    this.setState({ message: event.target.value })
    this.messageInput.style.height = ''
    this.messageInput.style.height =
      Math.min(this.messageInput.scrollHeight, 300) + 'px'
  }

  convertToMoneyFormat(num, currency) {
    let res = num
      .toString()
      .split('')
      .reverse()
      .reduce(function(acc, num, i) {
        return num == '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc
      }, '')

    return `${currency} ${res}`
  }

  async sendMessage() {
    const { message, loading } = this.state
    if (message.length === 0 || loading) return

    this.setState({ loading: true, refetchSending: true })

    const { submit, data } = this.props
    const { data: res } = await submit(message)

    if (!res.error) {
      // clear input
      this.setState({ message: '', loading: false })
      // reset height
      this.messageInput.style.height = ''
      // refetch the message
      await data.refetch()
      this.setState({ refetchSending: false })
    }
  }

  renderMessages(messages) {
    return messages.reverse().map((message, index) => {
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

  render() {
    const { message, title, loading } = this.state
    const { data, product } = this.props
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
        <div className={styles.productBar}>
          <div className={styles.imagePlaceholder}>
            {data.thread &&
              (!product.loading && <img src={product.product.images[0].url} />)}
          </div>
          <div className={styles.content}>
            <p>
              {data.thread && !product.loading
                ? product.product.name
                : 'Memuat produk...'}
            </p>
            {data.thread ? (
              product.loading ? (
                <span>memuat...</span>
              ) : (
                <span>
                  {this.convertToMoneyFormat(
                    product.product.price.value,
                    product.product.price.currency,
                  )}
                </span>
              )
            ) : (
              <span>memuat...</span>
            )}
          </div>
          <span className={`mdi mdi-chevron-right ${styles.chevronRight}`} />
        </div>
        {this.props.data.loading && !this.state.refetchSending ? (
          <div className={styles.loading}>
            <ProgressBar theme={loadingTheme} mode="indeterminate" />
          </div>
        ) : (
          ''
        )}
        <div className={styles.messages}>
          {this.props.data.thread &&
            this.renderMessages(this.props.data.thread.messages.data.slice())}
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

Conversation.defaultProps = {
  data: {},
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
      name
      price {
        currency
        value
      }
      images {
        url
      }
    }
  }
`

const sendMessageMutation = gql`
  mutation SendMessage($id: Int!, $message: String!) {
    pushMessage(text: $message, threadId: $id) {
      status
    }
  }
`

export default compose(
  graphql(sendMessageMutation, {
    props: ({ mutate, ownProps }) => ({
      submit: message =>
        mutate({
          variables: {
            id: ownProps.match.params.id,
            message,
          },
        }),
    }),
    options: {
      client,
    },
  }),
  graphql(getMessagesQuery, {
    options: props => ({
      client,
      variables: {
        id: props.match.params.id,
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data: { loading, thread, fetchMore, refetch } }) => {
      const loadMoreMessages = () => {
        if (thread.messages.total > 0) {
          return fetchMore({
            variables: {
              before: thread.messages.data[thread.messages.data.length - 1].id,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const previousMessages = previousResult.thread.messages.data
              const currentMessages = fetchMoreResult.thread.messages.data

              return {
                thread: {
                  __typename: fetchMoreResult.thread.__typename,
                  productId: fetchMoreResult.thread.productId,
                  messages: {
                    total: fetchMoreResult.thread.messages.total,
                    __typename: fetchMoreResult.thread.messages.__typename,
                    data: [...previousMessages, ...currentMessages],
                  },
                },
              }
            },
          })
        }
      }

      return {
        data: {
          loading,
          thread,
          refetch,
          fetchMore: loadMoreMessages,
        },
      }
    },
  }),
  graphql(getProductQuery, {
    name: 'product',
    skip: props => !props.data.thread,
    options: props => ({
      variables: {
        id: props.data.thread.productId,
      },
    }),
  }),
)(Conversation)
