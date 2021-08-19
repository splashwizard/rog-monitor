import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Menu, Dropdown, Tooltip, Button, message, Popconfirm } from 'antd';
import { SettingOutlined, VideoCameraAddOutlined, ShareAltOutlined } from '@ant-design/icons';

import AddCameraModal from '../modals/AddCameraModal';
import ShareCameraGroupModal from '../modals/ShareCameraGroupModal';
import EditCameraGroupModal from '../modals/EditCameraGroupModal';
import CameraGroupPrivilegeSettingsModal from '../modals/CameraGroupPrivilegeSettingsModal';
import { fetchUserCameraLicenses } from '../../redux/users/actions';

class CameraOptionButtons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addCameraModalVisible: false,
      shareCameraGroupModalVisible: false
    }
  }

  toggleAddCameraModalVisibility = () => {
    this.setState({addCameraModalVisible: !this.state.addCameraModalVisible});
  }

  toggleShareCameraGroupModalVisibility = () => {
    this.setState({shareCameraGroupModalVisible: !this.state.shareCameraGroupModalVisible})
  }

  render() {
    let timeZone = typeof this.props.updatedTimeZone !== 'undefined' ? this.props.updatedTimeZone : this.props.user.time_zone;
    return (
      <Col xs={{span: 10}} sm={{span: 6, offset: 12}} type="flex" align="right" justify="right" style={styles.optionsContainer}>
        <Col xs={{span: 4}} style={styles.optionWrapper}>
          <Tooltip title='Add Camera' placement="topRight">
            <VideoCameraAddOutlined style={styles.addCamera} onClick={this.toggleAddCameraModalVisibility}/>
          </Tooltip>
          <AddCameraModal
            user={this.props.user}
            time_zone={timeZone}
            selectedCameraGroup={this.props.selectedCameraGroup}
            visible={this.state.addCameraModalVisible}
            toggleAddCameraModalVisibility={this.toggleAddCameraModalVisibility.bind(this)}
            admin={false} />
        </Col>
        <Col xs={{span: 4}} style={styles.optionWrapper}>
          <Tooltip title='Share CameraGroup' placement="topRight">
            <ShareAltOutlined style={styles.share} onClick={this.toggleShareCameraGroupModalVisibility}/>
          </Tooltip>
          <ShareCameraGroupModal
            selectedCameraGroup={this.props.selectedCameraGroup}
            visible={this.state.shareCameraGroupModalVisible}
            toggleShareCameraGroupModalVisibility={this.toggleShareCameraGroupModalVisibility.bind(this)} />
        </Col>
        <Col xs={{span: 4}} style={styles.optionWrapper}>
          <Dropdown
          placement='bottomCenter'
          overlay={
            <Menu>
              <Menu.Item>
                <EditCameraGroupModal selectedCameraGroup={this.props.selectedCameraGroup} />
              </Menu.Item>
              <Menu.Item>
                <CameraGroupPrivilegeSettingsModal selectedCameraGroup={this.props.selectedCameraGroup} />
              </Menu.Item>
            </Menu>
          }>
            <SettingOutlined style={styles.edit} type='setting'/>
          </Dropdown>
        </Col>
      </Col>
    )
  }
}

const styles = {
  share: {
    fontSize: 20,
    paddingRight: 10
  },
  edit: {
    fontSize: 20
  },
  addCamera: {
    fontSize: 20,
    paddingRight: 10
  },
  optionsContainer: {
    marginTop: 5,
    width: 60
  },
  optionWrapper: {
    display: 'inline-block'
  }
}

const mapStateToProps = (state) => {
  return {
    updatedTimeZone: state.users.userData.time_zone
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserCameraLicenses: (user) => dispatch(fetchUserCameraLicenses(user)),
    enableCameraGroup: (user, cameraGroup) => dispatch(enableCameraGroup(user, cameraGroup)),
    disableCameraGroup: (user, cameraGroup) => dispatch(disableCameraGroup(user, cameraGroup))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraOptionButtons);
