//MODULES
import React, { Component }  from 'react'
// import axios from 'axios'

//STYLES
// import styles from './css/index.scss'

//COMPONENTS
import TopBar, { APPEAR } from '../../components/TopBar'
import RoundedButton from '../../components/RoundedButton'
import Card from '../../components/ProductCard'

//COMPONENT
export default class Chat extends Component {
  componentDidMount() {
    window.ontouchmove = () => this.setState({angka: Math.random()})
    window.onmsgesturechange = () => this.setState({angka2: Math.random()})
    window.addEventListener('gesturechange', () => this.setState({angka3: Math.random()}))
  }

  notify = () => {
    window.navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription().then(subscription => {
        console.log(subscription.toJSON())
        this.setState({subscription: subscription.toJSON()})
      })
    })
  }

  renderCurl() {
    let { subscription } = this.state
    if (!subscription) return

    return <div>
      CURL FOR SENDING NOTIFICATION
      <p>Chrome:<br/>
      curl "{subscription.endpoint}" --request POST --header "TTL: 60" --header "Content-Length: 0"
--header "Authorization: key=AAAAS1w2T3M:APA91bFNmYWA00_X2HSj8kKj6u-ZF2DpYrVSbS7R0zElT-VN0Iw48A7QtrsOVPvEuivH2VpFac1XNgdjUGVMCQWqKR5SgSVFigHaKdOHWJYEUjYon3EyDKhFh4LXFxbJHODrxCuMBvps"
      </p>

      <p>Firefox:<br/>
      curl "{subscription.endpoint}" --request POST --header "TTL: 60" --header "Content-Length: 0"
      </p>
    </div>
  }

  state = {
    subscription: null,
    angka: 0,
    angka2: 0,
    angka3: 0,
  }

  render() {
    let dummyData = {
      name: 'Apple iPhone X',
      price: {value: 5500, currency: 'NTD'},
      image: 'https://marketplacefile.blob.core.windows.net/products-testing/5a6ad2b2a9053101204ec1dc/5a6ada4d6c00ca1a5854d443',
      id: '989hgiugierguireg'
    }

    return (
      <TopBar 
        relative={{
          title: {cart: true},
          search: {cart: false},
        }}

        fly={{
          search: {cart: true},
          mode: APPEAR
        }} 

        isSelected={this.props.isSelected}
        style={{background: 'rgb(230, 230, 230)'}}
      >
        <Card {...dummyData} data={dummyData} />
        <h1>Example</h1>
        <RoundedButton onClick={this.notify}>Notify Me!</RoundedButton>
        {this.renderCurl()}
        <h1>Example Home change! 2</h1>
        {this.state.angka} 
        {this.state.angka2} 
        {this.state.angka3} 
        
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
        <h1>Example</h1>
      </TopBar>
    )
  }
}