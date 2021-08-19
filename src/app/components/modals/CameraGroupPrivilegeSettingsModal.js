import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Row, Col, message } from 'antd';
import { TeamOutlined, CloseOutlined } from '@ant-design/icons';

import { rescindInvite, fetchSentCameraGroupInvites } from '../../redux/invites/actions';
import { removeUserCameraGroupPrivilege } from '../../redux/cameraGroups/actions';

const UserCameraGroupSettings = (props) => {
  return (
    <Modal
      title='User Camera Group Privileges'
      visible={props.visible}
      style={styles.modal}
      onCancel={props.onCancel}
      footer={[null, null]}
    >
      {props.sentInvites.length > 0 ?
        props.sentInvites.map(invite => (
        <Row key={invite.uuid} style={styles.inviteContainer}>
          <Col xs={{span: 11, offset: 1}} style={styles.inviteNameContainer}>
            <Col xs={{span: 24}} style={styles.inviteName}>
              {invite.email}
            </Col>
            <Col xs={{span: 24}} style={styles.inviteAction}>
              Invited
            </Col>
          </Col>
          <Col xs={{span: 6, offset: 3}} style={styles.rescindRemoveButtons} onClick={() => props.rescindInviteInProcess ? '' : props.rescindInvite(props.user, invite)}>
            <Col xs={{span: 24}}>
              <Button style={styles.button}>Rescind</Button>
            </Col>
            <Col xs={{span: 24}}>
              <CloseOutlined />
            </Col>
          </Col>
        </Row>
      )) : `There are no pending invitations.`}

      {props.userCameraGroupPrivileges.length > 0 ?
        props.userCameraGroupPrivileges.map(userCameraGroupPrivilege => (
        <Row key={userCameraGroupPrivilege.uuid} style={styles.inviteContainer}>
          <Col xs={{span: 11, offset: 1}} style={styles.inviteNameContainer}>
            <Col xs={{span: 24}} style={styles.inviteName}>
              {userCameraGroupPrivilege.first_name} {userCameraGroupPrivilege.last_name}
            </Col>
            <Col xs={{span: 24}} style={styles.inviteAction}>
              User Privileges: {userCameraGroupPrivilege.user_camera_group_privilege_ids.includes(0) ? 'Owner' : 'Member'}
            </Col>
          </Col>
          <Col xs={{span: 6, offset: 3}} style={styles.rescindRemoveButtons} onClick={() => props.removeUserCameraGroupPrivilegeInProcess ? '' : props.removeUserCameraGroupPrivilege(props.user, userCameraGroupPrivilege.camera_groups_uuid, userCameraGroupPrivilege.uuid, userCameraGroupPrivilege)}>
            <Col xs={{span: 24}}>
              <Button style={styles.button}>Remove</Button>
            </Col>
            <Col xs={{span: 24}}>
              <CloseOutlined />
            </Col>
          </Col>
        </Row>
      )) : <div><br/><p>You are the only member in this camera Group.</p></div>}
    </Modal>
  )
}

class UserCameraGroupSettingsModal extends Component {
  constructor(props) {
    super(props);

    props.fetchSentCameraGroupInvites(props.user, props.selectedCameraGroup.uuid);

    this.state = {
      visible: false
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.rescindInviteError && nextProps.rescindInviteError !== this.props.rescindInviteError) {
      message.error(nextProps.rescindInviteError, 10);
    }

    if (nextProps.removeUserCameraGroupPrivilegeError && nextProps.removeUserCameraGroupPrivilegeError !== this.props.removeUserCameraGroupPrivilegeError) {
      message.error(nextProps.removeUserCameraGroupPrivilegeError, 10);
    }
  };

  showModal = () => {
    this.props.fetchSentCameraGroupInvites(this.props.user, this.props.selectedCameraGroup.uuid);
    this.setState({visible: true});
  };

  handleCancel = () => {
    this.setState({visible: false});
  };

  render() {
    if ('userCameraGroupPrivileges' in this.props.selectedCameraGroup){
      return (
        <div>
          <div onClick={this.showModal}>
            <TeamOutlined />
            &nbsp;
            Camera Group Privileges
          </div>
          <UserCameraGroupSettings
            visible={this.state.visible}
            onCancel={this.handleCancel}
            user={this.props.user}
            userCameraGroupPrivileges={this.props.selectedCameraGroup.userCameraGroupPrivileges.filter(invite => invite.users_uuid !== this.props.user.uuid)}
            removeUserCameraGroupPrivilege={this.props.removeUserCameraGroupPrivilege}
            removeUserCameraGroupPrivilegeInProcess={this.props.removeUserCameraGroupPrivilegeInProcess}
            sentInvites={this.props.sentInvites}
            rescindInvite={this.props.rescindInvite}
            rescindInviteInProcess={this.props.rescindInviteInProcess}
          />
        </div>
      );
    } else {
      return (
        <div>
          <div>
            <TeamOutlined />
            &nbsp;
            User Camera Group Privileges
          </div>
        </div>
      );
    }
  }
}

const styles = {
  modal: {
    textAlign: 'center'
  },
  inviteContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    fontSize: 16,
    fontWeight: 400,
    color: '#fff',
    backgroundColor: 'transparent',
  },
  rescindRemoveButtons: {
    backgroundColor: 'grey',
    color: '#fff',
    fontSize: 24,
  },
  inviteNameContainer: {
    textAlign: 'left',
    borderLeft: '5px solid blue',
    paddingLeft: 15,
    color: 'grey'
  },
  inviteName: {
    color: 'grey',
    fontSize: 18
  },
  inviteAction: {
    marginTop: 15,
    marginBottom: 10
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    removeUserCameraGroupPrivilegeInProcess: state.cameraGroups.removeUserCameraGroupPrivilegeInProcess,
    removeUserCameraGroupPrivilegeError: state.cameraGroups.removeUserCameraGroupPrivilegeError,
    rescindInviteInProcess: state.invites.rescindInviteInProcess,
    rescindInviteError: state.invites.rescindInviteError,
    selectedCameraGroup: state.cameraGroups.selectedCameraGroup,
    sentInvites: state.invites.sentInvites
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeUserCameraGroupPrivilege: (user, cameraGroupUuid, cameraGroupPrivilegeUuid, cameraGroupPrivilege) => dispatch(removeUserCameraGroupPrivilege(user, cameraGroupUuid, cameraGroupPrivilegeUuid, cameraGroupPrivilege)),
    rescindInvite: (user, invite) => dispatch(rescindInvite(user, invite)),
    fetchSentCameraGroupInvites: (user, camera_groups_uuid) => dispatch(fetchSentCameraGroupInvites(user, camera_groups_uuid))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCameraGroupSettingsModal);
