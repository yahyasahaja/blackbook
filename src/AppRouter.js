//MODULES
import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Snackbar from 'react-toolbox/lib/snackbar'
import { observer } from 'mobx-react'
import Dialog from 'react-toolbox/lib/dialog'
import ProgressBar from 'react-toolbox/lib/progress_bar'

//SCREENS
import asyncComponent from './components/AsyncComponent'
const Home = asyncComponent(() =>
  import(/*webpackChunkName: "Home"*/ './screens/Home')
)
const Favorite = asyncComponent(() =>
  import(/*webpackChunkName: "Favorite"*/ './screens/Favorite')
)
const Promo = asyncComponent(() =>
  import(/*webpackChunkName: "Promo"*/ './screens/Promo')
)
const Chat = asyncComponent(() =>
  import(/*webpackChunkName: "Chat"*/ './screens/Chat')
)
const Conversation = asyncComponent(() =>
  import(/*webpackChunkName: "Conversation"*/ './screens/Chat/Conversation')
)
const Account = asyncComponent(() =>
  import(/*webpackChunkName: "Account"*/ './screens/Account')
)
// const PageNotFound = asyncComponent(() => import(/*webpackChunkName: "PageNotFound"*/'./screens/PageNotFound'))
const Search = asyncComponent(() =>
  import(/*webpackChunkName: "Search"*/ './screens/Search')
)
const Category = asyncComponent(() =>
  import(/*webpackChunkName: "Category"*/ './screens/Category')
)
const Auth = asyncComponent(() =>
  import(/*webpackChunkName: "Auth"*/ './screens/Auth')
)
const Password = asyncComponent(() =>
  import(/*webpackChunkName: "Password"*/ './screens/Account/Password')
)
const Profile = asyncComponent(() =>
  import(/*webpackChunkName: "Profile"*/ './screens/Account/Profile')
)
const Cart = asyncComponent(() =>
  import(/*webpackChunkName: "Cart"*/ './screens/Cart')
)
const CartProcess = asyncComponent(() =>
  import(/*webpackChunkName: "CartProcess"*/ './screens/Cart/Process')
)
const CartConfirm = asyncComponent(() =>
  import(/*webpackChunkName: "CartConfirm"*/ './screens/Cart/Confirmation')
)
const PromoDetail = asyncComponent(() =>
  import(/*webpackChunkName: "PromoDetail"*/ './screens/Promo/PromoDetail')
)
const Product = asyncComponent(() =>
  import(/*webpackChunkName: "Product"*/ './screens/Product')
)
const Overlay = asyncComponent(() =>
  import(/*webpackChunkName: "Overlay"*/ './components/OverlayInstall')
)
const Sellers = asyncComponent(() =>
  import(/*webpackChunkName: "Product"*/ './screens/Sellers')
)
const Transaction = asyncComponent(() =>
  import(/*webpackChunkName: "Transaction"*/ './screens/Account/Transaction')
)
const Seller = asyncComponent(() => 
  import(/*webpackChunkName: "Seller"*/ './screens/Seller')
)

const PWASupport = asyncComponent(() => 
  import(/*webpackChunkName: "PWA"*/ './screens/PWA')
)

//STYLES
import styles from './assets/css/app-router.scss'
import ProgressBarTheme from './assets/css/theme-progress-bar-white.scss'

//COMPONENT
import BottomTabBar from './components/BottomTabBar'
import Info from './components/Info'

//STORE
import {
  appStack,
  badges,
  dialog,
  serviceWorkerUpdate as swu,
  overlayLoading,
  reloadCountdownTimer as rct,
  user,
  country,
  cart,
  favorites,
  // snackbar
} from './services/stores'
import CountrySelection from './components/CountrySelection'
// snackbar.show('lul')
// setTimeout(() => snackbar.show('lul 2'), 3000)

//INNER_CONFIG
let BOTTOM_TAB_BAR_DATA = [
  { label: 'Home', icon: 'home', url: '/home', Component: Home },
  {
    label: 'Disukai',
    icon: 'heart',
    url: '/favorite',
    Component: Favorite,
    badge: badges.LIKED
  },
  { label: 'Promo', icon: 'tag', url: '/promo', Component: Promo },
  {
    label: 'Chat',
    icon: 'forum',
    url: '/chat',
    Component: Chat,
    badge: badges.CHAT
  },
  { label: 'Akun', icon: 'account', url: '/account', Component: Account }
]

// let bottomTabBarRouters = BOTTOM_TAB_BAR_DATA.map(data => data.url)

//COMPONENT
@observer
class AppRouter extends Component {
  componentDidMount() {
    let {
      onlineStatus: { goOffline, goOnline },
      snackbar: { show }
    } = this.props
    window.ononline = () => {
      goOnline()
      // window.location.reload()
    }
    window.onoffline = () => {
      goOffline()
      show('You\'re offline!')
    }

    if (window.navigator.onLine) goOnline()
    else goOffline()

    // new message badge
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.onmessage = e => {
        if (e.type === 'message') {
          badges.inc(badges.CHAT)
        }
      }
    }

    let buildDate = 'BUILD_DATE_FORMATTED'
    console.log(`BUILD-${buildDate}`)

    user.fetchData().then(data => {
      if (data) user.registerPushSubscription()
      cart.fetchData(true)
      favorites.fetchData()
    }).catch(e => console.log('CANT FETCH USER DATA', e))
  }

  closeSnackbar = () => {
    this.props.snackbar.hide()
  }

  // renderTabBar = props => {
  //   return <div className={styles.page}>
  //   <div className={styles.content} >
  //   <Switch>
  //     <Route path="/home" component={Home)} />
  //     <Route path="/favorite" component={Favorite)} />
  //     <Route path="/promo" component={Promo)} />
  //     <Route path="/chat" component={Chat)} />
  //     <Route path="/account" component={Account)} />
  //     <Route path="*" component={PageNotFound)} />
  //   </Switch>
  //   </div>

  //   <Route path="*" render={props => <BottomTabBar {...props} icons={BOTTOM_TAB_BAR_DATA} />} />
  //   </div>
  // }

  renderOverlayLoading() {
    if (overlayLoading.isActive)
      return (
        <section>
          <div className={styles.loading}>
            <div>
              <ProgressBar
                type="circular"
                mode="indeterminate"
                theme={ProgressBarTheme}
              />
            </div>
          </div>
        </section>
      )
  }

  render() {
    let {
      onlineStatus: { isOnline },
      snackbar: { data: snackbar }
    } = this.props

    return (
      <BrowserRouter>
        <div className={styles.container}>
          {swu.showManualGuide && <Overlay />}
          <div
            className={`${isOnline ? '' : styles.offline} ${styles.wrapper} ${
              swu.showManualGuide ? styles.nonOverlay : ''
            }`}
          >
            <Switch>
              <Redirect from="/" exact to="/home" />
              
              <Route
                path="*"
                render={props => (
                  <BottomTabBar
                    {...props}
                    data={BOTTOM_TAB_BAR_DATA}
                    appStack={appStack}
                  />
                )}
              />
            </Switch>
            <Switch>
              <Route path="/search" component={Search} />
              <Route path="/auth" component={Auth} />
              <Route path="/category/:category_name" component={Category} />
              <Route path="/chat/:id" component={Conversation} />
              <Route path="/cart/process" component={CartProcess} />
              <Route path="/cart/confirm" component={CartConfirm} />
              <Route path="/cart" component={Cart} />
              <Route path="/account/profile" component={Profile} />
              <Route path="/account/password" component={Password} />
              <Route path="/account/transaction" component={Transaction} />
              <Route path="/promo/:promotion_id" component={PromoDetail} />
              <Route path="/product/:product_id" component={Product} />
              <Route path="/seller/:seller_id" component={Seller}/>
              <Route path="/sellers" component={Sellers} />
              <Route path="/app-support" component={PWASupport}/>
              <Route path="/home" component={null} />
              <Route path="/chat" component={null} />
              <Route path="/favorite" component={null} />
              <Route path="/promo" component={null} />
              <Route path="/account" component={null} />
              <Redirect from ="*" exact to="/home"/>                                                                                                                                                                                                        />
            </Switch>
          </div>

          <section>
            {country.currentCountry ? <CountrySelection /> : null}
          </section>

          <section>
            <Snackbar
              action={snackbar.action}
              active={snackbar.active}
              label={snackbar.label}
              timeout={snackbar.timeout}
              onClick={this.closeSnackbar}
              onTimeout={this.closeSnackbar}
              type={snackbar.type}
            />
          </section>
          <section>
            <Dialog
              actions={dialog.actions}
              active={dialog.active}
              onEscKeyDown={dialog.onEscKeyDown}
              onOverlayClick={dialog.onOverlayClick}
              title={dialog.title}
            >
              {dialog.content}
            </Dialog>
          </section>
          <section>
            <Dialog
              actions={[
                {
                  label: `Reload ${rct.countDown}`,
                  onClick: rct.refreshPage
                }
              ]}
              active={rct.shouldReload}
              title="Telah terjadi kesalahan!"
            >
              Klik reload untuk memuat ulang
            </Dialog>
          </section>
          <section>
            <Dialog
              actions={[
                {
                  label: `Reload ${swu.countDown}`,
                  onClick: swu.refreshPage
                }
              ]}
              active={swu.shouldUpdate}
              title="Pembaruan Aplikasi Telah Tersedia!"
            >
              Klik reload untuk memperbarui aplikasi
            </Dialog>
          </section>
          <section>
            <Dialog
              actions={[
                {
                  label: 'Batal',
                  onClick: () => {
                    swu.setCancellable(true)
                    swu.setManualGuide(true, true)
                  }
                },
                {
                  label: 'Tambahkan Ke Layar Utama',
                  onClick: () => {
                    swu.installPrompt()
                    swu.setShowPrompt(false)
                  }
                }
              ]}
              active={swu.showPrompt}
              title="Tambahkan Aplikasi ke Layar Utama"
            >
              Lebih cepat dan praktis untuk membuka aplikasi.
            </Dialog>
          </section>
          <section>
            <Dialog
              actions={[
                {
                  label: 'Tidak',
                  onClick: () => {
                    swu.setCancellable(false)
                  }
                },
                {
                  label: 'Ya',
                  onClick: () => {
                    localStorage.setItem('jualbli-hash-appinstalled', false)
                    swu.setCancellable(false)
                    swu.setShowPrompt(false)
                  }
                }
              ]}
              active={swu.cancellable}
              title="Apakah Anda yakin?"
            >
              Anda harus menambahkan aplikasi secara manual pada sesi
              berikutnya.
            </Dialog>
          </section>
          {this.renderOverlayLoading()}
          <section>
            <Info />
          </section>
        </div>
      </BrowserRouter>
    )
  }
}

export default AppRouter
