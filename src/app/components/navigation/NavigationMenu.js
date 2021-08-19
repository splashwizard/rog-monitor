import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Badge, notification, Tooltip } from 'antd';
import { VideoCameraOutlined, AlertOutlined, DatabaseOutlined, EllipsisOutlined, MailOutlined, UserOutlined, IdcardOutlined, TeamOutlined, RadiusUpleftOutlined, CloudServerOutlined, MobileOutlined, ClusterOutlined, CloudSyncOutlined, LinkOutlined } from '@ant-design/icons';

import { fetchAlerts, clearNewAlerts, markUserAlertsViewed, countNewAlerts } from '../../redux/alerts/actions';
import { isEmpty } from '../../redux/helperFunctions';

class NavigationMenu extends Component {
  constructor(props) {
    super(props);

    props.countNewAlerts(props.user);
  }
  UNSAFE_componentWillMount = () => {

  }
  // UNSAFE_componentWillReceiveProps = (nextProps) => {
  //   if (nextProps.newAlerts.length) {
  //     const alert = nextProps.newAlerts[0];
  //
  //     notification.open({
  //       message: 'Alert:',
  //       description: `${alert.type} by ${alert.camera.name} at ${alert.camera.cameraGroup.name}`,
  //       duration: 5,
  //       style: {
  //         marginTop: 30
  //       }
  //     });
  //     nextProps.clearNewAlerts();
  //   }
  // }

  goToPath = (path) => {
    if (path === '/alerts') {
      this.props.fetchAlerts(this.props.user);
      this.props.markUserAlertsViewed(this.props.user);
      this.props.countNewAlerts(this.props.user);
    }

    if (path == this.props.location.pathname) {
      window.window.scrollTo(0, 0);
    } else {
      this.props.history.push(path);
    }
  }

  render() {
    return (
      <Menu
        theme='dark'
        mode='horizontal'
        style={this.props.style}
        selectedKeys={[this.props.location.pathname]}
        defaultSelectedKeys={[this.props.location.pathname]}
        onClick={({key}) => this.goToPath(key)}>
        <Menu.Item key='/cameras'>
          <Tooltip title="Cameras">
            <VideoCameraOutlined className='nav-icon' />
          </Tooltip>
        </Menu.Item>
        <Menu.Item key='/alerts'>
          <Badge count={this.props.newAlertCount}>
            <Tooltip title="Alert Snapshots">
              <AlertOutlined className='nav-icon' />
            </Tooltip>
          </Badge>
        </Menu.Item>
        {this.props.user.user_privileges_id == 0 ?
          <Menu.SubMenu title={
            <Tooltip title="Admin Panel">
              <EllipsisOutlined className='nav-icon' />
            </Tooltip>
          }>
            <Menu.Item key='/reco-connectivity-logs-admin'>
              <CloudSyncOutlined className='nav-icon' /> Reco Connectivity Logs
            </Menu.Item>
            <Menu.Item key='/system-configuration-admin'>
              <DatabaseOutlined className='nav-icon' /> System Configuration
            </Menu.Item>
            <Menu.Item key='/live-view-admin'>
              <ClusterOutlined className='nav-icon' /> Live View Status
            </Menu.Item>
            <Menu.Item key='/invitations-admin'>
              <MailOutlined className='nav-icon' /> Invitations
            </Menu.Item>
            <Menu.Item key='/users-admin'>
              <UserOutlined className='nav-icon' /> Users
            </Menu.Item>
            <Menu.Item key='/licenses-admin'>
              <IdcardOutlined className='nav-icon' /> Licenses
            </Menu.Item>
            <Menu.Item key='/camera-groups-admin'>
              <TeamOutlined className='nav-icon' /> Camera Groups
            </Menu.Item>
            <Menu.Item key='/cameras-admin'>
              <VideoCameraOutlined className='nav-icon' /> Cameras
            </Menu.Item>
            <Menu.Item key='/urls-admin'>
              <LinkOutlined className='nav-icon' /> Camera Urls
            </Menu.Item>
            <Menu.Item key='/triggers-admin'>
              <RadiusUpleftOutlined className='nav-icon' /> Triggers
            </Menu.Item>
            <Menu.Item key='/recos-admin'>
              <CloudServerOutlined className='nav-icon' /> Recos
            </Menu.Item>
            <Menu.Item key='/devices-admin'>
              <MobileOutlined className='nav-icon' /> Devices
            </Menu.Item>
            <Menu.Item key='/alerts-admin'>
              <AlertOutlined className='nav-icon' /> Alerts
            </Menu.Item>
          </Menu.SubMenu>
          :
          null
        }
      </Menu>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    newAlerts: state.alerts.newAlerts,
    newAlertCount: state.alerts.newAlertCount,
    alerts: state.alerts.alerts,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearNewAlerts: () => dispatch(clearNewAlerts()),
    fetchAlerts: (user) => dispatch(fetchAlerts(user)),
    markUserAlertsViewed: (user) => dispatch(markUserAlertsViewed(user)),
    countNewAlerts: (user) => dispatch(countNewAlerts(user))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavigationMenu));
