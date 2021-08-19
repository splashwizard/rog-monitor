import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
const FormItem = Form.Item;

import { sendInvitationEmail } from '../../redux/auth/actions';

const InviteForm = ({visible, onCancel, onCreate, form, sendInvitationInProcess}) => {
  const layout = {
    wrapperCol: {
      span: 16,
      offset: 4
    }
  };
  return (
    <Modal title='Request an invite'
      visible={visible}
      okText='Send'
      onCancel={onCancel}
      footer={[null, null]}
    >
      <Form ref={form} {...layout}>
        <FormItem
          name="email"
          rules={[{
            required: true,
            pattern: new RegExp("^.+@[^\.].*\.[a-z]{2,}$"),
            message: "Please enter a valid email address."
          }]}
          hasFeedback
        >
          <Input prefix={<MailOutlined />} placeholder='Enter email address'/>
        </FormItem>
        <FormItem>
          <Button key='submit' type='primary' size='large' onClick={onCreate} disabled={sendInvitationInProcess}>
            Request
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

class RequestInviteModal extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.sendInvitationSuccess && this.props.sendInvitationSuccess !== nextProps.sendInvitationSuccess) {
      message.success('Invitation sent. Please check your email.');
      this.form.resetFields();
      this.props.toggleInviteModalVisibility();
    }

    if (nextProps.sendInvitationError && this.props.sendInvitationError !== nextProps.sendInvitationError) {
      message.error(nextProps.sendInvitationError, 10);
    }
  }

  handleCancel = () => {
    this.form.resetFields();
    this.props.toggleInviteModalVisibility();
  };

  handleCreate = () => {
    const form = this.form;
    form.validateFields().then(values => {
      this.props.sendInvitationEmail(values.email.toLowerCase());
    });
  };

  saveFormRef = (form) => {
    this.form = form
  };

  render() {
    return (
      <div>
        <InviteForm
          form={this.saveFormRef}
          visible={this.props.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          sendInvitationInProcess={this.props.sendInvitationInProcess}
        />
      </div>
    );
  }
}

const styles = {};

const mapStateToProps = (state) => {
  return {
    sendInvitationInProcess: state.auth.sendInvitationInProcess,
    sendInvitationError: state.auth.sendInvitationError,
    sendInvitationSuccess: state.auth.sendInvitationSuccess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendInvitationEmail: (email) => dispatch(sendInvitationEmail(email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestInviteModal);
