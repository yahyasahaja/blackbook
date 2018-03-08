import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import ThreadItem from '../../components/Chat/ThreadItem'
import client from '../../services/graphql/chatClient'

import styles from './css/index.scss'

@observer
class Threads extends Component {
  render() {
    const { data } = this.props
    const { loading } = data

    return (
      <div>
        {!loading &&
          this.props.data.threads.data.map(thread => {
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
        {loading ? (
          <div className={styles.loading}>
            <ProgressBar mode="indeterminate" />
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
