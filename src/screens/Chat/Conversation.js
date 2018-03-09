import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import moment from 'moment'
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import ChatBubble from '../../components/Chat/ChatBubble'
import client from '../../services/graphql/chatClient'

import styles from './css/conversation.scss'

import { popup } from '../../services/stores'

@observer
class Conversation extends Component {
  state = {
    title: this.props.location.state
      ? this.props.location.state.sender
      : 'Penjual',
    message: '',
  }

  componentDidMount() {
    popup.push()
  }

  componentWillUnmount() {
    popup.pop()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: 'auto' })
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
        <ChatBubble
          isOtherDay={isOtherDay}
          key={message.id}
          avatarImage={message.createdBy.profilePicture}
          avatarTitle={message.createdBy.displayName[0]}
          message={message.text}
          time={message.createdAt}
          isMe={message.createdBy.isMe}
        />
      )
    })
  }

  render() {
    const { message, title } = this.state
    return (
      <PopupBar
        title={`Hubungi ${title}`} {...this.props}
        anim={ANIMATE_HORIZONTAL}
        style={{
          background: 'rgb(239, 239, 239)',
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 56,
        }}
      >
        <div className={styles.productBar}>
          <img src="https://marketplacefile.blob.core.windows.net/profiles-testing/b8c240e7-6afe-4274-93ec-7d833657fe5b/1518597609.jpg" />
          <div className={styles.content}>
            <p>{this.props.data.loading ? 'Memuat produk...' : this.props.data.thread.productName}</p>
            <span>{this.convertToMoneyFormat(12000, 'NTD')}</span>
          </div>
          <span className={`mdi mdi-chevron-right ${styles.chevronRight}`} />
        </div>
        <div className={styles.messages}>
          {!this.props.data.loading &&
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
          <button className={styles.sendButton}>
            <span
              className={`mdi mdi-send ${styles.sendIcon} ${message.length >
                0 && styles.active}`}
            />
          </button>
        </div>

        {this.props.data.loading ? (
          <div className={styles.loading}>
            <ProgressBar mode="indeterminate" />
          </div>
        ) : (
          ''
        )}
      </PopupBar>
    )
  }
}

const getMessagesQuery = gql`
  query MessageQuery($id: Int!) {
    thread(threadId: $id, perspective: BUYER) {
      productName
      productId
      messages {
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

export default graphql(getMessagesQuery, {
  options: props => ({
    client,
    variables: {
      id: props.match.params.id,
    },
  }),
})(Conversation)
