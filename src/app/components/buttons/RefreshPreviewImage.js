import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, message } from 'antd';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { updatePreviewImage } from '../../redux/cameras/actions';

let timeout = {};

class RefreshPreviewImage extends Component {

  constructor() {
    super();
    this.state = {
      disabledFlag: false
    };
  }

  flagTimeout = () => {
    timeout[this.props.data.uuid] = setTimeout(() => {
      this.setState({disabledFlag: false});
      message.error('Timeout for fetching image.', 10);
    }, 90000);
  }

  removeTimeout = () => {
    clearTimeout(timeout[this.props.data.uuid]);
  }

  updatePreviewImage = () => {
    this.props.updatePreviewImage(this.props.data.user, this.props.data.cameraGroup, this.props.data.uuid);
    this.setState({disabledFlag: true});
    this.flagTimeout();
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data.uuid === nextProps.imageUpdateInProgressUuid) {
      if (!nextProps.imageUpdateInProgress) {
        this.setState({disabledFlag: false});
        this.removeTimeout();
      }
    }
  }

  render() {
    return (
        <Button type="primary" style={styles.getThumbnailBtn} onClick={this.updatePreviewImage} disabled={this.state.disabledFlag} icon={this.state.disabledFlag ? <LoadingOutlined /> : <SyncOutlined />}>
          Refresh Camera Thumbnail
        </Button>
    );
  }
}

const styles = {
  getThumbnailBtn: {
    backgroundColor: "#1890ff",
    marginBottom: 20
  }
}

const mapStateToProps = (state) => {
  return {
    imageUpdateInProgress: state.cameras.imageUpdateInProgress,
    imageUpdateInProgressUuid: state.cameras.imageUpdateInProgressUuid,
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    updatePreviewImage: (user, cameraGroupsUuid, cameraUuid) => dispatch(updatePreviewImage(user, cameraGroupsUuid, cameraUuid))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RefreshPreviewImage));
