import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import ArrowRightOutlined from '@ant-design/icons';

import { register } from '../../redux/auth/actions';

class RegisterBtn extends Component {

  goToPath = (path) => {
    this.props.history.push(path);
  }

  render() {
    return (
      <Button type='primary' size={'large'} style={styles.signUpBtn} onClick={() => this.goToPath('/register')}><ArrowRightOutlined />Sign Up</Button>
    )
  }
}

const styles = {
  signUpBtn: {
    backgroundColor: 'orange',
    border: 'none',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 500,
    padding: '10px 20px 35px'
  }
}

export default withRouter(RegisterBtn);
