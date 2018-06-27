//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import Dropdown from 'react-toolbox/lib/dropdown'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import axios from 'axios'

//STYLES
import styles from './css/new-passowrd.scss'

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
class NewPassword extends Component{
    constructor(){
        super()
        this.id = appStack.push()
        this.state = {
            password: '',
            confirmPassword: '',
            error_password: ''
        }
    }

    @observable secret = ''


    componentWillUnmount(){
        appStack.pop()
    }

    componentDidMount(){
        let {setTitle} = this.props
        setTitle('Lupa Password')
    }

    handleChange(name, value){
        if(name === 'confirmPassword'){
            if(this.state.password !== this.state.confirmPassword){
                this.setState({error_password: 'Password belum sama!'})
            }
        }
        this.setState(...this.state, { [name] : value })
    }

    // onSubmit = async (e) =>{
    //     e.preventDefault()
    //     e.stopPropagation()
        
    //     let numberExist = await this.isNumberExist
    //     if(!numberExist) return

        
    // }
    
    @computed
    get mssidn(){
        let { countryCode, telp } = this.state
        return `${countryCode}${telp}`
    }

    render(){
        return(
            <div className ={styles['container']}>
                <div className={styles.top}>
                    <div className={styles.pageTitle}>
                        Blanja
                    </div>
                    <div className={styles.desc}>
                        Masukkan password baru Anda untuk mengganti password
                    </div>
                </div>
                <form className={styles.form} onSubmit={this.onSubmit}>
                    <div className={styles.password}>
                        <Input 
                            type="password" 
                            label="Password Baru"
                            required
                            onChange={this.handleChange.bind(this, 'password')}
                            value={this.state.password}
                        />
                        <Input 
                            type="password" 
                            label="Konfirmasi Password"
                            required
                            value={this.state.confirmPassword}
                            onChange={this.handleChange.bind(this, 'confirmPassword')}
                            error={this.state.error_password}
                        />
                        {this.state.password !== this.state.confirmPassword ? <span className={styles.checkPassword}>Password harus sama</span>: ''}
                    </div>
                    <PrimaryButton type="submit">Ganti Password</PrimaryButton>                    
                </form>
            </div>


        )
    }
}

export default ForgotPassword