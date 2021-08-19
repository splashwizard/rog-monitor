import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as cameraActions from '../redux/cameras/actions';
import EditCamera from '../components/cameras/EditCamera'

class CameraDetails extends Component {
  UNSAFE_componentWillMount = () => {
    this.props.actions.fetchCamera(this.props.user, this.props.match.params.id);
  }

  render() {
    if (this.props.fetchInProcess) {
      return (<div>Loading...</div>)
    }
    else if (this.props.camera) {
      return (
        <EditCamera camera={this.props.camera} />
      )
    }
    else {
      return (<div>{this.props.fetchError}</div>)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    camera: state.cameras.camera,
    fetchError: state.cameras.fetchError,
    fetchInProcess: state.cameras.fetchInProcess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(cameraActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraDetails);