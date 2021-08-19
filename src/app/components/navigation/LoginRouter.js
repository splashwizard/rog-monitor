import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { Layout } from 'antd';
const { Header, Sider, Content } = Layout;

import Register from '../../screens/Register';
import ResetPassword from '../../screens/ResetPassword';
import Login from '../../screens/Login';
import StagesLinkView from '../../screens/StagesLinkView';

export default class LoginRouter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Layout>
          <Content style={styles.content}>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register/:token' component={Register} />
              <Route exact path='/share_group_register/:token' component={Register} />
              <Route exact path='/forgot_password/:token' component={ResetPassword} />
              <Route exact path='/stages_link_view' component={StagesLinkView} />

              <Redirect to='/login' />
            </Switch>
          </Content>
        </Layout>
      </Router>
    )
  }
}

const styles = {}
