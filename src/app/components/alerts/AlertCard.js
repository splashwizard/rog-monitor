import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Row, Col, Tooltip, Tag, Select, message, Button } from 'antd';
import { ShareAltOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';
import axios from 'axios';
import { isEmpty } from '../../redux/helperFunctions';
import { deleteAlert, updateAlertTags } from '../../redux/alerts/actions';
import ExpandAlertModal from '../modals/ExpandAlertModal';
import ShareUserAlertModal from '../modals/ShareUserAlertModal';

class AlertCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shareUserAlertModalVisible: false,
      tags: isEmpty(props.tags) ? [] : props.tags,
      inputVisible: false,
      inputValue: '',
      time_zone: this.props.cameras_time_zone
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (typeof this.props.filter_time_zone !== 'undefined' && !isEmpty(this.props.filter_time_zone)) {
      if (this.props.filter_time_zone !== this.state.time_zone) {
        this.setState({time_zone: this.props.filter_time_zone});
      }
    }
    if (this.props.updateAlertTagsError && this.props.updateAlertTagsErrorUuid == this.props.uuid && this.props.updateAlertTagsError !== prevProps.updateAlertTagsError) {
      message.error(this.props.updateAlertTagsError, 10);
    }
    if (this.props.updateAlertTagsSuccessUuid == this.props.uuid && prevState.tags !== this.props.updatedTags) {
      this.setState({tags: this.props.updatedTags});
    }
  }

  formatDatetime = (timestamp, timezone) => {
    const dt = moment.tz(timestamp, timezone);
    return `${dt.format('L')} ${dt.format('LTS')}`;
  }

  playAlertVideo = () => {
    //this.props.history.push('/video', {videoSource: this.props.video})
  }

  deleteAlert = () => {
    if (!this.props.deleteInProcess) {
      this.props.deleteAlert(this.props.user, this.props.uuid);
    }
  }

  toggleShareUserAlertModalVisibility = () => {
    this.setState({shareUserAlertModalVisible: !this.state.shareUserAlertModalVisible})
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let tags = Object.keys(this.props.tags);
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue, "add_"+inputValue];
    }
    this.props.updateAlertTags(this.props.user, this.props.uuid, tags, this.props.cameraGroupsTags[this.props.camera_groups_uuid]);
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => {
    this.input = input;
  };

  render() {
    let trigger_type = this.props.trigger_type;
    if (this.props.trigger_type == 'RA') {
      trigger_type = 'Restricted Area';
    } else if (this.props.trigger_type == "VW") {
      trigger_type = "Virtual Wall";
    } else if (this.props.trigger_type == "LD") {
      trigger_type = "Loitering";
    }
    const tag_options = isEmpty(this.props.cameraGroupsTags[this.props.camera_groups_uuid]) ? ["Clear", "Contacted Police", "Contacted Fire Dept", "Contacted Ambulance"] : this.props.cameraGroupsTags[this.props.camera_groups_uuid];
    return (
      <Card style={styles.alertCard}>
        <div style={styles.alertCardImgContainer}>
          <ExpandAlertModal
            trigger_type={this.props.trigger_type}
            alert_image_url={this.props.alert_image_url}
            user={this.props.user}
            cameras_name={this.props.cameras_name}
            camera_groups_name={this.props.camera_groups_name}
            time={this.props.time}
            cameras_time_zone={this.state.time_zone}
            uuid={this.props.uuid}
            tags={this.state.tags}
            updatedTags={this.props.updatedTags}
            cameraGroupsTags={this.props.cameraGroupsTags}
            camera_groups_uuid={this.props.camera_groups_uuid}
          />
        </div>
        <Row type='flex' justify='space-between'>
          <Col style={styles.alertType} xs={8} sm={8} md={8}>{trigger_type}</Col>
          <Col style={styles.alertDateTime} xs={14} sm={14} md={14}>{this.formatDatetime(this.props.time, this.state.time_zone)}</Col>
          <Col style={styles.shareAlertButton} xs={8} sm={8} md={8}>
            <Button type='default' size='small'  style={styles.share} onClick={this.toggleShareUserAlertModalVisibility}><ShareAltOutlined /><span> Share Alert</span></Button>
            <ShareUserAlertModal
              visible={this.state.shareUserAlertModalVisible}
              alert={this.props}
              toggleShareUserAlertModalVisibility={this.toggleShareUserAlertModalVisibility.bind(this)} />
          </Col>
          <Col style={styles.alertDateTime} xs={14} sm={14} md={14}>{this.state.time_zone}</Col>
          <Col style={styles.cameraNameCameraGroup} xs={24}>{this.props.cameras_name}</Col>
          <Col style={styles.cameraNameCameraGroup} xs={24}>{this.props.camera_groups_name}</Col>
        </Row>
        <Row type='flex' fustify='space-between'>
          <Col xs={24} style={styles.tags}>
            {"new" in this.state.tags ?
              <Tag closable={true} onClose={() => this.props.updateAlertTags(this.props.user, this.props.uuid, Object.keys(this.state.tags), this.props.cameraGroupsTags[this.props.camera_groups_uuid])}>New</Tag>
            :
              <Tag closable={false} visible={true}>Viewed</Tag>
            }
            {this.state.inputVisible && (
              <Select
                ref={this.saveInputRef}
                size="small"
                className="tag-input"
                value={this.state.inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                defaultOpen={true}
                autoFocus={true}
                dropdownMatchSelectWidth={false}
              >
                {tag_options.map(tag_option => (
                  <Select.Option key={tag_option} value={tag_option} title={tag_option}>{tag_option}</Select.Option>
                ))}
              </Select>
            )}
            {!this.state.inputVisible && (
              <Tag className="site-tag-plus" onClick={this.showInput}>
                <PlusOutlined /> Select Tag
              </Tag>
            )}
          </Col>
        </Row>
      </Card>
    )
  }
}

const styles = {
  alertCard: {
    marginTop: 10,
    marginLeft: 10,
    marginRight:10,
    marginBottom: 0,
    maxWidth: 405
  },
  alertType: {
    paddingTop: 5,
    marginLeft: 10,
    textAlign: 'left'
  },
  alertDateTime: {
    paddingTop: 5,
    marginRight: 10,
    textAlign: 'right'
  },
  share: {
    backgroundColor: '#fafafa',
    color: 'rgba(0, 0, 0, 0.65)',
    border: '1px solid #d9d9d9'
  },
  shareAlertButton: {
    marginTop: 7,
    marginLeft: 10,
    textAlign: 'left'
  },
  cameraNameCameraGroup: {
    paddingTop: 7,
    paddingLeft: 10,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  alertDelete: {
    fontSize: 12,
    paddingTop: 5
  },
  alertCardImgContainer: {
    backgroundColor: 'black',
    height: 170,
    position: 'relative',
    margin: '0 auto',
    paddingLeft: 0,
    paddingRight: 0
  },
  tags: {
    marginLeft: 10,
    marginRight: 10
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    deleteError: state.alerts.deleteError,
    deleteInProcess: state.alerts.deleteInProcess,
    updatedTags: state.alerts.tags,
    updateAlertTagsError: state.alerts.updateAlertTagsError,
    updateAlertTagsErrorUuid: state.alerts.updateAlertTagsErrorUuid,
    updateAlertTagsInProcess: state.alerts.updateAlertTagsInProcess,
    updateAlertTagsInProcessUuid: state.alerts.updateAlertTagsInProcessUuid,
    updateAlertTagsSuccessUuid: state.alerts.updateAlertTagsSuccessUuid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAlert: (user, alertUuid) => dispatch(deleteAlert(user, alertUuid)),
    updateAlertTags: (user, alertUuid, tags, tag_options) => dispatch(updateAlertTags(user, alertUuid, tags, tag_options))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlertCard));
