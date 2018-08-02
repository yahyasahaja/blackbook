//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'


//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'

//STYLES
import styles from './css/pwa-support.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'
import Badge from '../../components/Badge'


let serviceWorkerSupported = 'serviceWorker' in navigator
let cacheSupported = 'caches' in window
let pushSupported = 'serviceWorker' in navigator && 'PushManager' in window
let bgSyncSupported = 'serviceWorker' in navigator && 'SyncManager' in window
// let periodicSyncSupported = 'serviceWorker' in navigator && typeof ServiceWorkerRegistration.prototype.periodicSync !== 'undefined'
let indexedDbSupported = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
let storageSupported = 'storage' in navigator && 'StorageManager' in window
let persistentStorageSupported = navigator.storage && navigator.storage.persist
let fileApiSupported = ('File' in window && 'FileReader' in window && 'FileList' in window && 'Blob' in window)
// let btSupported = 'bluetooth' in navigator
let mediaDevicesSupported = 'mediaDevices' in navigator
let geoSupported = 'geolocation' in navigator
let buildDate = 'BUILD_DATE_FORMATTED'

class PWASupport extends Component{
  
  isMount = false
  buildDateFormatted = ''

  supportedPWA = [
    {
      'name': 'Service Worker',
      'key': serviceWorkerSupported
    },
    {
      'name': 'Cache',
      'key': cacheSupported
    },
    {
      'name': 'Push Notification',
      'key': pushSupported
    },
    {
      'name': 'Background Sync',
      'key': bgSyncSupported
    },
    {
      'name': 'Index DB',
      'key': indexedDbSupported
    },
    {
      'name': 'Storage',
      'key': storageSupported
    },
    {
      'name': 'Persistent Storage',
      'key': persistentStorageSupported
    },
    {
      'name': 'File API',
      'key': fileApiSupported
    },
    {
      'name': 'Media Device',
      'key': mediaDevicesSupported
    },
    {
      'name': 'Geolocation',
      'key': geoSupported
    }
  ]


  componentDidMount = () => {
    this.isMount = true
    this.formattingBuildDate()
  }

  formattingBuildDate = () => {
    let date = buildDate
    let nowDate = new Date()

    let currentMonth = nowDate.getMonth()
    console.log(currentMonth)

    let currentMonthFormatted = '0' + (currentMonth+1)
    console.log(currentMonthFormatted)
    let arrayDate = date.split('')


    arrayDate.splice(2, 5, currentMonthFormatted)
    let arrJoin = arrayDate.join('')

    let separatorSplit = arrJoin.split('-')

    this.buildDateFormatted = separatorSplit.join('')
  }

  renderContent = () => {
    if(!this.isMount){
      return (
        <div className={styles.container}>
          <ProgressBar
            className={styles.loading}
            type='circular' theme={ProgressBarTheme}
            mode='indeterminate'
          />
        </div>
      )
    }

    
    console.log('SW supported' , serviceWorkerSupported)
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          { 
            this.renderSupportedFeature()
          }
        </div>
        <div className={styles.build}>
          Build: { this.buildDateFormatted } 
        </div>
      </div>
    )
  }

  renderSupportedFeature = () => {
    return this.supportedPWA.map((feature,i) => {
      return (
        <div key={i} className={styles.features} >
          <span className={styles.text}> {feature.name}</span>
          { feature.key 
            ? 
            <div className={styles.icon}> 
              <Badge icon="check-circle"/> 
            </div> 
            : 
            <div className={styles.iconNotSupported}>
              <Badge icon="file-excel-box"/> 
            </div>
          }
        </div>
      )
    })
  }
  
  render(){
    return(
      <PopupBar
        title="Dukungan Aplikasi" {...this.props}
        renderContent={this.renderContent}
        anim={ANIMATE_HORIZONTAL}
        cart
      />
    )
  }
}

export default PWASupport