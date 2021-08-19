import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Layout, Row, Col, Form, Button, Input, Checkbox, Select, message } from 'antd';
import { LoadingOutlined, LockOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';
const { Header, Content } = Layout;

import axios from 'axios';

import logoFull from '../../assets/img/logo-full.png';

import { getInvitation, register } from '../redux/auth/actions';
import SignInLink from '../components/navigation/SignInLink';

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

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      time_zone: moment.tz.guess()
      // phoneError: false
    }
  }

  UNSAFE_componentWillMount = () => {
    this.props.getInvitation(this.props.match.params.token);
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.registerSuccess && this.props.registerSuccess !== nextProps.registerSuccess) {
      message.success('Registration complete! Please log in.');
      this.props.history.push('/login');
    }

    if (nextProps.registerError && this.props.registerError !== nextProps.registerError) {
      message.error(nextProps.registerError, 10);
      if (nextProps.registerError === 'Invalid invitation') {
        this.props.history.push('/login');
      }
    }

    if (nextProps.getInvitationError && this.props.getInvitationError !== nextProps.getInvitationError) {
      message.error(nextProps.getInvitationError, 10);
      this.props.history.push('/login');
    }

    if (typeof nextProps.invitation !== 'undefined') {
      this.form.setFieldsValue({email: nextProps.invitation.email})
    }
  }

  handleSubmit = (e) => {
    this.form.validateFields().then(values => {
      this.props.register(values.email, values.firstName, values.lastName, this.state.time_zone, values.password, values.confirmPassword, this.props.match.params.token);
    });
  }

  onFinishFailed = ({ errorFields }) => {
    this.form.scrollToField(errorFields[0].name);
  };

  checkAgreement = async (rule, value) => {
    const form = this.form;
    if (!value) {
      throw new Error('Please agree to our terms of use.');
    }
  }

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
    this.form = form;
  }

  handleCreateSelectItems = () => {
    let timezoneNames = moment.tz.names();
    let items = [];
    for (var i = 0; i < timezoneNames.length; i++) {
      if (!items.includes(timezoneNames[i])) {
        if (timezoneNames[i] !== "US/Pacific-New") {
          items.push(<Select.Option key={timezoneNames[i]} value={timezoneNames[i]}>{timezoneNames[i]}</Select.Option>);
        }
      }
    }
    return items;
  }

  handleUpdateTimeZone = (fieldValue) => {
    this.setState({time_zone: fieldValue});
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
                    <Form
                      onFinish={this.handleSubmit}
                      ref={this.formRef}
                      className='register-form'
                      style={styles.registerForm}
                      initialValues={{time_zone: this.state.time_zone}}
                    >
                      <Form.Item label='Email Address' name="email" hasFeedback {...layout}>
                        <Input onBlur={this.validateStatus} readOnly disabled />
                      </Form.Item>
                      <Form.Item label='First Name' name="firstName" rules={[{required: true, message: 'Please enter your first name'}]} hasFeedback {...layout}>
                        <Input onBlur={this.validateStatus} />
                      </Form.Item>
                      <Form.Item label='Last Name' name="lastName" rules={[{required: true, message: 'Please enter your last name'}]} hasFeedback {...layout}>
                        <Input onBlur={this.validateStatus} />
                      </Form.Item>
                      <Form.Item label="Time Zone" name="time_zone" align='middle' rules={[{required: true, message: 'Please enter your time zone'}]} hasFeedback {...layout}>
                        <Select
                          showSearch
                          placeholder="Enter Time Zone"
                          optionFilterProp="children"
                          default="UTC"
                          onChange={this.handleUpdateTimeZone}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {this.handleCreateSelectItems()}
                        </Select>
                      </Form.Item>
                      <Form.Item label='Password' name="password"
                        rules={[
                          {required: true, message: 'Please choose a password'},
                          {validator: this.checkPasswordLength}
                        ]}
                        hasFeedback
                         {...layout}
                      >
                        <Input.Password onBlur={this.validateStatus} />
                      </Form.Item>
                      <Form.Item label="Confirm Password" name="confirmPassword"
                        rules={[
                          {required: true, message: 'Please confirm your password'},
                          {validator: this.checkConfirmPassword}
                        ]}
                        hasFeedback
                         {...layout}
                      >
                        <Input.Password onBlur={this.handleConfirmBlur} />
                      </Form.Item>
                      <Form.Item name="termsOfUse" valuePropName="checked" rules={[{validator: this.checkAgreement}]} style={styles.checkBox} {...layout}>
                        <Checkbox>By clicking Sign Up, you acknowledge you have read and agree to the <a href='https://www.gorog.co/terms-of-use' target='_blank'>Terms of Use</a>.</Checkbox>
                      </Form.Item>
                      <Form.Item style={{justifyContent: 'center'}} {...layout}>
                        <Button style={styles.signUpBtn} type='primary' htmlType='submit' disabled={this.props.registerInProcess}>
                          {this.props.registerInProcess ? <LoadingOutlined style={styles.font13} /> : <LockOutlined style={styles.font13} />}
                          &nbsp;Sign Up
                        </Button>
                      </Form.Item>
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
  registerForm: {
    textAlign: 'center',
    float: 'left'
  },
  checkBox: {
    justifyContent: 'center'
  },
  timeZone: {
    width: '80%'
  },
}

const mapStateToProps = (state) => {
  return {
    invitation: state.auth.invitation,
    getInvitationInProcess: state.auth.getInvitationInProcess,
    getInvitationError: state.auth.getInvitationError,
    registerInProcess: state.auth.registerInProcess,
    registerError: state.auth.registerError,
    registerSuccess: state.auth.registerSuccess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInvitation: (token) => dispatch(getInvitation(token)),
    register: (email, firstName, lastName, time_zone, password, confirmPassword, token) => dispatch(register(email, firstName, lastName, time_zone, password, confirmPassword, token))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
