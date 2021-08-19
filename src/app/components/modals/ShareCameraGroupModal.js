import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, message } from 'antd';
import { MailOutlined, LoadingOutlined, ShareAltOutlined } from '@ant-design/icons';
const FormItem = Form.Item;

import { shareCameraGroup } from '../../redux/cameraGroups/actions';

const ShareCameraGroupForm = ({visible, onCancel, onCreate, form, selectedCameraGroup, shareCameraGroupInProcess}) => {
  const layout = {
    wrapperCol: {
      span: 16,
      offset: 4
    }
  };
  return (
    <Modal title={`Share Camera Group to View ${selectedCameraGroup.name}'s Cameras`}
      visible={visible}
      okText='Create'
      onCancel={onCancel}
      footer={[null, null]}
    >
      <Form layout='vertical' ref={form} {...layout}>
        <FormItem
          name="email"
          rules={[{
            required: true,
            pattern: new RegExp("^.+@[^\.].*\.[a-z]{2,}$"),
            message: "Please enter a valid email address."
          }]}
        >
          <Input style={styles.emailInput} prefix={<MailOutlined />} placeholder='Enter email address'/>
        </FormItem>
        <FormItem>
          <Button key='submit' type='primary' size='large' onClick={onCreate} disabled={shareCameraGroupInProcess}>
            {shareCameraGroupInProcess ? <LoadingOutlined /> : <ShareAltOutlined />}Invite
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

class ShareCameraGroupModal extends Component {
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.shareCameraGroupError && this.props.shareCameraGroupError !== nextProps.shareCameraGroupError) {
      message.error(nextProps.shareCameraGroupError, 10);
    }
    else if (nextProps.shareCameraGroupSuccess && this.props.shareCameraGroupSuccess !== nextProps.shareCameraGroupSuccess) {
      message.success('Invitation sent.');
      this.form.resetFields();
    }
  }

  handleCancel = () => {
    this.form.resetFields();
    this.props.toggleShareCameraGroupModalVisibility();
  };

  handleCreate = () => {
    const form = this.form;
    form.validateFields().then(values => {
      this.props.shareCameraGroup(this.props.user, this.props.selectedCameraGroup.uuid, values.email.toLowerCase());
    });
  };

  saveFormRef = (form) => {
    this.form = form;
  };

  render() {
    return (
      <div>
        <ShareCameraGroupForm
          form={this.saveFormRef}
          visible={this.props.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          selectedCameraGroup={this.props.selectedCameraGroup}
          shareCameraGroupInProcess={this.props.shareCameraGroupInProcess}
        />
      </div>
    );
  }
}

const styles = {
  emailInput: {
    textAlign: 'center'
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    shareCameraGroupInProcess: state.cameraGroups.shareCameraGroupInProcess,
    shareCameraGroupError: state.cameraGroups.shareCameraGroupError,
    shareCameraGroupSuccess: state.cameraGroups.shareCameraGroupSuccess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    shareCameraGroup: (user, cameraGroupUuid, email) => dispatch(shareCameraGroup(user, cameraGroupUuid, email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareCameraGroupModal);
