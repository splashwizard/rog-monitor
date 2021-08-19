import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { Layout, Row, Col, Button, Tooltip } from 'antd';
import { CloseOutlined, SoundOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;

import Hamburger from './Hamburger';
import NavigationMenu from './NavigationMenu';
import SideMenu from './SideMenu'

import Alerts from '../../screens/Alerts';
import CameraList from '../../screens/CameraList';
import CameraDetails from '../../screens/CameraDetails'
import RecosAdmin from '../../screens/admin/RecosAdmin';
import UsersAdmin from '../../screens/admin/UsersAdmin';
import CameraGroupsAdmin from '../../screens/admin/CameraGroupsAdmin';
import CamerasAdmin from '../../screens/admin/CamerasAdmin';
import TriggersAdmin from '../../screens/admin/TriggersAdmin';
import AlertsAdmin from '../../screens/admin/AlertsAdmin';
import InvitationsAdmin from '../../screens/admin/InvitationsAdmin';
import DevicesAdmin from '../../screens/admin/DevicesAdmin';
import LicensesAdmin from '../../screens/admin/LicensesAdmin';
import SystemConfigurationAdmin from '../../screens/admin/SystemConfigurationAdmin';
import LiveViewAdmin from '../../screens/admin/LiveViewAdmin';
import StagesLinkView from '../../screens/StagesLinkView';
import RecoConnectivityLogsAdmin from '../../screens/admin/RecoConnectivityLogsAdmin';
import urlsAdmin from '../../screens/admin/UrlsAdmin';

import { muteSound } from '../../redux/users/actions';

class AppRouter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      mute: props.user.mute
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  toggleMute = () => {
    this.setState({mute: !this.state.mute});
    this.props.muteSound(this.props.user, !this.state.mute);
  }

  render() {
    return (
      <Router>
        <Layout>
          <Header style={styles.header}>
            <Hamburger
              style={{...styles.hamburger, ...styles.menu}}
              collapsed={this.state.collapsed}
              toggleCollapsed={this.toggleCollapsed.bind(this)}
            />
            <NavigationMenu style={styles.menu} />
            <div style={styles.headerButton}>
              <Button type="ghost" shape="circle" size={"large"} style={styles.muteButton} onClick={this.toggleMute}>
                <SoundOutlined />{this.state.mute == true ? <CloseOutlined style={styles.muteIcon} /> : ''}
              </Button>
            </div>
          </Header>
          <Layout>
            <Sider collapsed={this.state.collapsed} collapsedWidth={0} style={styles.sider}>
              <SideMenu user={this.props.user} />
            </Sider>

            <Content style={styles.content}>
                {this.props.user.user_privileges_id == 0 ?
                  <Switch>
                    <Route path='/cameras' component={CameraList} />
                    <Route path='/cameras/:uuid' component={CameraDetails} />
                    <Route path='/alerts' component={Alerts} />
                    <Route path='/recos-admin' component={RecosAdmin} />
                    <Route path='/reco-connectivity-logs-admin' component={RecoConnectivityLogsAdmin} />
                    <Route path='/users-admin' component={UsersAdmin} />
                    <Route path='/camera-groups-admin' component={CameraGroupsAdmin} />
                    <Route path='/cameras-admin' component={CamerasAdmin} />
                    <Route path='/urls-admin' component={urlsAdmin} />
                    <Route path='/triggers-admin' component={TriggersAdmin} />
                    <Route path='/alerts-admin' component={AlertsAdmin} />
                    <Route path='/invitations-admin' component={InvitationsAdmin} />
                    <Route path='/Devices-admin' component={DevicesAdmin} />
                    <Route path='/licenses-admin' component={LicensesAdmin} />
                    <Route path='/system-configuration-admin' component={SystemConfigurationAdmin} />
                    <Route path='/live-view-admin' component={LiveViewAdmin} />
                    <Route exact path='/stages_link_view' component={StagesLinkView} />
                    <Redirect to='/cameras' />
                  </Switch>
                  :
                  <Switch>
                    <Route path='/cameras' component={CameraList} />
                    <Route path='/cameras/:uuid' component={CameraDetails} />
                    <Route path='/alerts' component={Alerts} />
                    <Route exact path='/stages_link_view' component={StagesLinkView} />
                    <Redirect to='/cameras' />
                  </Switch>
                }
            </Content>
          </Layout>
          <Footer style={styles.footer}></Footer>
        </Layout>
      </Router>
    )
  }
}

const styles = {
  header: {
    padding: 0,
    height: '50px',
    position: 'fixed',
    width: '100%',
    zIndex: 1 // Required for Content to scroll under Header
  },
  footer: {
    padding: 35
  },
  headerButton: {
    color: 'white',
    float: 'right',
    marginTop: -55,
    marginRight: 20
  },
  hamburger: {
    float: 'left',
  },
  menu: {
    lineHeight: '50px'
  },
  sider: {
    marginTop: 50
  },
  content: {
    marginTop: 50,
    zIndex: 0 // Required for Content to scroll under Header
  },
  muteButton: {
    color: 'white'
  },
  muteIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    fontSize: 30
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    muteSound: (user, mute) => dispatch(muteSound(user, mute)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
