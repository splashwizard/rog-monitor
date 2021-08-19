import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
const FormItem = Form.Item;

import { sendPasswordResetRequestEmail } from '../../redux/auth/actions';

const PasswordResetForm = ({visible, onCancel, onCreate, form, sendPasswordResetInProcess}) => {
  const layout = {
    wrapperCol: {
      span: 16,
      offset: 4
    }
  };
  return (
    <Modal title='Request to Reset Password'
      visible={visible}
      okText='Send'
      onCancel={onCancel}
      footer={[null, null]}
    >
      <Form ref={form} {...layout}>
        <FormItem
          name="email"
          hasFeedback
          rules={[{
            required: true,
            pattern: new RegExp("^.+@[^\.].*\.[a-z]{2,}$"),
            message: "Please enter a valid email address."
          }]}
        >
          <Input style={styles.emailInput} prefix={<MailOutlined />} placeholder='Enter email address'/>
        </FormItem>
        <FormItem>
          <Button key='submit' type='primary' size='large' onClick={onCreate} disabled={sendPasswordResetInProcess}>
            Request
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

class RequestPasswordResetModal extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.sendPasswordResetRequestSuccess && this.props.sendPasswordResetRequestSuccess !== nextProps.sendPasswordResetRequestSuccess) {
      message.success('Password reset request sent. Please check your email.');
      this.form.resetFields();
      this.props.toggleRequestPasswordResetModalVisibility();
    }

    if (nextProps.sendPasswordResetRequestError && this.props.sendPasswordResetRequestError !== nextProps.sendPasswordResetRequestError) {
      message.error(nextProps.sendPasswordResetRequestError, 10);
    }
  }

  handleCancel = () => {
    this.form.resetFields();
    this.props.toggleRequestPasswordResetModalVisibility();
  };

  handleCreate = () => {
    const form = this.form;
    form.validateFields().then(values => {
      this.props.sendPasswordResetRequestEmail(values.email.toLowerCase());
    });
  };

  saveFormRef = (form) => {
    this.form = form;
  };

  render() {
    return (
      <div>
        <PasswordResetForm
          form={this.saveFormRef}
          visible={this.props.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          sendPasswordResetRequestInProcess={this.props.sendPasswordResetRequestInProcess}
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
    sendPasswordResetInProcess: state.auth.sendPasswordResetInProcess,
    sendPasswordResetRequestError: state.auth.sendPasswordResetRequestError,
    sendPasswordResetRequestSuccess: state.auth.sendPasswordResetRequestSuccess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendPasswordResetRequestEmail: (email) => dispatch(sendPasswordResetRequestEmail(email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPasswordResetModal);
