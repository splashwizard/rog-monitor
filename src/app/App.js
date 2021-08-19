import React, { Component } from 'react';

import LoginRouter from './components/navigation/LoginRouter';
import AppRouter from './components/navigation/AppRouter';

import { checkLogin, initialiseAnalyticsEngine } from './redux/auth/actions';
import {logout} from './redux/auth/actions';
import {isEmpty} from './redux/helperFunctions';
import store from './redux/store';

class App extends Component {
  isChrome;
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      loading: true
    }
  }

  UNSAFE_componentWillMount() {
    store.subscribe(this.onStoreUpdate.bind(this));
    store.dispatch(checkLogin());
    store.dispatch(initialiseAnalyticsEngine());
  }

  onStoreUpdate() {
    const { user } = store.getState().auth;
    if (this.state.currentUser !== user) {
      this.setState({currentUser: user});
    }
    this.setState({loading: false});
  }

  render() {
    window.addEventListener("beforeunload", (ev) =>
    {
      if (!isEmpty(store.getState().auth)) {
        logout(store.getState().auth);
      }
    });
    if (this.state.loading) {
      return (<div style={{margin: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 36}}>Loading</div>)
    }
    else if (this.state.currentUser) {
      return (<AppRouter />)
    }
    else {
      return (<LoginRouter />)
    }
  }
}

export default App;
