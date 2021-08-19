import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Modal, Form, Input, InputNumber, Button, message, TimePicker, Select, Switch, Popconfirm, Tooltip } from 'antd';
import { SettingOutlined, SafetyOutlined, HomeOutlined, LinkOutlined, DisconnectOutlined, DeleteOutlined } from '@ant-design/icons';
import { editCamera, deleteCamera } from '../../redux/cameras/actions';
import {isEmpty} from '../../redux/helperFunctions';
import moment from 'moment-timezone';
import RefreshPreviewImage from '../buttons/RefreshPreviewImage';
import ExternalIntegration from '../formitems/ExternalIntegration';
import loading from '../../../assets/img/TempCameraImage.jpeg';

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 14 },
  },
};

class EditCamera extends Component {
  constructor(props) {
    super(props);
    let rogVerify = false;
    if (typeof props.data.s3_keywords !== 'undefined' && props.data.s3_keywords !== null && props.data.s3_keywords.hasOwnProperty('length')) {
      rogVerify = this.props.data.s3_keywords.length === 0 ? true : false;
    }
    this.state = {
      visible: false,
      popconfirmvisible: false,
      error: false,
      flag: false,
      time_zone: this.props.data.time_zone,
      fullRtspUrl: null,
      away_mode: this.props.data.away_mode,
      enabled: this.props.data.enabled,
      external_integration: this.props.data.external_integration,
      integrationActive: false,
      integrationList: null,
      selectedIntegrationTemplate: null,
      integrationTemplateFields: null,
      resetFields: false,
      rogVerify: rogVerify,
      rekognition_threshold: this.props.data.rekognition_threshold
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if (this.props.data.uuid === nextProps.data.uuid) {
      if (this.state.flag == true) {
        if (nextProps.editCameraError !== '' && this.props.editCameraError !== nextProps.editCameraError) {
          message.error(nextProps.editCameraError, 10);
          this.setState({flag: false});
        }
        if (nextProps.editCameraSuccess === true) {
          // message.success("Camera Updated");
          this.setState({flag: false});
        }
      }
    }
  }

  deleteCamera = () => {
    this.props.deleteCamera(this.props.data.user, this.props.data.camera_groups_uuid, this.props.data.uuid);
  };

  showModal = () => {
    this.setState({visible: true});
  };
  handleCancel = () => {
    this.setState({visible: false});
    this.setState({fullRtspUrl: null});
    this.resetFields();
  };
  checkNumberIfFloat(value) {
     return Number(value) === value && value % 1 !== 0;
  }
  handleCreate = (e) => {
    const form = this.form;
    form.validateFields().then(values => {
      values.camera_groups_uuid = this.props.data.cameraGroup.uuid;
      values.away_mode = this.state.away_mode;
      values.enabled = this.state.enabled;
      delete values.camera_url;
      if (typeof values.external_integration === 'undefined') {
        if (isEmpty(this.state.external_integration)) {
          values.external_integration = false;
        } else {
          values.external_integration = true;
        }
      }
      this.props.editCamera(this.props.user, this.props.data.uuid, values);
      this.setState({visible: false});
      this.setState({flag: true});
      this.setState({fullRtspUrl: null});
      this.resetFields();
    });
  };

  handleCreateSelectItems = () => {
    if (this.state.visible == true) {
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
  }

  handleUpdateTimeZone = (fieldValue) => {
    this.setState({time_zone: fieldValue});
  }

  handleToggleAwayMode = (fieldValue) => {
    if (this.props.cameraArmed && this.state.enabled) {
      this.setState({away_mode: fieldValue});
    } else {
      this.setState({away_mode: false});
      message.error('Camera connection must be enabled and triggers must be armed in order to turn on away mode.', 10);
    }
  }

  handleVisibleChange = (popconfirmvisible) => {
    if (!popconfirmvisible) {
      this.setState({ popconfirmvisible });
    }
    if (!this.state.enabled) {
      this.handleToggleEnabled(!this.state.enabled);
    } else {
      this.setState({ popconfirmvisible });
    }
  }

  handleToggleEnabled = (fieldValue) => {
    this.setState({enabled: fieldValue});
    if (!this.state.enabled == false) {
      this.setState({away_mode: false});
    }
  }

  resetFields = () => {
    this.form.resetFields();
    this.setState({
      integrationActive: false,
      integrationTemplateFields: null,
      selectedIntegrationTemplate: null,
      resetFields: true
    });
  };

  handleSetFormFieldsValue = (field) => {
    this.form.setFieldsValue(field);
  }

  handleFieldsReset = () => {
    this.setState({resetFields: false});
  }

  saveFormRef = (form) => {
    this.form = form;
  };

  render() {
    let away_mode = this.props.cameraArmed ? this.props.data.away_mode : false;
    return (
      <div>
        <Tooltip title='Camera Settings' placement='bottom'>
          <SettingOutlined onClick={this.showModal} style={styles.editCamera}/>
          </Tooltip>
        <Modal title={`Edit ${this.props.data.name}`}
               visible={this.state.visible}
               style={styles.modal}
               onCancel={this.handleCancel}
               onOk={this.handleCreate}
               okText='Done'
               cancelText='Cancel'
        >
          <Row type="flex" justify="center">
            <RefreshPreviewImage
              data={this.props.data}
            />
          </Row>
          <Form
            ref={this.saveFormRef}
            initialValues={{
              name: this.props.data.name,
              camera_uuid: this.props.data.uuid,
              camera_groups_uuid: this.props.data.camera_groups_uuid,
              camera_url: this.props.data.camera_url,
              username: this.props.data.username,
              away_mode: away_mode,
              time_zone: this.props.data.time_zone,
              s3_keywords: this.props.data.s3_keywords,
              rekognition_threshold: this.state.rekognition_threshold
            }}
          >
            <Form.Item label='Camera Name' name="name" {...formItemLayout}>
              <Input style={styles.input} type='text' placeholder="Camera Name" />
            </Form.Item>
            <Form.Item label="Camera Group UUID" name="camera_groups_uuid" {...formItemLayout}>
              <Input style={styles.input} type='text' disabled />
            </Form.Item>
            <Form.Item label="Camera UUID" name="camera_uuid" {...formItemLayout}>
              <Input style={styles.input} type='text' disabled />
            </Form.Item>
            <Form.Item label='URL' name="camera_url" {...formItemLayout} hidden={!this.state.rogVerify}>
              <Input style={styles.input} type='text' disabled />
            </Form.Item>
            <Form.Item label='Username' name="username" {...formItemLayout} hidden={!this.state.rogVerify}>
              <Input style={styles.input} type='text' placeholder="Camera Username" disabled />
            </Form.Item>
            <Form.Item label='Password' name="password" {...formItemLayout} hidden={!this.state.rogVerify}>
              <Input style={styles.input} type='password' placeholder="********" disabled />
            </Form.Item>
            <Form.Item label='S3 Keywords' name="s3_keywords" {...formItemLayout} hidden={this.state.rogVerify}>
              <Input style={styles.input} type='text' placeholder="xxx,xxxx" disabled={!isEmpty(this.props.data.s3_keywords)} />
            </Form.Item>
            <Form.Item label="Camera Time Zone" name="time_zone" {...formItemLayout}>
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
            <Form.Item label="Confidence Threshold" name="rekognition_threshold"  {...formItemLayout}>
              <InputNumber style={styles.input} type='number' min={0} max={100} placeholder="0" />
            </Form.Item>
            {/*<Form.Item label="Away Mode" name="away_mode" {...formItemLayout}>
              <Switch
                checkedChildren={<SafetyOutlined />}
                unCheckedChildren={<HomeOutlined />}
                onChange={this.handleToggleAwayMode}
                checked={this.state.away_mode}
              />
            </Form.Item>*/}
            {this.props.myRole.includes(0) &&
              <Form.Item
                label="Camera Connection"
                name="enabled" {...formItemLayout}>
                <Popconfirm
                  title={<p>Are you sure you want to disconnect this camera? <br /> <font color='orange'>WARNING: This will disconnect the ROG Security system</font></p>}
                  visible={this.state.popconfirmvisible}
                  onVisibleChange={this.handleVisibleChange}
                  onConfirm={() => this.handleToggleEnabled(!this.state.enabled)}
                  okText="Confirm"
                  cancelText="Nevermind">
                  <Switch
                    checkedChildren={<LinkOutlined />}
                    unCheckedChildren={<DisconnectOutlined />}
                    checked={this.state.enabled}
                    value={this.state.enabled}
                  />
                </Popconfirm>
              </Form.Item>
            }
            {this.props.myRole.includes(0) ?
              <ExternalIntegration setFormFieldsValue={this.handleSetFormFieldsValue} resetFields={this.state.resetFields} fieldsReset={this.handleFieldsReset} externalIntegrationData={this.state.external_integration} disabled={false} />
            :
              <ExternalIntegration setFormFieldsValue={this.handleSetFormFieldsValue} resetFields={this.resetFields} fieldsReset={this.handleFieldsReset} externalIntegrationData={this.state.external_integration} disabled={true} />
            }
          </Form>
          {this.props.myRole.includes(0) &&
            <Popconfirm title={<p>Are you sure delete this camera? <br /><font color='orange'>WARNING: this action cannot be undone!</font></p>} onConfirm={this.deleteCamera} okText='Yes' cancelText='No'>
              <Button type="danger" icon={<DeleteOutlined />}>Delete Camera</Button>
            </Popconfirm>
          }
        </Modal>
      </div>
    );
  }
}

const styles = {
  modal: {
    textAlign: 'center',
    wordBreak: 'break-word'
  },
  error: {
    color: 'red',
    textAlign: 'center'
  },
  editCamera: {
    fontSize: 18
  },
  image: {
    width: '50%'
  },
  timeZone: {
    width: '80%'
  },
  videoContainer: {
    backgroundColor: 'black',
    height: 130,
    width: 230,
    color: 'white',
    margin: '0 auto'
  },
  videoContainerText: {
    paddingTop: 50
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    editCameraInProcess: state.cameras.editCameraInProcess,
    editCameraError: state.cameras.editCameraError,
    editCameraSuccess: state.cameras.editCameraSuccess,
    cameraConnectionEnabled: state.cameras.cameraConnectionEnabled,
    cameraArmed: state.cameras.cameraArmed
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editCamera: (user, camera, cameraData) => dispatch(editCamera(user, camera, cameraData)),
    deleteCamera: (user, cameraGroupUuid, cameraUuid) => dispatch(deleteCamera(user, cameraGroupUuid, cameraUuid)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCamera);
