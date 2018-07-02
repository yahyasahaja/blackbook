import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx'
import axios from 'axios'
import Raven from 'raven-js'
import ReactGA from 'react-ga'
import { snackbar } from '../../services/stores'

//CONFIG
import {
  getIAMEndpoint,
} from '../../config'

//TOKENS
import tokens from './Tokens'

//UTILS
import {
  getSubscription,
  getQueryString,
} from '../../utils'

@observer
class Countdown{
  
  
  @observable min_countdown
  @observable sec_countdown
  @observable countdownIntervalId = null

  
  setCountdownTimer = () =>{
    console.log(this.min_countdown)
    if(this.min_countdown >= 0){
      this.countdownIntervalId = setInterval( () => this.decreaseCount(), 1000 )
    }
  }

  @action
  decreaseCount = () => {
    if(this.min_countdown === 0 && this.sec_countdown === 0){
      clearInterval(this.countdownIntervalId)
      snackbar.show("Waktu untuk penggantian password telah habis! Silakan ulangi kembali")
      this.props.history.push("/auth/forgot")
    } else if(this.sec_countdown === 0){
      this.sec_countdown = 59      
      return --this.min_countdown
    } else {
      return --this.sec_countdown
    }
    
  }

}

export default new Countdown()