//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import Dropdown from 'react-toolbox/lib/dropdown'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import axios from 'axios'

//STYLES
import styles from './css/forgot-password.scss'

//THEME
import theme from '../../assets/css/theme.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { user, snackbar, appStack, overlayLoading } from '../../services/stores'
import { action } from 'mobx';

//CONFIG
import { getIAMEndpoint } from '../../config';
import { observable } from 'mobx';

@observer
class ForgotPassword extends Component{
    constructor(){
        super()
        this.id = appStack.push()
        this.state = {
            countryCode : '886',
            telp: '',
            otp: ''
        }
    }

    DEFAULT_COUNT = 120

    @observable count = this.DEFAULT_COUNT
    @observable secret = ''


    componentWillUnmount(){
        appStack.pop()
        this.isUnmounted = true
    }

    isUnmounted = false

    componentDidMount(){
        let {setTitle} = this.props
        setTitle('Lupa Password')
    }

    countryCodes = [
        {label: '+886', value: '886' },
        {label: '+852', value: '852' },
        {label: '+62', value: '62'}
    ]

    handleChange(name, value){
        if(name === 'telp'){
            if(value[0]=== '0'){ //if the first value is 0
                value = value.split('').slice(1).join('')
            }
        }
        this.setState(...this.state, {[name] : value})
    }

    onSubmit = async (e) =>{
        e.preventDefault()
        e.stopPropagation()
        
        let numberExist = await this.isNumberExist
        if(!numberExist) return

        
    }
    
    @computed
    get mssidn(){
        let { countryCode, telp } = this.state
        return `${countryCode}${telp}`
    }

    @action
    isNumberExist = async () =>{
        overlayLoading.show()
        try{
            let {data: {is_ok}} = await axios.post(getIAMEndpoint(`/iam/quick/${this.mssidn}`))
            overlayLoading.hide()
            this.sendOTP()
        } catch(e){
            overlayLoading.hide()
            await snackbar.show('Nomor yang dimasukkan tidak terdapat dalam Database. Silahkan ulangi kembali')
            this.props.history.push('/auth/forgot')
            throw e
        }
    }

    @action
    sendOTP = async () =>{
        let {data} = await user.sendOTP(this.mssidn)
        
        let {is_ok, data: secret } = data
        if(!is_ok) return snackbar.show('Gagal mengirimkan Kode OTP')

        this.secret = secret

    }

    @action
    decreaseCount(){

    }

    render(){
        return(
            <div className ={styles['container']}>
                <div className={styles.top}>
                    <div className={styles.pageTitle}>
                        Blanja
                    </div>
                    <div className={styles.desc}>
                        Masukkan nomor telepon Anda untuk menerima kode melalui SMS
                    </div>
                </div>
                <form className={styles.form} onSubmit={this.onSubmit}>
                    <div className={styles.tel}>
                        <Dropdown
                            auto={false}
                            source={this.countryCodes}
                            onChange={this.handleChange.bind(this,'countryCode')}
                            label="Kode Negara"
                            required
                            value={this.state.countryCode}
                            className={styles.country_code}
                        />
                        <Input 
                            type="tel" 
                            label="Nomor Telepon"
                            required
                            value={this.state.telp}
                            onChange={this.handleChange.bind(this, 'telp')}
                        />
                    </div>
                    <PrimaryButton type="submit">Lanjut</PrimaryButton>                    
                </form>
            </div>


        )
    }
}

export default ForgotPassword