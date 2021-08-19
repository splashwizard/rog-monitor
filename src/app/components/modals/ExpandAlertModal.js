import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';
import {Modal, Row, Col, Form} from 'antd';
import noImage from '../../../assets/img/no-image.jpg';
import AlertTags from '../alerts/AlertTags';
import { isEmpty } from '../../redux/helperFunctions';
import { updateAlertTags } from '../../redux/alerts/actions';

const ExpandAlertForm = ({onCancel, visible, showAlert, alertImg, alertType, cameraName, cameraGroupName, timestamp, timezone, formatDatetime, loadError, imgLoadError, uuid, tags, cameraGroupsTags, cameraGroupUuid}) => {
  return (
    <Modal
      visible={visible}
      style={styles.modal}
      onCancel={onCancel}
      footer={[null, null]}
      width="90vw"
    >
      <Row type='flex' justify='space-between' style={{paddingBottom: 14}}>
        <AlertTags
          uuid={uuid}
          tags={tags}
          cameraGroupUuid={cameraGroupUuid}
          cameraGroupsTags={cameraGroupsTags}
        />
      </Row>
      <Row>
        {imgLoadError ?
          <img src={noImage} style={styles.expandedImg} />
        :
          <img src={alertImg} onError={loadError} style={styles.expandedImg} />
        }
      </Row>
      <Row type='flex' justify='space-between'>
        <Col style={styles.alertType} xs={24} sm={24} md={12} lg={8} xl={8}>{alertType}</Col>
        <Col style={styles.alertType} xs={24} sm={24} md={12} lg={8} xl={8}>{cameraName} at {cameraGroupName}</Col>
        <Col style={styles.alertDateTime} xs={24} sm={24} md={24} lg={8} xl={8}>{formatDatetime(timestamp, timezone)} {timezone}</Col>
      </Row>
    </Modal>
  );
};

class ExpandAlertModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visable: false,
      imgLoadError: false,
      cameraGroupsTags: isEmpty(props.cameraGroupsTags[props.camera_groups_uuid]) ? ["Clear", "Contacted Police", "Contacted Fire Dept", "Contacted Ambulance"] : this.props.cameraGroupsTags[this.props.camera_groups_uuid]
    }
  }

  formatDatetime = (timestamp, timezone) => {
    const dt = moment.tz(timestamp, timezone);
    return `${dt.format('L')} ${dt.format('LTS')}`;
  }

  showModal = () => {
    this.props.updateAlertTags(this.props.user, this.props.uuid, Object.keys(this.props.tags), this.state.cameraGroupsTags);
    this.setState({visible: true});
  };

  handleCancel = () => {
    this.setState({visible: false});
  };

  handleLoadError = () => {
    this.setState({imgLoadError: true});
  }

  render() {
    let trigger_type = this.props.trigger_type;
    if (this.props.trigger_type == 'RA') {
      trigger_type = 'Restricted Area';
    } else if (this.props.trigger_type == "VW") {
      trigger_type = "Virtual Wall";
    } else if (this.props.trigger_type == "LD") {
      trigger_type = "Loitering";
    }
    return (
      <div>
        {this.state.imgLoadError ?
          <img src={noImage} style={styles.alertCardImg} />
        :
          <img src={this.props.alert_image_url +'?auth='+ this.props.user.jwt} onError={this.handleLoadError} style={styles.alertCardImg} onClick={this.showModal} />
        }
        <ExpandAlertForm
          onCancel={this.handleCancel}
          alertImg={this.props.alert_image_url +'?auth='+ this.props.user.jwt}
          visible={this.state.visible}
          alertType={trigger_type}
          cameraName={this.props.cameras_name}
          cameraGroupName={this.props.camera_groups_name}
          timestamp={this.props.time}
          timezone={this.props.cameras_time_zone}
          formatDatetime={this.formatDatetime}
          loadError={this.handleLoadError}
          imgLoadError={this.state.imgLoadError}
          uuid={this.props.uuid}
          tags={this.props.tags}
          cameraGroupsTags={this.state.cameraGroupsTags}
          cameraGroupUuid={this.props.camera_groups_uuid}
        />
      </div>
    );
  }
}

const styles = {
  modal: {
    textAlign: 'center',
    wordBreak: 'break-word',
    top: '25px'
  },
  alertCardImg: {
    position: 'absolute',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto'
  },
  alertType: {
    fontSize: 14,
    paddingTop: 5
  },
  alertDateTime: {
    fontSize: 14,
    paddingTop: 5
  },
  alertTimeZone: {
    fontSize: 14,
    paddingTop: 5
  },
  expandedImg: {
    maxWidth: '80vw',
    width: '100%',
    margin: '0 auto'
  }
};

const mapStateToProps = (state) => {
  return {}
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateAlertTags: (user, alertUuid, tags, tag_options) => dispatch(updateAlertTags(user, alertUuid, tags, tag_options))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExpandAlertModal));
