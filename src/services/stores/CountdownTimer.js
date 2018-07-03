import { observable, action } from 'mobx'
import { snackbar } from '../../services/stores'


//CONFIG
import {
} from '../../config'

class Countdown{
  
  
  @observable min_countdown
  @observable sec_countdown
  @observable countdownIntervalId = null
  @observable history
  
  setCountdownTimer = () =>{
    console.log(this.min_countdown)
    if(this.min_countdown >= 0){
      this.countdownIntervalId = setInterval( () => this.decreaseCount(), 1000 )
    }
  }

  @action
  decreaseCount = () => {
    console.log(this.min_countdown)
    if(this.min_countdown === 0 && this.sec_countdown === 0){
      clearInterval(this.countdownIntervalId)
      snackbar.show('Waktu untuk penggantian password telah habis! Silakan ulangi kembali')
      this.history.push('/auth/forgot')
    } else if(this.sec_countdown === 0){
      this.sec_countdown = 59      
      return --this.min_countdown
    } else {
      return --this.sec_countdown
    }
    
  }

}

export default new Countdown()