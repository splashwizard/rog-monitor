import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Switch, message, Tooltip } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { toggleCameraArmed, checkCameraArmed } from '../../redux/cameras/actions';

class ToggleCameraArmed extends Component {
  constructor(props){
    super(props);
    props.checkCameraArmed(props.data.user, props.data.cameraGroup, props.data.uuid);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.data.uuid === nextProps.cameraArmedUuid) {
      return true;
    } else {
      return false;
    }
  }

  toggleCameraArmed = (armed) => {
    if (this.props.data.enabled && this.props.data.cameraGroup.armed) {
      this.props.toggleCameraArmed(this.props.data.user, this.props.data.cameraGroup, this.props.data.uuid, armed);
    } else if (!this.props.data.cameraGroup.armed) {
      message.error('Camera Group disarmed. Please go to settings and arm camera group.', 10);
    } else {
      message.error('Camera disconnected. Please go to settings and enable camera connection.', 10);
    }
  }

  render() {
    let armed = this.props.data.enabled ? this.props.cameraArmed : false;
    return (
      <Tooltip title='Camera Armed' placement="bottom">
        <Switch
          checkedChildren={<LockOutlined />}
          unCheckedChildren={<UnlockOutlined />}
          onChange={() => this.toggleCameraArmed(!armed)}
          checked={armed}
        />
      </Tooltip>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cameraArmed: state.cameras.cameraArmed,
    cameraArmedUuid: state.cameras.cameraArmedUuid
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    toggleCameraArmed: (user, cameraGroup, camera, cameraArmed) => dispatch(toggleCameraArmed(user, cameraGroup, camera, cameraArmed)),
    checkCameraArmed: (user, cameraGroup, cameraUuid) => dispatch(checkCameraArmed(user, cameraGroup, cameraUuid))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ToggleCameraArmed));
