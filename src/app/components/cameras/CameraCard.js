import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Popconfirm, Button, Switch } from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import moment, { lang } from 'moment';
import EditCamera from '../cameras/EditCamera';
import { checkCameraConnection } from '../../redux/cameras/actions';
import { trackEventAnalytics } from '../../redux/auth/actions';
import TriggerModal from '../modals/TriggerModal';
import CameraCardImg from './CameraCardImg';
import CameraCardVideo from './CameraCardVideo';
import ToggleCameraArmed from '../buttons/ToggleCameraArmed';
import CameraReport from '../modals/CameraReport';
import {isEmpty} from '../../redux/helperFunctions';

class CameraCard extends Component {
  constructor(props) {
    super(props);

    props.checkCameraConnection(props.user, props.uuid);

    this.state = {
      flag: false,
      live_view_url: props.live_view_url,
      thumbnail_url: props.thumbnail_url
    }
  }

  formatDatetime = (timestamp) => {
    const dt = moment(timestamp);
    return `${dt.format('L')} ${dt.format('LT')}`;
  }

static getDerivedStateFromProps(nextProps, prevState) {
  for (var i = 0; i < nextProps.cameraGroup.cameras.length; i++) {
    if (nextProps.cameraGroup.cameras[i].uuid == nextProps.uuid) {
      return {
        live_view_url: nextProps.cameraGroup.cameras[i].live_view_url,
        thumbnail_url: nextProps.cameraGroup.cameras[i].thumbnail_url
      }
    }
  }
}

  render() {
    let myRole = [];
    for (var i = 0; i < this.props.cameraGroup.userCameraGroupPrivileges.length; i++) {
      if (this.props.cameraGroup.userCameraGroupPrivileges[i].users_uuid == this.props.user.uuid) {
        myRole = this.props.cameraGroup.userCameraGroupPrivileges[i].user_camera_group_privilege_ids
      }
    }

    return (
      <Card style={styles.cameraCard}>
        <Row>
          {
            isEmpty(this.state.live_view_url) ||
            (!this.props.cameraArmed && this.props.uuid == this.props.cameraConnectionUuid) ||
            (this.props.imageUpdateInProgress && this.props.imageUpdateInProgressUuid == this.props.uuid)
            ?
            <CameraCardImg data={this.props} />
            :
            <CameraCardVideo data={this.props} />
          }

        </Row>
        <Row type='flex' justify='left' style={{paddingLeft: 10, paddingRight: 10}}>
          <Col style={styles.cameraCardTitle}>{this.props.name}</Col>
        </Row>
        <Row type="flex" style={{paddingLeft: 10, paddingRight: 10}}>
          {!myRole.includes(0) ?
              (<Col span={12} style={styles.cameraConnectionSwitch}>
                <div style={{height: 24}}>
                {this.props.enabled ?
                  this.props.armed ?
                    <span style={{color: 'rgba(0, 0, 0)', verticalAlign: 'middle'}}> (Armed)</span>
                  :
                    <span style={{color: 'rgba(0, 0, 0)', verticalAlign: 'middle'}}> (Disarmed)</span>
                :
                  <span style={{color: 'rgba(0, 0, 0, 0.25)', verticalAlign: 'middle'}}> (Disconnected)</span>
                }
                </div>
              </Col>)
            :
              <Col span={12} style={styles.cameraConnectionSwitch}>
                <ToggleCameraArmed
                  data={this.props}
                />
                {!this.props.enabled ?
                  <span style={{color: 'rgba(0, 0, 0, 0.25)', verticalAlign: 'middle'}}> (Disabled)</span>
                : ''}
              </Col>
          }
          <Col span={12}>
            {myRole.includes(0) &&
              <Col span={2} style={styles.cameraSettingsButton}>
                <EditCamera data={this.props} myRole={myRole} />
              </Col>
            }

            {this.props.enabled && this.state.thumbnail_url &&
              <div>
                <Col span={2} style={styles.triggermodalButton}>
                  <TriggerModal
                    data={this.props}
                  />
                </Col>
                {/*<Col span={2} style={styles.cameraReportButton}>
                  <CameraReport data={this.props} />
                </Col>*/}
              </div>
            }
          </Col>
        </Row>
      </Card>
    )
  }
}

const styles = {
  cameraCard: {
    marginTop: 10,
    marginLeft: 10,
    marginRight:10,
    marginBottom: 0,
    maxWidth: 405
  },
  cameraCardTitle: {
    wordBreak: 'break-word',
    marginTop: 5
  },
  triggermodalButton: {
    float: 'right',
    marginTop: 3
  },
  cameraSettingsButton: {
    float: 'right',
    marginLeft: 10,
    marginTop: 5
  },
  cameraReportButton: {
    float: 'right',
    marginTop: 3,
    marginRight: 10
  },
  cameraConnectionSwitch: {
    textAlign: 'left',
    marginTop: 5
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    polygonData: state.triggers.polygonData,
    refreshCameraImage: state.cameras.refreshCameraImage,
    refreshCameraUuid: state.cameras.refreshCameraUuid,
    imageUpdateInProgress: state.cameras.imageUpdateInProgress,
    imageUpdateInProgressUuid: state.cameras.imageUpdateInProgressUuid,
    refreshCameraError: state.cameras.refreshCameraError,
    refreshCameraErrorUuid: state.cameras.refreshCameraErrorUuid,
    imageUpdateSuccess: state.cameras.imageUpdateSuccess,
    imageUpdateSuccessUuid: state.cameras.imageUpdateSuccessUuid,
    cameraArmed: state.cameras.cameraArmed,
    cameraArmedUuid: state.cameras.cameraArmedUuid,
    cameraConnectionEnabled: state.cameras.cameraConnectionEnabled,
    cameraConnectionUuid: state.cameras.cameraConnectionUuid,
    cameraConnectionVerified: state.cameras.cameraConnectionVerified,
    cameraConnectionVerifiedUuid: state.cameras.cameraConnectionVerifiedUuid
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    checkCameraConnection: (user, cameraUuid) => dispatch(checkCameraConnection(user, cameraUuid)),
    trackEventAnalytics: (event, data) => dispatch(trackEventAnalytics(event, data))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CameraCard));
