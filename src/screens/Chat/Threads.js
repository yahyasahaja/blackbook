import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import ThreadItem from '../../components/Chat/ThreadItem'
import client from '../../services/graphql/chatClient'
import { user, onlineStatus, badges, chat } from '../../services/stores'

import styles from './css/index.scss'
import loadingTheme from './css/loading-submit.scss'
import { observable } from 'mobx'

@observer 
class Threads extends Component {
  componentWillReceiveProps(nextProps) {
    if(nextProps.isSelected && nextProps.location.pathname === '/chat') {
      // refetch when there is a new notification
      navigator.serviceWorker.onmessage = (e) => {
        if(e.type === 'message') {
          this.fetchThreads()
          badges.inc(badges.CHAT)
        }
      }
    }

    if(this.props.isSelected && onlineStatus.isOnline && this.props.location.pathname !== '/chat') {
      this.fetchThreads()
    }

    if(this.props.isSelected && !user.isLoggedIn) {
      return this.props.history.replace('/account')
    }
  }

  async fetchThreads() {
    try {
      let { data: { threads } } = await client.query({
        query: getThreadsQuery,
        fetchPolicy: 'network-only'
      })
      
      chat.threads = threads.data.map((x, index) => {
        const thread = Object.assign({}, x)
        const currentThread = chat.threads.length > 0 ? chat.threads[index] : null

        if(currentThread && !thread.messages.data[0].createdBy.isMe) {
          thread.isRead = currentThread.isRead && thread.messages.data[0].id <= currentThread.messages.data[0].id
        } else {
          thread.isRead = true
        }

        return thread
      })
    } catch (e) {
      console.log('ERROR FETCHING THREADS', e)
    }
  }

  componentDidMount() {
    if(this.props.isSelected && !user.isLoggedIn) {
      return this.props.history.replace('/account')
    }

    this.fetchThreads()
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
          chat.threads.slice().map((thread, index) => {
            const sender = thread.participants[0].isMe
              ? thread.participants[1]
              : thread.participants[0]
            return (
              <ThreadItem
                id={thread.id}
                index={index}
                key={thread.id}
                sender={sender}
                isRead={thread.isRead}
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
  query getThreadsQuery {
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
            id
            text
            createdAt
            createdBy {
              id
              isMe
            }
          }
        }
      }
    }
  }
`

export default graphql(getThreadsQuery, {
  skip: () => !user.isLoggedIn,
  options: {
    client,
    fetchPolicy: 'cache-and-network',
  },
})(Threads)
