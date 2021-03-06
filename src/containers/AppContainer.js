import React, { PropTypes } from 'react'
import { Router } from 'react-router'
import { connect, Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import * as messages from 'translations/'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { loginUserSuccess } from 'modules/auth'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

class AppContainer extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    routerKey: PropTypes.number,
    store: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    auth: PropTypes.object.isRequired
  }

  render () {
    const { auth, history, routes, routerKey, store } = this.props

    const intlData = {
      locale: this.props.locale,
      messages: messages.translations[this.props.locale]
    }

    let token = localStorage.getItem('token')
    let user = JSON.parse(localStorage.getItem('user'))
    if (!auth['isAuthenticated'] && token !== 'undefined' && token !== null && user !== 'undefined' && user !== null) {
      // If token expiration is more than one hour from now keep using
      const hourFromNowSec = Math.floor(Date.now() / 1000) + 3600
      if (user.exp > hourFromNowSec) {
        store.dispatch(loginUserSuccess(token, user))
      }
    }

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <IntlProvider {...intlData}>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Router history={history} children={routes} key={routerKey} />
            </MuiThemeProvider>
          </IntlProvider>
        </div>
      </Provider>
    )
  }
}

function mapStateToProps (state) {
  return {
    locale: state.locale,
    auth: state.auth
  }
}
export default connect(mapStateToProps)(AppContainer)
