import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import ThreadItem from '../../components/Chat/ThreadItem'
import client from '../../services/graphql/chatClient'
import { user } from '../../services/stores'

import styles from './css/index.scss'
import loadingTheme from './css/loading-submit.scss'

@observer 
class Threads extends Component {
  componentWillReceiveProps(nextProps) {
    if(nextProps.isSelected && !user.isLoggedIn) {
      return this.props.history.replace('/account')
    }

    this.props.data.refetch()
  }

  render() {
    const { data } = this.props
    const { loading, threads, error } = data
    if(!user.isLoggedIn || error) {
      return null
    } 

    return (
      <div>
        {!loading && threads.data.length === 0 && (
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
                sender={sender.displayName}
                message={thread.messages.data[0].text}
                time={thread.messages.data[0].createdAt}
              />
            )
          })}
        {this.props.data.loading ? (
          <div className={styles.loading}>
            <ProgressBar theme={loadingTheme} type="circular" mode="indeterminate" theme={Progr} />
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
