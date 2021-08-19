import React, { Component } from 'react';
import {Row, Col} from 'antd';

import CameraCard from './CameraCard';

class CameraTiles extends Component {

  render() {
    if ('cameras' in this.props.cameraGroup && this.props.cameraGroup.cameras.length > 0) {
      return (
        <Row type='flex' justify='start' style={styles.cameraListContainer}>
          {this.props.cameraGroup.cameras.map(camera => (
            <Col key={`camera-${camera.uuid}`} xs={24} sm={12} md={8} lg={6} style={styles.cameraCard}>
              <CameraCard
                {...camera}
                user={this.props.user}
                cameraGroup={this.props.cameraGroup}
              />
            </Col>
          ))}
        </Row>
      );
    } else {
      return (
        <Row type='flex' justify='start' style={styles.cameraListContainer}>
          <p style={styles.noCamerasText}>
            This camera group has no cameras.
            <br />
            Add a camera under this camera group to get started.
          </p>
        </Row>
      );
    }
  }
}

const styles = {
  noCamerasText: {
    margin: '0 auto',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 24
  },
  cameraListContainer: {},
  cameraCard: {
    minWidth: 320,
    maxHeight: 304
  }
}

export default CameraTiles;
