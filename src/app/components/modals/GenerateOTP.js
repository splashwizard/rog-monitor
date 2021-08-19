import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Modal, Input, Button, message } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';

import { generateOTP } from '../../redux/auth/actions';

class GenerateOTPModal extends Component {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.generateOTPError != '' && this.props.generateOTPError !== nextProps.generateOTPError) {
      message.error(nextProps.generateOTPError, 10);
    }
    if (nextProps.generateOTPSuccess && nextProps.generatedOTP !== this.props.generatedOTP) {
      Modal.info({
        maskClosable: true,
        title: 'Client Login OTP',
        icon: <QrcodeOutlined />,
        content: (
          <div onClick={this.copyOTP}>
            <Input id='OTPcode' value={nextProps.generatedOTP} readOnly />
          </div>
        )
      });
    }
  };

  generateOTP = () => {
    this.props.generateOTP(this.props.user);
  }

  copyOTP = () => {
    var copyText = document.getElementById("OTPcode");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    message.success("Copied OTP", 10);
  }

  render() {
    return (
      <div onClick={this.generateOTP}>
        <QrcodeOutlined />
        &nbsp;&nbsp;
        <span>{this.props.linkText}</span>
      </div>
    );
  }
}

const styles = {
  error: {
    color: 'red'
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    generatedOTP: state.auth.generatedOTP,
    generateOTPError: state.auth.generateOTPError,
    generateOTPSuccess: state.auth.generateOTPSuccess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    generateOTP: (user) => dispatch(generateOTP(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateOTPModal);
