import React, { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withTracker } from '../../google-analytics'

import ProgressBar from 'react-toolbox/lib/progress_bar'
import Dropdown from 'react-toolbox/lib/dropdown'
import Input from 'react-toolbox/lib/input/Input'
import Checkbox from 'react-toolbox/lib/checkbox'
import Dialog from 'react-toolbox/lib/dialog'

import { appStack, user, cart } from '../../services/stores'

import { convertCountryCodeToText } from '../../utils'

import PopupBar from '../../components/PopupBar'
import PrimaryButton from '../../components/PrimaryButton'

import orderingClient from '../../services/graphql/orderingClient'
import userClient from '../../services/graphql/userClient'

// styles
import styles from './css/process.scss'
import dropdownTheme from './css/dropdown.scss'
import loadingTheme from './css/loading.scss'
import theme from '../../assets/css/theme.scss'
import checkBoxTheme from './css/checkbox.scss'
import inputTheme from './css/input.scss'

@observer
class Process extends Component {
  constructor(props) {
    super(props)

    this.id = appStack.push()
  }

  state = {
    dataAlert: '',
    dataAlertVisible: false,
  }

  componentWillMount() {
    if (
      !user.isLoggedIn ||
      !this.props.location.state ||
      !this.props.location.state.shippingCost
    ) {
      this.props.history.replace('/cart')
      return
    }
  }

  componentWillUnmount() {
    appStack.pop()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user || !nextProps.user.getUser) return

    const { getUser: userData } = nextProps.user
    let address = []

    if(userData.address != null && userData.city != null && userData.zip_code != null){
      // push to array if userData not null
      address.push({
        address: userData.address,
        city: userData.city,
        zip_code: userData.zip_code,
        country: userData.country,
      })
    }

    address = address.concat(userData.otherAddress)
    cart.addressList = address
  }

  // address section
  renderAddress() {
    let options = [
      { value: 'none', label: 'Pilih alamat pengiriman', disabled: true },
      { value: 'new', label: 'Alamat Baru' },
      { value: 'newfoto', label: 'Alamat Baru (Foto)' },
    ]

    const addr = cart.addressList.map((addr, i) => ({
      value: i,
      label: `${addr.city}, ${addr.address}`,
    }))

    // add to options
    if (addr.length > 0) {
      options.splice(
        1,
        0,
        ...addr,
      )
    }

    return (
      <div className={styles.section}>
        <Dropdown
          className="address-dropdown"
          label="ALAMAT"
          onChange={value => {
            cart.address = value
          }}
          source={options}
          value={cart.address}
          theme={dropdownTheme}
        />

        {cart.address === 'new' && (
          <Fragment>
            <Input
              name="new-address"
              theme={{ ...theme, ...inputTheme }}
              type="text"
              hint="Alamat Pengiriman"
              label="Alamat"
              multiline
              value={cart.newAddress.address}
              onChange={val => {
                cart.newAddress = { ...cart.newAddress, address: val }
              }}
            />
            <Input
              name="new-city"
              theme={{ ...theme, ...inputTheme }}
              type="text"
              hint="Kota Pengiriman"
              label="Kota"
              value={cart.newAddress.city}
              onChange={val => {
                cart.newAddress = { ...cart.newAddress, city: val }
              }}
            />
            <Input
              name="new-zipcode"
              theme={{ ...theme, ...inputTheme }}
              type="text"
              hint="Kode Pos Pengiriman"
              label="Kode Pos"
              value={cart.newAddress.zip_code}
              onChange={val => {
                cart.newAddress = { ...cart.newAddress, zip_code: val }
              }}
            />
            <Input
              name="new-country"
              theme={{ ...theme, ...inputTheme }}
              type="text"
              hint="Negara Pengiriman"
              label="Negara"
              value={convertCountryCodeToText(user.data.country)}
              disabled
            />
            <Checkbox
              className={`${styles.check} new-save-checkbox`}
              theme={checkBoxTheme}
              checked={cart.saveNewAddress}
              label="Simpan alamat baru"
              onChange={() => {
                cart.saveNewAddress = !cart.saveNewAddress
              }}
            />
          </Fragment>
        )}

        {cart.address === 'newfoto' && (
          <Fragment>
            <input
              name="address-file"
              type="file"
              ref={el => {
                this.fotoRef = el
              }}
              onChange={e => {
                let files = e.target.files || e.dataTransfer.files
                if (!files || files.length < 0) return
                cart.addressFotoFile = files[0]
                cart.addressFoto = URL.createObjectURL(files[0])
              }}
              style={{ display: 'none' }}
            />
            <img
              className={styles.foto}
              src={cart.addressFoto}
              onClick={() => this.fotoRef.click()}
            />
            <Input
              name="information"
              theme={{ ...theme, ...inputTheme }}
              type="text"
              hint={
                <span className={styles.hint}>
                  Tambahkan informasi lainnya (ex: lantai, no apartemen, dsb.)
                </span>
              }
              multiline
              value={cart.addressFotoInformation}
              onChange={val => {
                cart.addressFotoInformation = val
              }}
            />
          </Fragment>
        )}

        {['none', 'new', 'newfoto'].indexOf(cart.address) === -1 && (
          <p data-testid="address-detail">
            {cart.addressList[cart.address].address}
            <br />
            {cart.addressList[cart.address].city}
            <br />
            {cart.addressList[cart.address].country +
              ' ' +
              cart.addressList[cart.address].zip_code}
          </p>
        )}
      </div>
    )
  }

  // channel section
  renderChannel() {
    const channels = this.props.channels.allChannels.map((channel, index) => ({
      value: index + 1,
      label: channel.name,
      key: channel.key
    }))

    channels.unshift({
      value: 'none',
      label: 'Pilih channel pembayaran',
      disabled: true,
    })

    const logo = {
      HILIFETW: 'https://paygw.azureedge.net/images/hilifelogo.png',
      FAMILYTW: 'https://paygw.azureedge.net/images/familogo.png',
      AS2IN1WAL: 'http://as2in1mobile.com/images/As2in1-Mobile-logo.png'
    }

    return (
      <div className={styles.section}>
        <Dropdown
          className="channel-dropdown"
          label="CHANNEL PEMBAYARAN"
          onChange={value => {
            cart.channelIndex = value
            cart.channel = channels[value].key
            cart.channelName = channels[value].label
          }}
          source={channels}
          value={cart.channelIndex}
          theme={dropdownTheme}
        />
        {cart.channel !== 'none' && (
          <img 
            className={cart.channel === 'AS2IN1WAL' ? styles.as2in1 : ''}
            data-testid="channel-logo" 
            data-channel={cart.channel} 
            src={logo[cart.channel]} 
          />
        )}
        {cart.channel !== 'none' && (
          <p>Tunjukan barcode pembayaran yang akan anda terima kepada kasir</p>
        )}
      </div>
    )
  }

  // check if all data are filled
  check() {
    const {
      address,
      newAddress,
      addressFotoFile,
      addressFotoInformation,
      channel,
    } = cart
    if (address === 'none' || channel === 'none') {
      this.setState({
        dataAlert: 'Silahkan tentukan alamat pengiriman dan channel pembayaran',
      })
      return false
    }
    if (address === 'new') {
      if (
        newAddress.address === '' ||
        newAddress.city === '' ||
        newAddress.zip_code === ''
      ) {
        this.setState({
          dataAlert: 'Pastikan anda telah melengkapi data alamat pengiriman',
        })
        return false
      }
    }
    if (address === 'newfoto') {
      if (addressFotoFile === null || addressFotoInformation.length < 2) {
        this.setState({
          dataAlert:
            'Pastikan anda telah melengkapi foto alamat dan informasi pengiriman',
        })
        return false
      }
    }

    return true
  }

  continue() {
    const {
      address,
      newAddress,
      addressList,
      addressFoto,
      addressFotoFile,
      addressFotoInformation,
      channel,
      channelName,
    } = cart
    if (!this.check()) {
      this.setState({ dataAlertVisible: true })
      return
    }

    let confirmAddress
    if (address === 'new') {
      confirmAddress = newAddress
    } else if (address === 'newfoto') {
      confirmAddress = {
        img: addressFoto,
        foto: addressFotoFile,
        information: addressFotoInformation,
      }
    } else {
      confirmAddress = addressList[address]
    }

    this.props.history.push('/cart/confirm', {
      ...this.props.location.state,
      type: address === 'newfoto' ? 'foto' : 'address',
      saveNewAddress: cart.saveNewAddress,
      address: confirmAddress,
      channel,
      channelName,
    })
  }

  render() {
    const { channels, user } = this.props

    return (
      <PopupBar
        // anim={ANIMATE_HORIZONTAL}
        onBack={e => {
          e.preventDefault()
          this.props.history.goBack()
        }}
        title="Detail Pembelian"
        {...this.props}
        style={{
          background: 'rgb(239, 239, 239)',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 88,
          paddingTop: 56,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Dialog
          actions={[
            {
              label: 'OK',
              onClick: () => {
                this.setState({ dataAlertVisible: false })
              },
            },
          ]}
          title="Data Tidak Lengkap"
          active={this.state.dataAlertVisible}
          onEscKeyDown={() => this.setState({ dataAlertVisible: false })}
          onOverlayClick={() => this.setState({ dataAlertVisible: false })}
        >
          <p>{this.state.dataAlert}</p>
        </Dialog>
        {channels.allChannels && user.getUser && this.renderAddress()}
        {channels.allChannels && user.getUser && this.renderChannel()}
        {(channels.loading || user.loading) && (
          <div className={styles.loading}>
            <ProgressBar
              theme={loadingTheme}
              type="circular"
              mode="indeterminate"
            />
          </div>
        )}

        <div className={`${styles.section} ${styles.action}`}>
          <PrimaryButton
            onClick={() => this.continue()}
            className={styles.buyButton}
          >
            PESAN
          </PrimaryButton>
        </div>
      </PopupBar>
    )
  }
}

const getAllChannelsQuery = gql`
  query getAllChannels {
    allChannels {
      country
      name
      key
    }
  }
`

const getUserDataQuery = gql`
  query UserData {
    getUser {
      uuid
      name
      address
      city
      zip_code
      country
      otherAddress {
        id
        address
        city
        country
        zip_code
      }
    }
  }
`

export default compose(
  withTracker,
  graphql(getAllChannelsQuery, {
    name: 'channels',
    options: {
      client: orderingClient,
    },
  }),
  graphql(getUserDataQuery, {
    name: 'user',
    options: {
      client: userClient,
    },
  }),
)(Process)
