import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'react-toolbox/lib/avatar'
import moment from 'moment'

import styles from './css/thread-item.scss'
import avatarTheme from './css/avatar.scss'

const ThreadItem = ({ index, id, sender, isRead, productName, message, time }) => (
  <Link to={{pathname: `/chat/${id}`, state: {sender: sender.displayName, index}}} className={styles.container}>
    <Avatar
      title={sender.displayName.toUpperCase()}
      image={sender.profilePicture}
      theme={avatarTheme}
    />
    <div className={styles.text}>
      <p className={styles.name}>{`${productName} (${sender.displayName})`}</p>
      <p className={`${styles.message} ${isRead ? '' : styles.unread}`}>{message}</p>
    </div>
    <span className={styles.time}>
      {moment(time).calendar(null, {
        lastDay: '[Kemarin]',
        sameDay: 'HH:mm',
        nextDay: '[Besok]',
        lastWeek: 'DD/MM',
        nextWeek: 'DD/MM',
        sameElse: 'DD/MM',
      })}
    </span>
  </Link>
)

export default ThreadItem
