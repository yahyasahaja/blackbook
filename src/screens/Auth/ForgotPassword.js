//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import Dropdown from 'react-toolbox/lib/dropdown'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'

//STYLES
import styles from './css/forgot-password.scss'

//THEME
import theme from '../../assets/css/theme.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { user, snackbar, appStack } from '../../services/stores'

@observer
class ForgotPassword extends Component{
    constructor(){
        super()
        this.id = appStack.push()
        this.state = {
            countryCode : '886',
            password: '',
            confirmPassword: '',
            telp: ''
        }
    }

    componentWillUnmount(){
        appStack.pop()
    }

    componentDidMount(){
        let {title} = this.props
        title = 'Forgot Password'
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

    onSubmit = (e) =>{
        e.preventDefault()
        e.stopPropagation()

        
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
                    <Dropdown
                        auto={false}
                        source={this.countryCodes}
                        onChange={this.handleChange.bind(this,'countryCode')}
                        label="Kode Negara"
                        required
                        value={this.state.countryCode}
                    />
                    <Input 
                        type="tel" 
                        label="Nomor Telepon"
                        required
                        value={this.state.telp}
                        onChange={this.handleChange.bind(this, 'telp')}
                    />
                </form>
                
            </div>


        )
    }
}

export default ForgotPassword