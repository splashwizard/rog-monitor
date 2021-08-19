import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Badge, Row, Col, message } from 'antd';
import { MailOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { acceptInvite, rejectInvite } from '../../redux/invites/actions';

const CameraGroupInvites = (props) => {
  if (props.invites.length){
    return (
      <Modal
        title='Camera Group Invitations'
        visible={props.visible}
        style={styles.modal}
        onCancel={props.onCancel}
        footer={[null, null]}
      >
        {props.invites.map(invite => (
          <Row key={invite.uuid} type='flex' justify='start' style={styles.invitesListContainer}>
            <Col xs={{span: 24}} sm={{span: 11, offset: 1}} style={styles.adminNameContainer}>
              <Col xs={{span: 24}} style={styles.adminName}>
                {invite.first_name} {invite.last_name}
                <p style={styles.date}>{moment(invite.inserted_at).format('MMM D')}</p>
              </Col>
              <Col xs={{span: 24}}>
                Invited to join: {invite.camera_group_name}
              </Col>
            </Col>
            <Col xs={{span: 24}} sm={{span: 11}} style={styles.acceptRejectButtons}>
              <Col xs={{span: 12}} onClick={() => props.acceptInviteInProcess ? '' : props.acceptInvite(props.user, invite)}>
                <Col xs={{span: 24}}>
                  <Button style={styles.button}>Accept</Button>
                </Col>
                <Col xs={{span: 24}}>
                  <CheckOutlined />
                </Col>
              </Col>
              <Col xs={{span: 12}} style={styles.buttonBorder} onClick={() => props.rejectInviteInProcess ? '' : props.rejectInvite(props.user, invite)}>
                <Col xs={{span: 24}}>
                  <Button style={styles.button}>Reject</Button>
                </Col>
                <Col xs={{span: 24}}>
                  <CloseOutlined />
                </Col>
              </Col>
            </Col>
          </Row>
        ))}
      </Modal>
    )
  } else {
    return (
      <Modal
        title='Camera Group Invitations'
        visible={props.visible}
        style={styles.modal}
        onCancel={props.onCancel}
        footer={[null, null]}
      >
        <div>No pending camera group invitations.</div>
      </Modal>
    )
  }
};

class CameraGroupInvitesModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.acceptInviteError && nextProps.acceptInviteError !== this.props.acceptInviteError) {
      message.error(nextProps.acceptInviteError, 10);
    }
    if (nextProps.rejectInviteError && nextProps.rejectInviteError !== this.props.rejectInviteError) {
      message.error(nextProps.rejectInviteError, 10);
    }
  };

  showModal = () => {
    this.setState({visible: true});
  };

  handleCancel = () => {
    this.setState({visible: false});
  };

  render() {
    return (
      <Badge count={this.props.cameraGroupInvites.length}>
        <div onClick={this.showModal}>
          <MailOutlined />
          &nbsp;&nbsp;
          <span>Camera Group Invites</span>
        </div>
        <CameraGroupInvites
          visible={this.state.visible}
          onCancel={this.handleCancel}
          user={this.props.user}
          invites={this.props.cameraGroupInvites}
          acceptInvite={this.props.acceptInvite}
          rejectInvite={this.props.rejectInvite}
          acceptInviteInProcess={this.props.acceptInviteInProcess}
          rejectInviteInProcess={this.props.rejectInviteInProcess}
        />
      </Badge>
    );
  }
}

const styles = {
  modal: {
    textAlign: 'center',
  },
  invitesListContainer: {
    paddingTop: 15,
    paddingBottom: 15
  },
  adminNameContainer: {
    textAlign: 'left',
    borderLeft: '5px solid blue',
    paddingLeft: 15,
    color: 'grey'
  },
  adminName: {
    color: 'grey',
    fontSize: 18
  },
  acceptRejectButtons: {
    backgroundColor: 'grey',
    color: '#fff',
    fontSize: 24,
    display: 'inherit'
  },
  button: {
    fontSize: 16,
    fontWeight: 400,
    color: '#fff',
    backgroundColor: 'transparent',
  },
  buttonBorder: {
    borderLeft: '1px solid #fff',
    height: 93
  },
  date: {
    textAlign: 'right',
    marginTop: -26,
    marginRight: 15
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    cameraGroupInvites: state.invites.cameraGroupInvites,
    acceptInviteInProcess: state.invites.acceptInviteInProcess,
    acceptInviteError: state.invites.acceptInviteError,
    rejectInviteInProcess: state.invites.rejectInviteInProcess,
    rejectInviteError: state.invites.rejectInviteError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    acceptInvite: (user, invite) => dispatch(acceptInvite(user, invite)),
    rejectInvite: (user, invite) => dispatch(rejectInvite(user, invite))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraGroupInvitesModal);
