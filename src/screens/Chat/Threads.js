import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import ThreadItem from '../../components/Chat/ThreadItem'
import client from '../../services/graphql/chatClient'
import { user, onlineStatus, badges } from '../../services/stores'

import styles from './css/index.scss'
import loadingTheme from './css/loading-submit.scss'

@observer 
class Threads extends Component {
  componentWillReceiveProps(nextProps) {
    if(nextProps.isSelected && !user.isLoggedIn) {
      return this.props.history.replace('/account')
    }

    if(onlineStatus.isOnline) this.props.data.refetch()
  }

  componentDidMount() {
    // refetch when there is a new notification
    navigator.serviceWorker.onmessage = (e) => {
      if(e.type === 'message') {
        this.props.data.refetch()
        badges.inc(badges.CHAT)
      }
    }
  }

  componentWillUnmount() {
    // remove notification listener
    navigator.serviceWorker.onmessage = null
  }

  render() {
    const { data } = this.props
    const { threads, error } = data
    if(!user.isLoggedIn || error) {
      return null
    } 

    return (
      <div>
        {threads && threads.data.length === 0 && (
          <div className={styles.empty}>
            <p>Chat mu masih kosong</p>
            <span className="mdi mdi-message-processing" />
          </div>
        )}
        {threads &&
          threads.data.map(thread => {
            const sender = thread.participants[0].isMe
              ? thread.participants[1]
              : thread.participants[0]
            return (
              <ThreadItem
                id={thread.id}
                key={thread.id}
                sender={sender}
                productName={thread.productName}
                message={thread.messages.data[0].text}
                time={thread.messages.data[0].createdAt}
              />
            )
          })}
        {this.props.data.loading ? (
          <div className={styles.loading}>
            <ProgressBar theme={loadingTheme} type="circular" mode="indeterminate" />
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

const getThreadsQuery = gql`
  {
    threads(perspective: BUYER) {
      data {
        id
        productOwner
        productName
        participants {
          id
          displayName
          profilePicture
          isMe
        }
        messages(limit: 1) {
          data {
            text
            createdAt
          }
        }
      }
    }
  }
`

export default graphql(getThreadsQuery, {
  options: {
    client,
  },
})(Threads)
