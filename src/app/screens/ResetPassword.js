import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Layout, Row, Col, Form, Button, Input, Checkbox, message } from 'antd';
import { LoadingOutlined, LockOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;

import axios from 'axios';

import logoFull from '../../assets/img/logo-full.png';

import { getPasswordResetRequest, resetPassword } from '../redux/auth/actions';
import SignInLink from '../components/navigation/SignInLink';

const FormItem = Form.Item;

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 16,
  },
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false
    }
  }

  UNSAFE_componentWillMount = () => {
    this.props.getPasswordResetRequest(this.props.match.params.token);
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.resetPasswordSuccess && this.props.resetPasswordSuccess !== nextProps.resetPasswordSuccess) {
      message.success('Password reset complete! Please log in.');
      this.props.history.push('/login');
    }

    if (nextProps.resetPasswordError && this.props.resetPasswordError !== nextProps.resetPasswordError) {
      message.error(nextProps.resetPasswordError, 10);
      if (nextProps.resetPasswordError === 'Invalid request') {
        this.props.history.push('/login');
      }
    }

    if (nextProps.getPasswordResetRequestError && this.props.getPasswordResetRequestError !== nextProps.getPasswordResetRequestError) {
      message.error(nextProps.getPasswordResetRequestError, 10);
      this.props.history.push('/login');
    }
  }

  handleSubmit = (e) => {
    this.form.validateFields().then(values => {
      this.props.resetPassword(values.password, values.confirmPassword, this.props.match.params.token);
    });
  }

  onFinishFailed = ({ errorFields }) => {
    this.form.scrollToField(errorFields[0].name);
  };

  checkPasswordLength = async (rule, value) => {
    const form = this.form;
    if (value && value.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  checkConfirmPassword = async (rule, value) => {
    const form = this.form;
    if (value && value !== form.getFieldValue('password')) {
      throw new Error('The passwords must match');
    }
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  formRef = (form) => {
    this.form = form
  }

  render() {
    return (
      <Layout>
        <Header style={styles.header}>
          <img style={styles.headerLogo} src={logoFull} height='50px'/>
        </Header>
        <Layout>
          <Content style={styles.content}>
            <Row type='flex' justify='center' align='middle'>
              <Col xs={{span: 24}} style={styles.leftContainer}>
                <Row type='flex' justify='center' align='top'>
                  <Col xs={{span: 22}} sm={{span: 18}} md={{span: 14}} lg={{span: 10}} style={styles.rightHeadTitle}>
                    <h2 style={styles.headTitleText}>Welcome to ROG</h2>
                  </Col>
                </Row>
                <Row type='flex' justify='center' align='middle'>
                  <Col xs={{span: 22}} sm={{span: 18}} md={{span: 14}} lg={{span: 10}}>
                    <Form onFinish={this.handleSubmit} ref={this.formRef} style={styles.forgotPasswordForm} className='resetPassword-form'>
                      <FormItem label='New Password' name="password"
                        rules={[
                          {required: true, message: 'Please choose a password'},
                          {validator: this.checkPasswordLength}
                        ]}
                        hasFeedback
                        {...layout}
                      >
                        <Input.Password onBlur={this.validateStatus} />
                      </FormItem>
                      <FormItem label="Confirm New Password" name="confirmPassword"
                        rules={[
                          {required: true, message: 'Please confirm your password'},
                          {validator: this.checkConfirmPassword}
                        ]}
                        hasFeedback
                        {...layout}
                      >
                        <Input.Password onBlur={this.handleConfirmBlur} />
                      </FormItem>
                      <FormItem style={{justifyContent: 'center'}} {...layout}>
                        <Button style={styles.signUpBtn} type='primary' htmlType='submit' disabled={this.props.resetPasswordInProcess}>
                          {this.props.resetPasswordInProcess ? <LoadingOutlined style={styles.font13} /> : <LockOutlined style={styles.font13} />}
                          &nbsp;Reset Password
                        </Button>
                      </FormItem>
                    </Form>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

const styles = {
  header: {
    position: 'fixed',
    width: '100%',
    height: '65px',
    color: 'white',
    backgroundColor: 'black',
    zIndex: 1 // Required for Content to scroll under Header
  },
  headerLogo: {
    float: 'right',
    marginTop: 8
  },
  content: {
    marginTop: 65,
    zIndex: 0, // Required for Content to scroll under Header
  },
  leftContainer: {
    backgroundColor: '#fff',
    height: 'calc(100vh - 65px)'
  },
  signUpBtn: {
    backgroundColor: 'green'
  },
  registerFormHeadText: {
    marginTop: 30,
    marginBottom: 10
  },
  // phoneCaption: {
  //   marginTop: -20,
  // },
  signInLinkCaption: {
    fontSize: 16
  },
  rightContainer: {
    textAlign: 'center'
  },
  rightHeadTitle: {
    fontSize: 16,
    textAlign: 'center',
    float: 'left'
  },
  headTitleText: {
    width: 300,
    margin: '0 auto',
    paddingTop: 20,
    paddingBottom: 20
  },
  rightHeadCaption: {
    fontSize: 16
  },
  promotionText: {
    textAlign: 'left',
    fontSize: 16
  },
  termsOfServiceText: {
    marginBottom: 20
  },
  forgotPasswordForm: {
    textAlign: 'center',
    maxWidth: 500,
    margin: '0 auto'
  }
}

const mapStateToProps = (state) => {
  return {
    resetPassword: state.auth.resetPassword,
    getPasswordResetRequestInProcess: state.auth.getPasswordResetRequestInProcess,
    getPasswordResetRequestError: state.auth.getPasswordResetRequestError,
    resetPasswordInProcess: state.auth.resetPasswordInProcess,
    resetPasswordError: state.auth.resetPasswordError,
    resetPasswordSuccess: state.auth.resetPasswordSuccess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPasswordResetRequest: (token) => dispatch(getPasswordResetRequest(token)),
    resetPassword: (password, passwordConfirm, token) => dispatch(resetPassword(password, passwordConfirm, token))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));
