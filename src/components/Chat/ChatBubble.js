import React, { Component, Fragment } from 'react'
import Avatar from 'react-toolbox/lib/avatar'
import moment from 'moment'

import styles from './css/chat-bubble.scss'
import avatarTheme from './css/avatar-bubble.scss'

moment.updateLocale('id', {
  months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split(
    '_',
  ),
  weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
  calendar: {
    lastDay: '[Kemarin]',
    sameDay: '[Hari Ini]',
    nextDay: '[Besok]',
    lastWeek: 'dddd, D MMMM',
    nextWeek: 'dddd, D MMMM',
    sameElse: 'dddd, D MMMM YYYY',
  },
})

export default class ChatBubble extends Component {
  render() {
    const {
      avatarImage,
      avatarTitle,
      message,
      time,
      isMe,
      isOtherDay,
    } = this.props

    return (
      <Fragment>
        {isOtherDay && (
          <span className={styles.day}>{moment(time).calendar()}</span>
        )}
        {isMe ? (
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
            <Avatar
              title={avatarTitle}
              image={avatarImage}
              theme={avatarTheme}
            />
            <div className={styles.bubble}>
              <span>{message}</span>
            </div>
            <span className={`${styles.time} ${styles.alt}`}>
              {moment(time).format('HH:mm')}
            </span>
          </div>
        )}
      </Fragment>
    )
  }
}
