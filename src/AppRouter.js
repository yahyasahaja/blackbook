//MODULES
import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Snackbar from 'react-toolbox/lib/snackbar'
import { observer } from 'mobx-react'

//SCREENS
import asyncComponent from './components/AsyncComponent'
const Home = asyncComponent(() => import('./screens/Home'))
const Favorite = asyncComponent(() => import('./screens/Favorite'))
const Promo = asyncComponent(() => import('./screens/Promo'))
const Chat = asyncComponent(() => import('./screens/Chat'))
const Conversation = asyncComponent(() => import('./screens/Chat/Conversation'))
const Account = asyncComponent(() => import('./screens/Account'))
// const PageNotFound = asyncComponent(() => import('./screens/PageNotFound'))
const Search = asyncComponent(() => import('./screens/Search'))
const Category = asyncComponent(() => import('./screens/Category'))
const Auth = asyncComponent(() => import('./screens/Auth'))
const Password = asyncComponent(() => import('./screens/Account/Password'))
const Profile = asyncComponent(() => import('./screens/Account/Profile'))

//STYLES
import styles from './assets/css/app-router.scss'

//COMPONENT
import BottomTabBar from './components/BottomTabBar'

//STORE
import { appStack, badges } from './services/stores'

//INNER_CONFIG
let BOTTOM_TAB_BAR_DATA = [
  { label: 'Home', icon: 'home', url: '/home', Component: Home },
  { label: 'Disukai', icon: 'heart', url: '/favorite', Component: Favorite, badge: badges.LIKED },
  { label: 'Promo', icon: 'tag', url: '/promo', Component: Promo },
  { label: 'Chat', icon: 'forum', url: '/chat', Component: Chat, badge: badges.CHAT },
  { label: 'Akun', icon: 'account', url: '/account', Component: Account },
]

// let bottomTabBarRouters = BOTTOM_TAB_BAR_DATA.map(data => data.url)

//COMPONENT
@observer class AppRouter extends Component {
  componentDidMount() {
    let { onlineStatus: { goOffline, goOnline }, snackbar: { show } } = this.props
    window.ononline = () => {
      goOnline()
      window.location.reload()
    }
    window.onoffline = () => {
      goOffline()
      show('You\'re offline!')
    }
    
    if (window.navigator.onLine) goOnline()
    else goOffline()
  }

  closeSnackbar = () => {
    this.props.snackbar.hide()
  }

  // renderTabBar = props => {
  //   return <div className={styles.page}>
  //   <div className={styles.content} >
  //   <Switch>
  //     <Route path="/home" component={Home} />
  //     <Route path="/favorite" component={Favorite} />
  //     <Route path="/promo" component={Promo} />
  //     <Route path="/chat" component={Chat} />
  //     <Route path="/account" component={Account} />
  //     <Route path="*" component={PageNotFound} />
  //   </Switch>
  //   </div>

  //   <Route path="*" render={props => <BottomTabBar {...props} icons={BOTTOM_TAB_BAR_DATA} />} />
  //   </div>
  // }

  render() {
    let { onlineStatus: { isOnline }, snackbar: { data: snackbar } } = this.props
    
    return (
      <BrowserRouter>
        <div className={`${styles.container} ${isOnline ? '' : styles.offline}`}>
          <Switch>
            <Redirect from="/" exact to="/home" />
            <Route path="*" render={props =>
              <BottomTabBar {...props} data={BOTTOM_TAB_BAR_DATA} appStack={appStack} />}
            />
          </Switch>
          <Switch>
            <Route path="/search" component={Search} />
            <Route path="/auth" component={Auth} />
            <Route path="/category/:category_name" component={Category} />
            <Route path="/chat/:id" component={Conversation} />
            <Route path="/account/profile" component={Profile} />
            <Route path="/account/password" component={Password} />
          </Switch>

          <section>
            <Snackbar
              action={snackbar.action}
              active={snackbar.active}
              label={snackbar.label}
              timeout={2000}
              onClick={this.closeSnackbar}
              onTimeout={this.closeSnackbar}
              type={snackbar.type}
            />
          </section>
        </div>
      </BrowserRouter>
    )
  }
}

export default AppRouter