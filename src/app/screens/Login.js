import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Form, Button, Input, Checkbox } from 'antd';
import { LoadingOutlined, LockOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;

import logoFull from '../../assets/img/logo-full.png';
import googleChromeLogo from '../../assets/img/Google_Chrome_logo.png';

import { login } from '../redux/auth/actions';
import RegisterBtn from '../components/navigation/RegisterBtn';
import JoinRogModal from '../components/modals/JoinRogModal';
import RequestPasswordResetModal from '../components/modals/RequestPasswordResetModal';

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 16,
  },
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inviteModalVisible: false,
      requestPasswordResetModal: false
    }
  }

  handleSubmit = (values) => {
    this.props.login(values.email, values.password);
  }

  toggleInviteModalVisibility = () => {
    this.setState({inviteModalVisible: !this.state.inviteModalVisible});
  }

  toggleRequestPasswordResetModalVisibility = () => {
    this.setState({requestPasswordResetModal: !this.state.requestPasswordResetModal});
  }

  render() {
    return (
      <Layout>
        <Header style={styles.header}>
          <img style={styles.headerLogo} src={logoFull} height='50px'/>
        </Header>
        <Layout>
          <Content style={styles.content}>
            <Row type='flex' justify='center' align='top'>
              <Col xs={{span: 0}} sm={{span: 12}}>
                <Row type='flex' justify='center' align='middle'>
                  <Col sm={{span: 24}} style={styles.titleText}>
                    <h1>Add Threat Detection to Any IP Camera</h1>
                    <h2>As easy as drawing a box</h2>
                  </Col>
                </Row>
                <Row type='flex' justify='center' align='bottom'>
                  <Col sm={{span: 24}} style={styles.downloadBtnContainer}>
                    <div style={styles.howItWorksLink}>
                      <a href='https://www.gorog.co' target="_blank">Learn how it works.</a>
                    </div>
                  </Col>
                </Row>
                <Row type='flex' justify='center' align='middle' style={{marginTop: 250}}>
                  <Col sm={{span: 24}} style={{textAlign: 'center'}}>
                    <img style={{maxWidth: 300}} src={googleChromeLogo} />
                    <p style={{marginTop: 10}}>
                      Designed For Use In Chrome Browser<br/>
                      [Issues May Arise If Other Internet Browsers Used]
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xs={{span: 24}} sm={{span: 12}} style={styles.backgroundWhite}>
                <Row type='flex' justify='center' align='middle'>
                  <Col xs={{span: 24}} style={styles.textCenter}>
                    <p style={styles.signUpText}>New to ROG?</p>
                    {/* <RegisterBtn /> */}
                    <Button onClick={this.toggleInviteModalVisibility} key='submit' type='primary' size='large' style={styles.inviteBtn}>
                      Request Invite
                    </Button>
                    <JoinRogModal visible={this.state.inviteModalVisible} toggleInviteModalVisibility={this.toggleInviteModalVisibility.bind(this)} />
                  </Col>
                </Row>
                <Row type='flex' justify='center' align='middle'>
                  <Col xs={{span: 18}} sm={{span: 12}}>
                    <div style={styles.dividerContainer}>
                      <span style={styles.dividerLine}>
                        or
                      </span>
                    </div>
                  </Col>
                </Row>
                <Row type='flex' justify='center' align='middle'>
                  <Col xs={{span: 24}} style={styles.signInText}>
                    <p>Existing ROG Account? <br /> Sign In</p>
                  </Col>
                </Row>
                <Row type='flex' justify='center' align='middle'>
                  <Col xs={{span: 24}} style={styles.loginError}>
                    <p>{this.props.loginError}</p>
                  </Col>
                </Row>
                <Row type='flex' justify='center' align='middle'>
                  <Col xs={{span: 18}} sm={{span: 12}}>
                    <Form
                      onFinish={this.handleSubmit}
                      className='login-form'
                      initialValues={{remember: true}}
                      {...layout}
                    >
                      <Form.Item
                        name="email"
                        label='Email'
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            pattern: new RegExp("^.+@[^\.].*\.[a-z]{2,}$"),
                            message: "Please enter a valid email address."
                          }
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        label='Password'
                        rules={[
                          { required: true, message: 'Please enter your password' }
                        ]}
                        hasFeedback
                      >
                        <Input.Password />
                      </Form.Item>
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        {...tailLayout}
                      >
                        <Checkbox style={styles.rememberUserUuid}>Remember my user ID</Checkbox>
                      </Form.Item>
                      <Form.Item {...tailLayout}>
                        <Button style={styles.signInBtn} type='primary' htmlType='submit' disabled={this.props.loginInProcess}>
                          {this.props.loginInProcess ? <LoadingOutlined style={styles.font13} /> : <LockOutlined style={styles.font13} />}&nbsp;Sign In
                        </Button>
                      </Form.Item>
                    </Form>
                    <div style={styles.licenseAgreement}>
                      <p>
                        By clicking Sign In, you agree to our <a target='_blank' href='https://www.gorog.co/terms-of-use'>Terms of Use</a>
                      </p>
                    </div>
                    <div style={styles.forgotPassword}>
                      <Button type="secondary" onClick={this.toggleRequestPasswordResetModalVisibility}>I forgot my Password</Button>
                    </div>
                    <RequestPasswordResetModal visible={this.state.requestPasswordResetModal} toggleRequestPasswordResetModalVisibility={this.toggleRequestPasswordResetModalVisibility.bind(this)} />
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
  chromeText: {
    color: 'white'
  },
  content: {
    marginTop: 65,
    zIndex: 0 // Required for Content to scroll under Header
  },
  signUpBtn: {
    backgroundColor: 'orange',
    border: 'none',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 500,
    padding: '10px 20px 35px'
  },
  signInBtn: {},
  inviteBtn: {
    backgroundColor: 'orange',
    border: 'none',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 500,
  },
  dividerContainer: {
    width: '100%',
    height: '20px',
    borderBottom: '1px solid black',
    textAlign: 'center',
    margin: '0 auto',
    marginBottom: 20
  },
  textCenter: {
    textAlign: 'center'
  },
  font13: {
    fontSize: 13
  },
  dividerLine: {
    display: 'inline-block',
    paddingTop: 8,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: '13px',
    backgroundColor: '#fff'
  },
  backgroundWhite: {
    backgroundColor: '#fff',
    height: 'calc(100vh - 65px)'
  },
  signUpText: {
    paddingTop: 40,
    paddingBottom: 0,
    fontWeight: 600,
    fontSize: 16
  },
  signInText: {
    fontWeight: 600,
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 16
  },
  loginError: {
    fontWeight: 600,
    textAlign: 'center',
    color: 'red'
  },
  rememberUserUuid: {
    fontWeight: 700
  },
  forgotPassword: {
    marginTop: 0
  },
  titleText: {
    textAlign: 'center',
    marginTop: 40
  },
  downloadBtnContainer: {
    textAlign: 'center'
  },
  downloadBtn: {
    backgroundColor: 'orange',
    border: 'none',
    fontSize: 20,
    fontWeight: 500,
    padding: '10px 20px 35px',
    marginTop: 20
  },
  howItWorksLink: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 20
  }
}

const mapStateToProps = (state) => {
  return {
    loginInProcess: state.auth.loginInProcess,
    loginError: state.auth.loginError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => dispatch(login(email, password)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
