import React, { Component } from 'react'
import PrimaryButton from './PrimaryButton'
import styles from './css/overlay-install.scss'
import { serviceWorkerUpdate as swu } from '../services/stores'

export default class OverlayInstall extends Component {
  overlayPhoto = [
    {
      src: require('../assets/img/overlay/first.png'),
      desc: 'Tap Menu Bar Browser'
    },
    {
      src: require('../assets/img/overlay/second.png'),
      desc: 'Pilih Tambah Ke Layar Utama'
    },
    {
      src: require('../assets/img/overlay/third.png'),
      desc: 'Tap Tambah'
    }
  ]

  state = {
    checked: false
  }

  handler = () => {
    if (this.state.checked)
      localStorage.setItem('blanja-hash-appinstalled', false)
    swu.setManualGuide(false)
  }

  componentDidMount() {
    console.log(styles)
  }
  render() {
    return (
      <div className={styles.overlay}>
        <h1>Tambahkan Aplikasi ke layar utama dengan 3 langkah!</h1>
        <p className={styles.desc}>Untuk mengakses lebih mudah dan cepat</p>
        <ul className={styles.listWrapper}>
          {this.overlayPhoto.map((el, idx) => (
            <li key={idx} className={styles.list}>
              <p>
                {idx + 1}. {el.desc}
              </p>
              <img src={el.src} className={styles.img} alt={`overlay-${idx}`} />
            </li>
          ))}
        </ul>
        <div className={`${styles.flexWrap} ${styles.spaceBetween}`}>
          <div className={`${styles.left} ${styles.flexWrap}`}>
            <input
              type="checkbox"
              id="know"
              checked={this.state.checked}
              onChange={() => {
                this.setState(prev => ({ checked: !prev.checked }))
              }}
            />
            <label htmlFor="know">Jangan tampilkan lagi</label>
          </div>
          <div className={styles.right}>
            <PrimaryButton onClick={this.handler}>OK</PrimaryButton>
          </div>
        </div>
      </div>
    )
  }
}
