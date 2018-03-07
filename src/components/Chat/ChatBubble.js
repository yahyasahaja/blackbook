import React from 'react'
import Avatar from 'react-toolbox/lib/avatar'

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
      <div className={styles.bubble_alt}>
        <span>{message}</span>
      </div>
      <Avatar
        title={avatarTitle}
        image={avatarImage}
        theme={avatarTheme}
        style={{ backgroundColor: '#ea0f00' }}
      />
    </div>
  ) : (
    <div className={styles.container}>
      <Avatar title={avatarTitle} image={avatarImage} theme={avatarTheme} />
      <div className={styles.bubble}>
        <span>{message}</span>
      </div>
    </div>
  )

export default ChatBubble
