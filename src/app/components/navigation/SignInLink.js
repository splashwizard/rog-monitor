import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class SignInLink extends Component {

  goToPath = (path) => {
    this.props.history.push(path);
  }

  render() {
    return (
      <Link style={styles.signInLink} to='/login' replace>Sign In</Link>
    )
  }
}

const styles = {
  signInLink: {
    textDecoration: 'underline'
  }
}

export default SignInLink;
