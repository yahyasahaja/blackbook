import React from 'react'
import Avatar from 'react-toolbox/lib/avatar'
import moment from 'moment'

import styles from './css/chat-bubble.scss'
import avatarTheme from './css/avatar-bubble.scss'

const ChatBubble = ({
  withAvatar,
  avatarImage,
  avatarTitle,
  message,
  time,
  isMe,
  isOtherDay,
}) =>
  isMe ? (
    <div className={styles.container}>
      <span className={styles.time}>{moment(time).format('HH:mm')}</span>
      <div className={styles.bubble_alt}>
        <span>{message}</span>
      </div>
      <Avatar
        cover
        title={avatarTitle}
        image={avatarImage}
        theme={avatarTheme}
        style={{ backgroundColor: '#ea0f00' }}
      />
    </div>
  ) : (
    <div className={`${styles.container} ${styles.alt}`}>
      <Avatar title={avatarTitle} image={avatarImage} theme={avatarTheme} />
      <div className={styles.bubble}>
        <span>{message}</span>
      </div>
      <span className={`${styles.time} ${styles.alt}`}>{moment(time).format('HH:mm')}</span>
    </div>
  )

export default ChatBubble
