import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, message } from 'antd';
import { MailOutlined, LoadingOutlined, ShareAltOutlined, PhoneOutlined } from '@ant-design/icons';
const FormItem = Form.Item;

import { shareUserAlert } from '../../redux/alerts/actions';

const SharedUserAlertForm = ({visible, onCancel, onCreate, form, alert, shareAlertInProcess, shareAlertInProcessUuid}) => {
  const layout = {
    wrapperCol: {
      span: 16,
      offset: 4
    }
  };
  return (
    <Modal title={`Email and/or Text Alert Information`}
      visible={visible}
      okText='Create'
      onCancel={onCancel}
      footer={[null, null]}
    >
      <Form layout='vertical' ref={form} {...layout}>
        <FormItem
          name="email"
          rules={[{
            required: false,
            pattern: new RegExp("^.+@[^\.].*\.[a-z]{2,}$"),
            message: "Please enter a valid email address."
          }]}
        >
          <Input style={styles.emailInput} prefix={<MailOutlined />} placeholder='Enter email address'/>
        </FormItem>
        <p style={{margin: '0 auto', marginBottom: 14, marginTop: -10}}>and/or:</p>
        <FormItem
          name="phone"
          rules={[{
            required: false,
            pattern: new RegExp("[0-9]{3}[0-9]{3}[0-9]{4}"),
            message: "Please enter a valid U.S. phone number without dashes."
          }]}
        >
          <Input type="tel" style={styles.emailInput} prefix={<PhoneOutlined />} placeholder='To Text the Alert Enter Phone Number'/>
        </FormItem>
        <FormItem>
          <Button key='submit' type='primary' size='large' onClick={onCreate} disabled={shareAlertInProcess}>
            {shareAlertInProcess && alert.uuid == shareAlertInProcessUuid ? <LoadingOutlined /> : <ShareAltOutlined />}Share Alert
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

class SharedUserAlertModal extends Component {
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.shareAlertError && this.props.shareAlertError !== nextProps.shareAlertError && nextProps.alert.uuid === nextProps.shareAlertErrorUuid) {
      message.error(nextProps.shareAlertError, 10);
    }
    else if (nextProps.shareAlertSuccess && this.props.shareAlertSuccess !== nextProps.shareAlertSuccess&& nextProps.alert.uuid === nextProps.shareAlertSuccessUuid) {
      message.success('Alert Information Shared.');
      this.form.resetFields();
    }
  }

  handleCancel = () => {
    this.form.resetFields();
    this.props.toggleShareUserAlertModalVisibility();
  };

  handleCreate = () => {
    const form = this.form;
    form.validateFields().then(values => {
      for (var i in values) {
        if (typeof values[i] === 'undefined') {
          delete values[i];
        }
      };
      this.props.shareUserAlert(this.props.user, this.props.alert.uuid, values);
    });
  };

  saveFormRef = (form) => {
    this.form = form;
  };

  render() {
    return (
      <div>
        <SharedUserAlertForm
          form={this.saveFormRef}
          visible={this.props.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          alert={this.props.alert}
          shareAlertInProcess={this.props.shareAlertInProcess}
          shareAlertInProcessUuid={this.props.shareAlertInProcessUuid}
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
    shareAlertInProcess: state.alerts.shareAlertInProcess,
    shareAlertError: state.alerts.shareAlertError,
    shareAlertSuccess: state.alerts.shareAlertSuccess,
    shareAlertErrorUuid: state.alerts.shareAlertErrorUuid,
    shareAlertSuccessUuid: state.alerts.shareAlertSuccessUuid,
    shareAlertInProcessUuid: state.alerts.shareAlertInProcessUuid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    shareUserAlert: (user, userAlertUuid, email) => dispatch(shareUserAlert(user, userAlertUuid, email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SharedUserAlertModal);
