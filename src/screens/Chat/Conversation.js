import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import ChatBubble from '../../components/Chat/ChatBubble'
import client from '../../services/graphql/chatClient'

import styles from './css/conversation.scss'

@observer
export default class Conversation extends Component {
  render() {
    return (
      <PopupBar
        history={this.props.history}
        backLink="/chat"
        title="Chat"
        anim={ANIMATE_HORIZONTAL}
        style={{ background: 'rgb(239, 239, 239)' }}
        className={styles.container}
      >
        <ChatBubble avatarImage="" avatarTitle="A" message="Hello World" />
        <ChatBubble
          avatarImage=""
          avatarTitle="A"
          message="Ini pesan yang lumayan panjang semoga bisa sampai 2 baris ya!"
        />
        <ChatBubble
          isMe
          avatarImage=""
          avatarTitle="A"
          message="Ini pesan yang lumayan panjang semoga bisa sampai 2 baris ya!"
        />
      </PopupBar>
    )
  }
}

// const getThreadsQuery = gql`
//   {
//     threads(perspective: BUYER) {
//       data {
//         id
//         productName
//         participants {
//           id
//           displayName
//           profilePicture
//           isMe
//         }
//         messages(limit: 1) {
//           data {
//             text
//             createdAt
//           }
//         }
//       }
//     }
//   }
// `

// export default graphql(getThreadsQuery, {
//   options: {
//     client,
//   },
// })(Threads)
