import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal, Form, Spin, Button, Popover, message, Slider, Row, Col, TimePicker, Select, Checkbox, Alert, Tooltip} from 'antd';
import { EyeOutlined, SaveOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import CustomCanvas from '../../components/formitems/CustomCanvas';
import CustomInput from "../formitems/CustomInput";
import {createTrigger, fetchTriggers, deleteTrigger, updateTimeWindowData, clearTimeWindowData, addNewTriggerTimeWindow, getTriggerSpecificTimeWindows, setTriggerSpecificTimeWindows, createTriggerTimeWindow, updateTriggerTimeWindow, deleteTriggerTimeWindow} from '../../redux/triggers/actions';
import {connect} from 'react-redux';
import {isEmpty} from '../../redux/helperFunctions';
import moment from 'moment';
import loading from '../../../assets/img/TempCameraImage.jpeg';
import noImage from '../../../assets/img/no-image.jpg';

const AddTriggerForm = ({
  onCancel,
  triggers,
  sliderValue,
  loiteringSeconds,
  deleteStatus,
  deleteButton,
  triggerInProcess,
  triggerExtras,
  deleteTrigger,
  visible,
  saveCancel,
  form,
  cameraName,
  triggerPointDirection,
  handleSaveCancel,
  triggerImg,
  handleVisibility,
  visibility,
  showTrigger,
  canvasMode,
  onImgLoad,
  imageDimensions,
  convertToMilitaryFormat,
  currentTriggerDetails,
  direction,
  fetchTriggerInProcess,
  newLoiteringTrigger,
  updateDataStart,
  updateDataStop,
  updateDataDaysOfWeek,
  changeTimeWindow,
  resetData,
  checkForWindow,
  time_zone,
  saveData,
  timeWindows,
  cameraGroupOwner,
  selectedTriggerShared,
  addNewTimeWindow,
  getTriggerSpecificTimeWindows,
  setTriggerTimeWindows,
  deleteTriggerTimeWindow,
  cameraWideDisabled,
  cameraWide,
  toggleCameraWide,
  canvasKey,
  sharedTriggerSilenceWindowDisabled,
  checkShared,
  updateTriggerSilenceWindowPermissionsChange,
  selectedTriggerSharedDisabled,
  imgLoadFail,
  rogProtect
}) => {
  const formItemLayout = {
    labelCol: {
      xs: {span: 8},
    },
    wrapperCol: {
      xs: {span: 16},
    },
  };
  return (
    <Modal title={`${cameraName} Trigger Settings`}
           visible={visible}
           style={styles.modal}
           onCancel={onCancel}
           footer={[null, null]}
           width="50%"
           destroyOnClose
    >
      <Form ref={form} initialValues={{sharedTrigger: true, sharedTriggerSilenceWindow: true}} preserve={false}>
        <Form.Item style={styles.triggersHideShow} key={canvasKey}>
          {triggerImg === null &&
            <img src={loading} style={styles.image} onLoad={onImgLoad} onReset={onImgLoad} />
          }
          {triggerImg && triggerImg === noImage &&
            <img src={noImage} style={styles.image} onLoad={onImgLoad} onReset={onImgLoad} />
          }
          {triggerImg && triggerImg !== noImage &&
            <img src={triggerImg} style={styles.image} onLoad={onImgLoad} onReset={onImgLoad} onError={imgLoadFail} />
          }
          {canvasMode && imageDimensions &&
            <CustomCanvas
              width={imageDimensions.width}
              height={imageDimensions.height}
              triggerPointDirection={triggerPointDirection}
              getTriggers={triggers}
              direction={direction}
              triggerExtras={triggerExtras}
              triggerType={currentTriggerDetails.currentBaseTriggerType}
              setTriggerTimeWindows={setTriggerTimeWindows}
            />
          }
          {canvasMode && (currentTriggerDetails.currentBaseTriggerType === 'LD') && (saveCancel || deleteButton) &&
            <Row>
              <Col span={4} style={styles.LDtimeLeft}>
                {convertToMilitaryFormat(loiteringSeconds)}
              </Col>
              <Col span={16}>
                {newLoiteringTrigger === true ?
                  <Slider tipFormatter={(value) => convertToMilitaryFormat(loiteringSeconds)} min={15} max={1800}
                        step={1} onChange={sliderValue} value={loiteringSeconds}/>
                  :
                  <Slider tipFormatter={(value) => convertToMilitaryFormat(loiteringSeconds)} min={15} max={1800}
                          step={1} onChange={sliderValue} value={loiteringSeconds} disabled />
                  }
              </Col>
              <Col span={4}>
                <p style={styles.LDtimeRight}>30:00 Min</p>
              </Col>
            </Row>
          }
          {deleteButton && canvasMode &&
            <div>
              <div>
                <span style={styles.currenttriggerDetails}>
                  Trigger Type: {(currentTriggerDetails.currentBaseTriggerType === 'RA') ? 'Restricted Area' : ((currentTriggerDetails.currentBaseTriggerType === 'LD') ? 'Loitering Detection' : 'Virtual Wall')}
                </span>
                <Button style={styles.deleteButton} onClick={deleteTrigger} loading={deleteStatus}>
                  Delete
                </Button>
              </div>
              <div>&nbsp;</div>
              <div style={styles.borderBox}>
                <div>&nbsp;</div>
                {cameraGroupOwner &&
                  <Form.Item label="Trigger Permissions" name="sharedTrigger" {...formItemLayout}>
                    <Select
                      placeholder="Shared or Private"
                      style={styles.triggerTimeWindowSelect}
                      disabled={selectedTriggerSharedDisabled}
                      onChange={checkShared}
                    >
                      <Select.Option key={0} value={false}>Private</Select.Option>
                      <Select.Option key={1} value={true}>Shared</Select.Option>
                    </Select>
                  </Form.Item>
                }
                <div className="ant-form-item-label">
                  <label>Trigger Disarm Windows</label>
                </div>
                <Form.Item label="Select Disarm Window" name="time_window_select" {...formItemLayout}>
                  <div>
                    <Select
                      placeholder="Select Disarm Window"
                      style={styles.triggerTimeWindowSelect}
                      onChange={changeTimeWindow}
                      notFoundContent="Click/Tap the plus button to add a disarm window."
                    >
                    {timeWindows.map((timeWindow, key) => {
                      return <Select.Option key={key} value={key}>Time Window: {key + 1}</Select.Option>;
                    })}
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />} onClick={addNewTimeWindow} style={styles.addNewTimeWindowButton}></Button>
                  </div>
                </Form.Item>
                {cameraGroupOwner && selectedTriggerShared &&
                  <Form.Item label="Disarm Window Permissions" name="sharedTriggerSilenceWindow" {...formItemLayout}>
                    <Select
                      placeholder="Shared or Private"
                      style={styles.triggerTimeWindowSelect}
                      disabled={sharedTriggerSilenceWindowDisabled}
                    >
                      <Select.Option key={0} value={false}>Private</Select.Option>
                      <Select.Option key={1} value={true}>Shared</Select.Option>
                    </Select>
                  </Form.Item>
                }
                <Form.Item label="Select Disarm Window Days" name="days_of_week" {...formItemLayout}>
                  <Select
                    mode="multiple"
                    onChange={updateDataDaysOfWeek}
                    onBlur={checkForWindow}
                    placeholder="Select Days"
                    style={styles.dayPicker}
                  >
                    <Select.Option key="monday" value="monday">Monday</Select.Option>
                    <Select.Option key="tuesday" value="tuesday">Tuesday</Select.Option>
                    <Select.Option key="wednesday" value="wednesday">Wednesday</Select.Option>
                    <Select.Option key="thursday" value="thursday">Thursday</Select.Option>
                    <Select.Option key="friday" value="friday">Friday</Select.Option>
                    <Select.Option key="saturday" value="saturday">Saturday</Select.Option>
                    <Select.Option key="sunday" value="sunday">Sunday</Select.Option>
                  </Select>
                </Form.Item>
                <div span={24} className="ant-form-item-label">
                  <label>Set Disarm Window Time {time_zone ? "("+time_zone+")" : ''}</label>
                </div>
                <Row>
                  <Form.Item span={12} name="start_at" style={{float: 'left', width: '50%'}}>
                    <TimePicker
                      span={8}
                      style={{margin: '0 auto'}}
                      onChange={updateDataStart}
                      onOpenChange={checkForWindow}
                      allowClear={true}
                      placeholder="Start Time"
                      format={'HH:mm'}
                    />
                  </Form.Item>
                  <Form.Item span={12} name="end_at" style={{float: 'right', width: '50%'}}>
                    <TimePicker
                      span={8}
                      style={{margin: '0 auto'}}
                      onChange={updateDataStop}
                      onOpenChange={checkForWindow}
                      allowClear={true}
                      placeholder="End Time"
                      format={'HH:mm'}
                    />
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item name="camera_wide" span={24} style={{margin: '0 auto'}}>
                    <Checkbox
                      checked={cameraWide}
                      disabled={cameraWideDisabled}
                      onChange={toggleCameraWide}
                    >
                      Add Disarm Window to All Existing Triggers in This Camera
                    </Checkbox>
                  </Form.Item>
                </Row>
                <Row>
                  <Col span={8}>
                    <Button type="danger" icon={<DeleteOutlined />} onClick={deleteTriggerTimeWindow}>Delete Disarm Window</Button>
                  </Col>
                  <Col span={8}>
                    <Button type="danger" icon={<CloseOutlined />} onClick={resetData}>Clear Form</Button>
                  </Col>
                  <Col span={8}>
                    <Button type="primary" icon={<SaveOutlined />} onClick={saveData}>Save Disarm Window</Button>
                  </Col>
                </Row>
                <div>&nbsp;</div>
              </div>
            </div>
          }
        </Form.Item>
        {!deleteButton ?
          <div>
            {triggerImg !== null && triggerImg !== noImage ?
              <Form.Item style={{maxWidth: 113, margin: '0 auto'}}>
                <Popover
                  title='Select Trigger Type to Add'
                  content={
                    <div style={styles.triggerType}>
                      <Button type="secondary" onClick={() => showTrigger('RA')}>Restricted Area</Button>
                      <br/>
                      {rogProtect &&
                        <div>
                          <Button type="secondary" onClick={() => showTrigger('VW')}>Virtual Wall</Button>
                          <br/>
                          <Button type="secondary" onClick={() => showTrigger('LD')}>Loitering</Button>
                          <br/>
                        </div>
                      }
                    </div>
                  }
                  trigger="click"
                  visible={visibility}
                  onVisibleChange={handleVisibility}
                >
                  {!saveCancel &&
                    <div type="secondary">
                      <CustomInput trigger={true} visibility={visibility} handleSaveCancel={handleSaveCancel} fetchTriggerInProcess={fetchTriggerInProcess} />
                    </div>
                  }
                </Popover>
              </Form.Item>
            :
              <Form.Item style={{maxWidth: 250, margin: '0 auto'}}>
                <Alert message="Cannot Load Preview Image" type="error" />
              </Form.Item>
            }
          </div>
        :
          <Button key='secondary' onClick={() => handleSaveCancel('cancel')} style={styles.cancelBtn} size='small'>Cancel</Button>
        }
        {saveCancel &&
          <Form.Item style={{marginTop: -50}}>
            <div>
              <div>
                <div style={styles.borderBox}>
                  <div>&nbsp;</div>
                  {cameraGroupOwner &&
                    <Form.Item label="Trigger Permissions" name="sharedTrigger" {...formItemLayout}>
                      <Select
                        placeholder="Shared or Private"
                        style={styles.triggerTimeWindowSelect}
                        onChange={checkShared}
                      >
                        <Select.Option key={0} value={false}>Private</Select.Option>
                        <Select.Option key={1} value={true}>Shared</Select.Option>
                      </Select>
                    </Form.Item>
                  }
                  <div className="ant-form-item-label">
                    <label>Trigger Disarm Windows</label>
                  </div>
                  <Form.Item label="Select Disarm Window" name="time_window_select" {...formItemLayout}>
                  <div>
                    <Select
                      placeholder="Select Disarm Window"
                      style={styles.triggerTimeWindowSelect}
                      onChange={changeTimeWindow}
                      notFoundContent="Click/Tap the plus button to add a disarm window."
                    >
                    {timeWindows.map((timeWindow, key) => {
                      return <Select.Option key={key} value={key}>Time Window: {key + 1}</Select.Option>;
                    })}
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />} onClick={addNewTimeWindow} style={{top: 1}}></Button>
                  </div>
                  </Form.Item>
                  {cameraGroupOwner && selectedTriggerShared &&
                    <Form.Item label="Disarm Window Permissions" name="sharedTriggerSilenceWindow" {...formItemLayout}>
                      <Select
                        placeholder="Shared or Private"
                        style={styles.triggerTimeWindowSelect}
                        onChange={updateTriggerSilenceWindowPermissionsChange}
                      >
                        <Select.Option key={0} value={false}>Private</Select.Option>
                        <Select.Option key={1} value={true}>Shared</Select.Option>
                      </Select>
                    </Form.Item>
                  }
                  <Form.Item label="Select Disarm Window Days" name="days_of_week" {...formItemLayout}>
                    <Select
                      mode="multiple"
                      onChange={updateDataDaysOfWeek}
                      onBlur={checkForWindow}
                      placeholder="Select Days"
                      style={styles.dayPicker}
                    >
                      <Select.Option key="monday" value="monday">Monday</Select.Option>
                      <Select.Option key="tuesday" value="tuesday">Tuesday</Select.Option>
                      <Select.Option key="wednesday" value="wednesday">Wednesday</Select.Option>
                      <Select.Option key="thursday" value="thursday">Thursday</Select.Option>
                      <Select.Option key="friday" value="friday">Friday</Select.Option>
                      <Select.Option key="saturday" value="saturday">Saturday</Select.Option>
                      <Select.Option key="sunday" value="sunday">Sunday</Select.Option>
                    </Select>
                  </Form.Item>
                  <div span={24} className="ant-form-item-label">
                    <label>Set Disarm Window Time {time_zone ? "("+time_zone+")" : ''}</label>
                  </div>
                  <Row>
                    <Form.Item span={12} name="start_at" style={{float: 'left', width: '50%'}}>
                      <TimePicker
                        span={8}
                        style={{margin: '0 auto'}}
                        onChange={updateDataStart}
                        onOpenChange={checkForWindow}
                        allowClear={true}
                        placeholder="Start Time"
                        format={'HH:mm'}
                      />
                    </Form.Item>
                    <Form.Item span={12} name="end_at" style={{float: 'right', width: '50%'}}>
                      <TimePicker
                        span={8}
                        style={{margin: '0 auto'}}
                        onChange={updateDataStop}
                        onOpenChange={checkForWindow}
                        allowClear={true}
                        placeholder="End Time"
                        format={'HH:mm'}
                      />
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item name="camera_wide" span={24} style={{margin: '0 auto'}}>
                      <Checkbox
                        checked={cameraWide}
                        disabled={cameraWideDisabled}
                        onChange={toggleCameraWide}
                      >
                        Add Disarm Window to All Existing Triggers in This Camera
                      </Checkbox>
                    </Form.Item>
                  </Row>
                  <Row>
                    <Button type="danger" icon={<CloseOutlined />} onClick={resetData} style={{margin: '0 auto'}}>Clear Disarm Window</Button>
                  </Row>
                  <div>&nbsp;</div>
                </div>
              </div>
              <Button key='add_trigger' onClick={() => handleSaveCancel('save')} loading={triggerInProcess}
                      style={styles.saveBtn} size='small'>
                Save
              </Button>
              <Button key='cancel' onClick={() => handleSaveCancel('cancel')} style={styles.cancelBtn} size='small'>
                Cancel
              </Button>
            </div>
          </Form.Item>
        }
      </Form>
    </Modal>
  );
};

class AddTriggerModal extends Component {
  constructor(props) {
    super(props);
    let rogProtect = true;
    if (typeof props.data.s3_keywords !== 'undefined' && props.data.s3_keywords !== null && props.data.s3_keywords.hasOwnProperty('length')) {
      let rogProtect = props.data.s3_keywords.length === 0 ? true : false
    }
    this.state = {
      visible: false,
      error: false,
      visibility: false,
      canvasMode: true,
      imageDimensions: false,
      saveCancel: false,
      triggers: false,
      deleteButton: false,
      loiteringSeconds: 0,
      triggerType: '',
      newLoiteringTrigger: false,
      time_zone: this.props.data.time_zone,
      cameraGroupOwner: false,
      cameraWide: false,
      cameraWideDisabled: false,
      image: null,
      sharedTriggerSilenceWindowDisabled: false,
      currentTriggerShared: null,
      currentTriggerSharedDisabled: false,
      rogProtect: rogProtect
    }

    this.onImgLoad = this.onImgLoad.bind(this);
    this.triggerPointDirection = this.triggerPointDirection.bind(this);
    this.triggerExtras = this.triggerExtras.bind(this);
    this.canvasKey = 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (typeof nextProps.data.s3_keywords !== 'undefined' && nextProps.data.s3_keywords !== null && nextProps.data.s3_keywords.hasOwnProperty('length')) {
      if (nextProps.data.s3_keywords.length === 0) {
        this.setState({rogProtect: true});
      } else {
        this.setState({rogProtect: false});
      }
    }
    if (this.props.polygonData !== undefined && !isEmpty(this.props.polygonData)) {
      if (nextProps.polygonData !== undefined && !isEmpty(nextProps.polygonData) && this.props.polygonData !== nextProps.polygonData) {
        this.canvasKey++;
      }
      if (nextProps.fetchTriggerSuccess === true && !isEmpty(nextProps.polygonData)) {
        this.setState({canvasMode: true});
        if (this.triggerDetails.currentBaseTriggerUuid !== null) {
          this.setTriggerTimeWindows(nextProps.polygonData, this.triggerDetails.currentBaseTriggerUuid);
        }
      }
      if (this.state.visible && nextProps.createTriggerSuccess !== this.props.createTriggerSuccess && this.triggerDetails['uuid'] !== undefined) {
        this.setState({canvasMode: false});
        this.setState({triggers: true});
        this.setState({deleteButton: false});
        this.props.fetchTriggers(this.props.data.user, this.props.data.cameraGroup, this.triggerDetails['uuid']);
        this.triggerDetails['uuid'] = undefined;
        this.setState({saveCancel: false});
      }
      if (this.state.visible && nextProps.deleteTriggerSuccess !== this.props.deleteTriggerSuccess && this.triggerDetails['uuid'] !== undefined) {
        this.setState({canvasMode: false});
        this.props.fetchTriggers(this.props.data.user, this.props.data.cameraGroup, this.triggerDetails['uuid']);
        this.triggerDetails['uuid'] = undefined;
        this.setState({deleteButton: false});
        this.setState({saveCancel: false});
      }
      if (this.triggerDetails['uuid'] !== undefined) {
        if (nextProps.createTriggerTimeWindowSuccess && nextProps.createTriggerTimeWindowSuccess !== this.props.createTriggerTimeWindowSuccess) {
          message.success('Trigger disarm window created');
        }
        if (nextProps.updateTriggerTimeWindowSuccess && nextProps.updateTriggerTimeWindowSuccess !== this.props.updateTriggerTimeWindowSuccess) {
          message.success('Trigger disarm window updated');
        }
        if (nextProps.deleteTriggerTimeWindowSuccess && nextProps.deleteTriggerTimeWindowSuccess !== this.props.deleteTriggerTimeWindowSuccess) {
          message.success('Trigger disarm window deleted');
        }
      }
    }
    else if (this.props.polygonData !== nextProps.polygonData && !isEmpty(nextProps.polygonData) && !isEmpty(this.props.polygonData)) {
      this.setState({canvasMode: true});
    }
    if (nextProps.data.cameraGroup.userCameraGroupPrivileges !== 'undefined') {
      for (var i = 0; i < nextProps.data.cameraGroup.userCameraGroupPrivileges.length; i++) {
        if (nextProps.data.cameraGroup.userCameraGroupPrivileges[i].users_uuid === nextProps.data.user.uuid) {
          if (nextProps.data.cameraGroup.userCameraGroupPrivileges[i].user_camera_group_privilege_ids.includes(0)) {
            this.setState({cameraGroupOwner: true});
          }
        }
      }
      for (var i = 0; i < nextProps.data.cameraGroup.cameras.length; i++) {
        if (nextProps.data.uuid == nextProps.data.cameraGroup.cameras[i].uuid) {
          this.setState({image: nextProps.data.cameraGroup.cameras[i].thumbnail_url+'?auth='+ this.props.data.user.jwt});
        }
      }
    }
  }

  triggerDetails = {
    polygonPoints: [],
    currentBaseTriggerUuid: null,
    currentBaseTriggerType: '',
    currentBaseTriggerDirection: '',
    currentBaseTriggerTargetType: null,
    currentBaseTriggerDuration: null,
    currentBaseTriggerVertices: null,
    currentTriggerShared: null,
    currentTriggerUsersUuid: null,
    currentTriggerCamerasUuid: null
  };

  resetTriggerDetails = () => {
    this.triggerDetails = {
      polygonPoints: [],
      currentBaseTriggerUuid: null,
      currentBaseTriggerType: '',
      currentBaseTriggerDirection: '',
      currentBaseTriggerTargetType: null,
      currentBaseTriggerDuration: null,
      currentBaseTriggerVertices: null,
      currentTriggerShared: null,
      currentTriggerUsersUuid: null,
      currentTriggerCamerasUuid: null
    };
  }

  sliderValue = (value) => {
    this.setState({
      loiteringSeconds: value,
    });
  }

  triggerExtras(trigger) {
    this.triggerDetails.currentBaseTriggerUuid = trigger.base_trigger.uuid;
    this.triggerDetails.currentBaseTriggerType = trigger.base_trigger.trigger_type;
    this.triggerDetails.currentBaseTriggerDirection = trigger.base_trigger.direction;
    this.triggerDetails.currentBaseTriggerTargetType = trigger.base_trigger.target_type;
    this.triggerDetails.currentBaseTriggerDuration = trigger.base_trigger.trigger_duration;
    this.triggerDetails.currentBaseTriggerVertices = trigger.base_trigger.vertices;
    this.triggerDetails.currentTriggerShared = trigger.shared;
    this.triggerDetails.currentTriggerUsersUuid = trigger.users_uuid;
    this.triggerDetails.currentTriggerCamerasUuid = trigger.cameras_uuid;
    this.form.setFieldsValue({sharedTrigger: trigger.shared});
    this.setState({currentTriggerShared: trigger.shared});
    this.setState({currentTriggerSharedDisabled: true});
    this.setState({loiteringSeconds: trigger.base_trigger.trigger_duration});
    this.setState({deleteButton: true});
  }

  triggerPointDirection(points, direction) {
    this.triggerDetails.polygonPoints.push(points);
    switch (direction) {
      case 'right':
        direction = 'R';
        break;
      case 'left':
        direction = 'L';
        break;
      case 'rightLeft':
        direction = 'B';
        break;
    }

    this.triggerDetails.currentBaseTriggerDirection = direction;
  }

  onImgLoad({target: img}) {
    this.setState({
      imageDimensions: {
        height: img.offsetHeight,
        width: img.offsetWidth
      }
    });
  }

  handleImgLoadFail = () => {
    this.setState({image: noImage});
  }

  showModal = () => {
    if (typeof window.orientation !== 'undefined') {
      trigger('Sorry, trigger creation not currently supported on mobile devices.');
    } else {
      this.setState({visible: true});
      this.triggerDetails['uuid'] = this.props.data.uuid;
      this.setState({saveCancel: false});
      this.setState({canvasMode: false});
      this.setState({currentTriggerShared: null});
      this.setState({currentTriggerSharedDisabled: false});
      this.setState({sharedTriggerSilenceWindowDisabled: false});
      this.resetTriggerDetails;
      this.fetchTriggers(true);
    }
  };

  handleCancel = () => {
    this.setState({canvasMode: false});
    this.setState({visible: false});
    this.setState({cameraWideDisabled: false});
    this.setState({cameraWide: false});
    this.resetTriggerDetails;
  };

  handleVisibleChange = (visibility) => {
    if (visibility === true) {
      this.resetTriggerDetails;
      this.setState({visibility});
      this.setState({canvasMode: false});
      this.setState({triggers: false});
      this.setState({deleteButton: false});
      this.setState({currentTriggerShared: null});
      this.setState({currentTriggerSharedDisabled: false});
      this.form.resetFields(['sharedTrigger', 'sharedTriggerSilenceWindow', 'start_at', 'end_at', 'days_of_week']);
      this.setState({cameraWide: false});
    } else {
      this.resetTriggerDetails;
      this.setState({deleteButton: false});
      this.setState({visibility});
      this.setState({canvasMode: false});
      this.setState({triggers: true});
      this.setState({cameraGroupOwner: false});
      this.setState({cameraWideDisabled: false});
      this.setState({cameraWide: false});
      this.setState({currentTriggerShared: null});
      this.setState({currentTriggerSharedDisabled: false});
      this.form.resetFields(['sharedTrigger', 'sharedTriggerSilenceWindow', 'start_at', 'end_at', 'days_of_week']);
      this.setState({cameraWide: false});
      this.handleSaveCancel('cancel');
    }
  };

  showTrigger = (event) => {
    switch (event) {
      case 'RA':
        this.setState({canvasMode: true});
        this.setState({visibility: !this.state.visibility});
        this.setState({saveCancel: !this.state.saveCancel});
        this.setState({triggerType: 'RA'});
        this.triggerDetails.currentBaseTriggerType = 'RA';
        this.triggerDetails.currentTriggerShared = null;
        this.setState({currentTriggerShared: null});
        this.setState({currentTriggerSharedDisabled: false});
        this.form.resetFields(['sharedTrigger', 'sharedTriggerSilenceWindow', 'start_at', 'end_at', 'days_of_week']);
        this.setState({cameraWide: false});
        break;

      case 'LD':
        this.setState({canvasMode: true});
        this.setState({visibility: !this.state.visibility});
        this.setState({saveCancel: !this.state.saveCancel});
        this.triggerDetails.currentBaseTriggerType = 'LD';
        this.setState({triggerType: 'LD'});
        this.setState({newLoiteringTrigger: true});
        this.setState({loiteringSeconds: 0});
        this.triggerDetails.currentTriggerShared = null;
        this.setState({currentTriggerShared: null});
        this.setState({currentTriggerSharedDisabled: false});
        this.form.resetFields(['sharedTrigger', 'sharedTriggerSilenceWindow', 'start_at', 'end_at']);
        this.setState({cameraWide: false});
        break;

      case 'VW':
        this.setState({canvasMode: true});
        this.setState({visibility: !this.state.visibility});
        this.setState({saveCancel: !this.state.saveCancel});
        this.triggerDetails.currentBaseTriggerType = 'VW';
        this.setState({triggerType: 'VW'});
        this.triggerDetails.currentTriggerShared = null;
        this.setState({currentTriggerShared: null});
        this.setState({currentTriggerSharedDisabled: false});
        this.form.resetFields(['sharedTrigger', 'sharedTriggerSilenceWindow', 'start_at', 'end_at', 'days_of_week']);
        this.setState({cameraWide: false});
        break;

    }
  };

  handleSaveCancel = (event) => {
    if (event === 'cancel') {
      this.triggerDetails['uuid'] = this.props.data.uuid;
      this.setState({saveCancel: false});
      this.setState({canvasMode: false});
    }
    if (event === 'save') {
      if (this.triggerDetails.polygonPoints.length !== 0) {
        this.triggerDetails['uuid'] = this.props.data.uuid;
        this.form.validateFields().then(values => {
          delete values.start_at;
          delete values.end_at;
          delete values.days_of_week;
          delete values.time_window_select;
          delete values.camera_wide;
          delete values.sharedTriggerSilenceWindow;
          values.trigger_windows = [];
          this.props.triggerTimeWindows.forEach(function(trigger_window, index) {
            if (trigger_window.hasOwnProperty('start_at') && trigger_window.hasOwnProperty('end_at') && trigger_window.hasOwnProperty('days_of_week')) {
              if (!isEmpty(trigger_window.start_at) && !isEmpty(trigger_window.end_at) && !isEmpty(trigger_window.days_of_week)) {
                if (typeof trigger_window.shared === 'undefined') {
                  trigger_window.shared = false;
                }
                values.trigger_windows.push(trigger_window);
              } else {
                message.error("There can be no blank fields in a trigger disarm window. Trigger added without disarm window: "+(index + 1), 10);
              }
            }
          });
          
          switch (this.state.triggerType) {
            case 'RA':
              this.props.createTrigger(this.props.data.user, this.triggerDetails.polygonPoints[this.triggerDetails.polygonPoints.length - 1], this.state.triggerType, this.props.data.cameraGroup, this.triggerDetails['uuid'], null, null, values.trigger_windows, values.sharedTrigger);
              break;

            case 'LD':
              this.props.createTrigger(this.props.data.user, this.triggerDetails.polygonPoints[this.triggerDetails.polygonPoints.length - 1], this.state.triggerType, this.props.data.cameraGroup, this.triggerDetails['uuid'], this.state.loiteringSeconds, null, values.trigger_windows, values.sharedTrigger);
              this.setState({loiteringSeconds: 0});
              break;

            case 'VW':
              this.props.createTrigger(this.props.data.user, this.triggerDetails.polygonPoints[this.triggerDetails.polygonPoints.length - 1], this.state.triggerType, this.props.data.cameraGroup, this.triggerDetails['uuid'], null, this.triggerDetails.currentBaseTriggerDirection, values.trigger_windows, values.sharedTrigger);
              break;
          }
        }).catch(err => {
          return message.error(err, 10);
        }).finally(() => {
          this.setState({saveCancel: false});
          this.setState({canvasMode: false});
          this.setState({newLoiteringTrigger: false});
        });
      } else {
        message.error('please draw a trigger to save', 10);
      }
    }
    this.resetTriggerDetails;
    this.fetchTriggers(true);
  };

  fetchTriggers = (checked) => {
    if (checked === true) {
      this.setState({triggers: true});
      this.setState({deleteButton: false});
      this.setState({canvasMode: false});
      this.props.fetchTriggers(this.props.data.user, this.props.data.cameraGroup, this.triggerDetails['uuid']);
    } else {
      this.setState({canvasMode: false});
      this.setState({triggers: false});
      this.setState({deleteButton: false});
    }
  };

  deleteTrigger = () => {
    if (this.triggerDetails.currentBaseTriggerUuid !== 0 && this.triggerDetails.currentBaseTriggerType !== '') {
      this.triggerDetails['uuid'] = this.props.data.uuid;
      this.props.deleteTrigger(this.props.data.user, this.props.data.camera_groups_uuid, this.triggerDetails['uuid'], this.triggerDetails.currentBaseTriggerUuid);
      this.resetTriggerDetails;
      this.setState({currentTriggerShared: null});
      this.setState({currentTriggerSharedDisabled: false});
      this.form.resetFields(['sharedTrigger', 'sharedTriggerSilenceWindow', 'start_at', 'end_at', 'days_of_week']);
      this.setState({cameraWide: false});
    }
  };

  formatNumberLength = (num, length) => {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
  }

  convertToMilitaryFormat = (time) => {
    time = parseInt(time);
    if ((isNaN(time)) || (time === undefined)) {
      return '00:00';
    } else {
      let minutes = moment.duration(time, 'seconds').minutes();
      let seconds = moment.duration(time, 'seconds').seconds();
      let format = this.formatNumberLength(minutes, 2) + ':' + this.formatNumberLength(seconds, 2);

      return format;
    }
  }

  handleChangeTimeWindow = (fieldValue) => {
    let triggerTimeWindow = this.props.triggerTimeWindows[fieldValue];
    if (typeof triggerTimeWindow !== 'undefined'){
      this.form.setFieldsValue({time_window_select: fieldValue});
      let start_at = triggerTimeWindow.start_at;
      let end_at = triggerTimeWindow.end_at;
      let camera_wide = triggerTimeWindow.camera_wide;
      if (start_at !== null) {
        start_at = moment(start_at, "HH:mm");
      }
      if (end_at !== null) {
        end_at = moment(end_at, "HH:mm");
      }
      if (camera_wide) {
        this.setState({cameraWide: true});
        this.setState({cameraWideDisabled: true});
      } else {
        this.setState({cameraWide: false});
        this.setState({cameraWideDisabled: false});
      }
      this.form.setFieldsValue({days_of_week: triggerTimeWindow.days_of_week});
      this.form.setFieldsValue({start_at: start_at});
      this.form.setFieldsValue({end_at: end_at});
      this.form.setFieldsValue({sharedTriggerSilenceWindow: triggerTimeWindow.shared});
      this.setState({sharedTriggerSilenceWindowDisabled: triggerTimeWindow.shared});
    }
  }

  handleAddNewTimeWindow = () => {
    this.form.resetFields(['time_window_select', 'days_of_week', 'sharedTriggerSilenceWindow']);
    this.form.setFieldsValue({start_at: null});
    this.form.setFieldsValue({end_at: null});
    this.props.addNewTriggerTimeWindow(this.props.triggerTimeWindows);
    this.forceUpdate();
  }

  handleUpdateStart = (fieldValue) => {
    let timeWindowSelect = this.form.getFieldValue('time_window_select');
    if (typeof timeWindowSelect !== 'undefined') {
      let endTime = this.props.triggerTimeWindows[timeWindowSelect].end_at;
      if (endTime !== null && typeof endTime !== 'undefined') {
        if (moment(endTime, 'HH:mm').isAfter(fieldValue, 'minute')) {
          this.props.updateTimeWindowData(timeWindowSelect, this.props.triggerTimeWindows, moment(fieldValue).format('HH:mm'), 'start_at');
        } else {
          message.error('Please select a time that is before the end time.', 10);
          this.form.resetFields(['start_at']);
        }
      } else {
        this.props.updateTimeWindowData(timeWindowSelect, this.props.triggerTimeWindows, moment(fieldValue).format('HH:mm'), 'start_at');
      }
    }
  }

  handleUpdateStop = (fieldValue) => {
    let timeWindowSelect = this.form.getFieldValue('time_window_select');
    if (typeof timeWindowSelect !== 'undefined') {
      let startTime = this.form.getFieldValue('start_at');
      if (startTime !== null && typeof startTime !== 'undefined') {
        if (moment(startTime, 'HH:mm').isBefore(fieldValue, 'minute')) {
          this.props.updateTimeWindowData(timeWindowSelect, this.props.triggerTimeWindows, moment(fieldValue).format('HH:mm'), 'end_at');
        } else {
          message.error('Please select a time that is after the start time.', 10);
          this.form.resetFields(['end_at']);
        }
      } else {
        message.error('Please select a start time before selecting a stop time.', 10);
        this.form.resetFields(['end_at']);
      }
    }
  }

  handleUpdateDaysOfWeek = (fieldValue) => {
    let timeWindowSelect = this.form.getFieldValue('time_window_select');
    if (typeof timeWindowSelect !== 'undefined') {
      this.props.updateTimeWindowData(timeWindowSelect, this.props.triggerTimeWindows, fieldValue, 'days_of_week');
    }
  }

  handleUpdateTriggerSilenceWindowPermissionsChange = (fieldValue) => {
    let timeWindowSelect = this.form.getFieldValue('time_window_select');
    if (typeof timeWindowSelect !== 'undefined') {
      this.props.updateTimeWindowData(timeWindowSelect, this.props.triggerTimeWindows, fieldValue, 'sharedTriggerSilenceWindow');
    }
  }

  handleToggleCameraWide = (fieldValue) => {
    let timeWindowSelect = this.form.getFieldValue('time_window_select');
    if (typeof timeWindowSelect !== 'undefined') {
      this.props.updateTimeWindowData(timeWindowSelect, this.props.triggerTimeWindows, fieldValue.target.checked, 'camera_wide');
      this.setState({ cameraWide: fieldValue.target.checked });
    } else {
      message.error('Please select a time window first.', 10);
    }
  }

  handleResetData = () => {
    this.form.resetFields(['days_of_week', 'start_at', 'end_at', 'sharedTriggerSilenceWindow']);
    this.setState({cameraWideDisabled: false});
    this.setState({cameraWide: false});
    let timeWindowSelect = this.form.getFieldValue('time_window_select');
    if (typeof timeWindowSelect !== 'undefined') {
      this.props.clearTimeWindowData(timeWindowSelect, this.props.triggerTimeWindows);
    }
  }

  setTriggerTimeWindows = (polygonData, selectedPolygonUuid) => {
    for (var i = 0; i < polygonData.length; i++) {
      if (polygonData[i].uuid == selectedPolygonUuid) {
        this.form.resetFields(['time_window_select', 'days_of_week', 'start_at', 'end_at', 'sharedTriggerSilenceWindow']);
        this.setState({cameraWideDisabled: false});
        this.setState({cameraWide: false});
        this.props.setTriggerSpecificTimeWindows(polygonData[i].time_windows);
      }
    }
  }

  handleSaveData = () => {
    this.form.validateFields().then(values => {
      if (typeof values.time_window_select != 'undefined' && values.start_at != null && values.end_at != null && values.days_of_week != null) {
        let trigger_windows = {};
        trigger_windows.start_at = values.start_at.format('HH:mmZ').toString();
        trigger_windows.end_at = values.end_at.format('HH:mmZ').toString();
        trigger_windows.days_of_week = values.days_of_week;
        trigger_windows.shared = (typeof values.sharedTriggerSilenceWindow === 'undefined') ? false : values.sharedTriggerSilenceWindow;
        trigger_windows.camera_wide = this.state.cameraWide;
        if (values.start_at.isBefore(values.end_at)) {
          if (typeof this.props.triggerTimeWindows[values.time_window_select].uuid === 'undefined') {
            for (var i = 0; i < this.props.data.polygonData.length; i++) {
              let existing_time_windows = []
              for (var x = 0; x < this.props.data.polygonData[i].time_windows.length; x++) {
                if (typeof this.props.data.polygonData[i].time_windows[x].uuid !== 'undefined') {
                  existing_time_windows.push(this.props.data.polygonData[i].time_windows[x]);
                }
              }
              this.props.data.polygonData[i].time_windows = existing_time_windows;
            }
            this.props.createTriggerTimeWindow(this.props.data.user, this.props.data.camera_groups_uuid, this.triggerDetails.uuid, this.triggerDetails.currentBaseTriggerUuid, trigger_windows, this.props.data.polygonData);
            this.form.resetFields(['time_window_select', 'days_of_week', 'sharedTriggerSilenceWindow']);
            this.form.setFieldsValue({start_at: null});
            this.form.setFieldsValue({end_at: null});
            this.setState({cameraWideDisabled: false});
            this.setState({cameraWide: false});
            this.setState({deleteButton: false});
          } else {
            trigger_windows.uuid = this.props.triggerTimeWindows[values.time_window_select].uuid;
            this.props.updateTriggerTimeWindow(this.props.data.user, this.props.data.camera_groups_uuid, this.triggerDetails.uuid, this.triggerDetails.currentBaseTriggerUuid, trigger_windows, this.props.data.polygonData);
            this.form.resetFields(['time_window_select', 'days_of_week', 'sharedTriggerSilenceWindow']);
            this.form.setFieldsValue({start_at: null});
            this.form.setFieldsValue({end_at: null});
            this.setState({cameraWideDisabled: false});
            this.setState({cameraWide: false});
            this.setState({deleteButton: false});
          }
        } else {
          message.error('Please select a stop time that is after the start time.', 10);
          this.form.resetFields(['start_at', 'end_at']);
        }
      } else {
        message.error('Please select the days of week and time period for your disarm window.', 10);
      }
    });
  }

  handleDeleteTriggerTimeWindow = () => {
    this.form.validateFields().then(values => {
      if (typeof values.time_window_select != 'undefined') {
        let trigger_windows = {};
        trigger_windows.uuid = this.props.triggerTimeWindows[values.time_window_select].uuid;
        this.props.deleteTriggerTimeWindow(this.props.data.user, this.props.data.camera_groups_uuid, this.triggerDetails.uuid, this.triggerDetails.currentBaseTriggerUuid, trigger_windows);
        this.handleResetData();
        this.form.resetFields(['time_window_select', 'sharedTriggerSilenceWindow']);
        delete this.props.triggerTimeWindows[values.time_window_select];
        this.props.setTriggerSpecificTimeWindows(this.props.triggerTimeWindows);
        this.setState({deleteButton: false});
      }
    });
  }

  handleCheckForWindow = () => {
    let timeWindowSelect = this.form.getFieldValue('time_window_select');
    let days_of_week = this.form.getFieldValue('days_of_week');
    if (typeof timeWindowSelect == 'undefined') {
      message.error('Please select which Trigger Disarm Window you want to store this in. Your changes will not be saved!', 10);
      this.handleResetData();
    } else if (days_of_week === undefined || days_of_week.length == 0) {
      message.error('Please select the days you would like the trigger time to be active. Your changes will not be saved!', 10);
      this.handleResetData();
    }
  }

  handleCheckShared = (shared) => {
    // TODO: add functionality here to update the trigger in the DB to shared and then share it with the correct users.
    this.triggerDetails.currentTriggerShared = shared;
    this.setState({currentTriggerShared: shared});
  }

  formRef = (form) => {
    this.form = form;
  }

  render() {
    return (
      <div style={styles.form}>
        <Tooltip title='Trigger Settings' placement='bottom'>
          <EyeOutlined onClick={this.showModal}/>
        </Tooltip>
        <AddTriggerForm
          form={this.formRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          error={this.state.error}
          cameraName={this.props.data.name}
          triggerImg={this.state.image}
          visibility={this.state.visibility}
          handleVisibility={this.handleVisibleChange}
          showTrigger={this.showTrigger}
          canvasMode={this.state.canvasMode}
          onImgLoad={this.onImgLoad}
          imageDimensions={this.state.imageDimensions}
          saveCancel={this.state.saveCancel}
          handleSaveCancel={this.handleSaveCancel}
          triggers={this.state.triggers}
          triggerPointDirection={this.triggerPointDirection}
          fetchTriggers={this.fetchTriggers}
          triggerExtras={this.triggerExtras}
          deleteTrigger={this.deleteTrigger}
          deleteButton={this.state.deleteButton}
          triggerInProcess={this.props.createTriggerInProcess}
          deleteStatus={this.props.deleteTriggerInProcess}
          sliderValue={this.sliderValue}
          loiteringSeconds={this.state.loiteringSeconds}
          convertToMilitaryFormat={this.convertToMilitaryFormat}
          currentTriggerDetails={this.triggerDetails}
          direction={this.direction}
          fetchTriggerInProcess={this.props.fetchTriggerInProcess}
          newLoiteringTrigger={this.state.newLoiteringTrigger}
          resetData={this.handleResetData}
          changeTimeWindow={this.handleChangeTimeWindow}
          updateDataStart={this.handleUpdateStart}
          updateDataStop={this.handleUpdateStop}
          checkForWindow={this.handleCheckForWindow}
          updateDataDaysOfWeek={this.handleUpdateDaysOfWeek}
          time_zone={this.state.time_zone}
          saveData={this.handleSaveData}
          timeWindows={this.props.triggerTimeWindows}
          cameraGroupOwner={this.state.cameraGroupOwner}
          selectedTriggerShared={this.state.currentTriggerShared}
          selectedTriggerSharedDisabled={this.state.currentTriggerSharedDisabled}
          addNewTimeWindow={this.handleAddNewTimeWindow}
          getTriggerSpecificTimeWindows={this.getTriggerSpecificTimeWindows}
          setTriggerTimeWindows={this.setTriggerTimeWindows}
          deleteTriggerTimeWindow={this.handleDeleteTriggerTimeWindow}
          cameraWideDisabled={this.state.cameraWideDisabled}
          cameraWide={this.state.cameraWide}
          toggleCameraWide={this.handleToggleCameraWide}
          canvasKey={this.canvasKey}
          sharedTriggerSilenceWindowDisabled={this.state.sharedTriggerSilenceWindowDisabled}
          checkShared={this.handleCheckShared}
          updateTriggerSilenceWindowPermissionsChange={this.handleUpdateTriggerSilenceWindowPermissionsChange}
          imgLoadFail={this.handleImgLoadFail}
          rogProtect={this.state.rogProtect}
        />
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
    float: 'left',
    fontSize: 18
  },
  image: {
    width: '100%',
    float: 'left'
  },
  form: {},
  triggerType: {
    textAlign: 'center'
  },
  saveBtn: {
    color: '#108ee9'
  },
  cancelBtn: {
    color: 'red',
    marginLeft: 2
  },
  triggersHideShow: {
    textAlign: 'center'
  },
  deleteButton: {
    float: 'right',
    color: 'red',
    marginTop: -10
  },
  currenttriggerDetails: {
    float: 'left'
  },
  LDtimeLeft: {
    paddingRight: 5
  },
  LDtimeRight: {
    float: 'left',
    paddingLeft: 5
  },
  borderBox: {
    border: 'solid 1px #bfbfbf'
  },
  dayPicker: {
    width: '80%'
  },
  triggerTimeWindowSelect: {
    width: '80%'
  },
  addNewTimeWindowButton: {
    top: 2
  }
};

const mapStateToProps = (state) => {
  return {
    createTriggerSuccess: state.triggers.createTriggerSuccess,
    createTriggerError: state.triggers.createTriggerError,
    createTriggerInProcess: state.triggers.createTriggerInProcess,
    polygonData: state.triggers.polygonData,
    deleteTriggerSuccess: state.triggers.deleteTriggerSuccess,
    deleteTriggerInProcess: state.triggers.deleteTriggerInProcess,
    fetchTriggerInProcess: state.triggers.fetchTriggerInProcess,
    fetchTriggerSuccess: state.triggers.fetchTriggerSuccess,
    triggerTimeWindows: state.triggers.triggerTimeWindows,
    createTriggerTimeWindowSuccess: state.triggers.createTriggerTimeWindowSuccess,
    createTriggerTimeWindowInProcess: state.triggers.createTriggerTimeWindowInProcess,
    updateTriggerTimeWindowSuccess: state.triggers.updateTriggerTimeWindowSuccess,
    updateTriggerTimeWindowInProcess: state.triggers.updateTriggerTimeWindowInProcess,
    deleteTriggerTimeWindowSuccess: state.triggers.deleteTriggerTimeWindowSuccess,
    deleteTriggerTimeWindowInProcess: state.triggers.deleteTriggerTimeWindowInProcess
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    createTrigger: (user, triggerCoordinates, triggerType, cameraGroupUuid, cameraUuid, triggerDuration, direction, timeWindows, shared) => dispatch(createTrigger(user, triggerCoordinates, triggerType, cameraGroupUuid, cameraUuid, triggerDuration, direction, timeWindows, shared)),
    fetchTriggers: (user, cameraGroup, cameraUuid) => dispatch(fetchTriggers(user, cameraGroup, cameraUuid)),
    deleteTrigger: (user, cameraGroupUuid, cameraUuid, baseTriggersUuid) => dispatch(deleteTrigger(user, cameraGroupUuid, cameraUuid, baseTriggersUuid)),
    updateTimeWindowData: (timeWindowSelect, values, fieldValue, fieldName) => dispatch(updateTimeWindowData(timeWindowSelect, values, fieldValue, fieldName)),
    clearTimeWindowData: (timeWindowSelect, values) => dispatch(clearTimeWindowData(timeWindowSelect, values)),
    setTriggerSpecificTimeWindows: (triggers, triggerUuid) => dispatch(setTriggerSpecificTimeWindows(triggers, triggerUuid)),
    addNewTriggerTimeWindow: (values) => dispatch(addNewTriggerTimeWindow(values)),
    createTriggerTimeWindow: (user, cameraGroupUuid, cameraUuid, triggersUuid, timeWindow, polygonData) => dispatch(createTriggerTimeWindow(user, cameraGroupUuid, cameraUuid, triggersUuid, timeWindow, polygonData)),
    updateTriggerTimeWindow: (user, cameraGroupUuid, cameraUuid, triggersUuid, timeWindow, polygonData) => dispatch(updateTriggerTimeWindow(user, cameraGroupUuid, cameraUuid, triggersUuid, timeWindow, polygonData)),
    deleteTriggerTimeWindow: (user, cameraGroupUuid, cameraUuid, baseTriggersUuid, timeWindow) => dispatch(deleteTriggerTimeWindow(user, cameraGroupUuid, cameraUuid, baseTriggersUuid, timeWindow))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTriggerModal);
