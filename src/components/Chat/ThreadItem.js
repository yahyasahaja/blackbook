import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'react-toolbox/lib/avatar'
import moment from 'moment'

import styles from './css/thread-item.scss'
import avatarTheme from './css/avatar.scss'

const ThreadItem = ({ id, sender, message, avatar, time }) => (
  <Link to={{pathname: `/chat/${id}`, state: {sender}}} className={styles.container}>
    <Avatar
      title={sender[0].toUpperCase()}
      image={avatar}
      theme={avatarTheme}
    />
    <div className={styles.text}>
      <p className={styles.name}>{sender}</p>
      <p className={styles.message}>{message}</p>
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
