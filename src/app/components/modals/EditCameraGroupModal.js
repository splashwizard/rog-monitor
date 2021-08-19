import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Input, Button, Popconfirm, message, Switch } from 'antd';
import { EnvironmentOutlined, DeleteOutlined, DisconnectOutlined, LinkOutlined, SafetyOutlined, HomeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import CustomInput from '../../components/formitems/CustomInput';
import { enableCameraGroup, disableCameraGroup, removeCameraGroup, editCameraGroup } from '../../redux/cameraGroups/actions';
import AlertTagOptions from '../alerts/AlertTagOptions';

const FormItem = Form.Item;
const EditCameraGroupForm = ({onCancel, visible, onCreate, removeCameraGroup, form, cameraGroup, cameraGroupName, editCameraGroupInProcess, editCameraGroupSuccess, removeCameraGroupInProcess, removeCameraGroupSuccess, user, enableCameraGroup, disableCameraGroup, enableCameraGroupInProcess, disableCameraGroupInProcess, cameraGroupAwayMode, toggleCameraGroupAwayMode, cameraGroupArmed, toggleCameraGroupArmed, tag_options, editInputConfirm, editInputChange, inputChange, inputConfirm, closeTag, inputValue, editInputIndex, editInputValue, inputVisible, editTag, showInput}) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 16 },
    },
  };
  return (
    <Modal title={`Edit ${cameraGroupName}`}
           visible={visible}
           style={styles.modal}
           onCancel={onCancel}
           onOk={onCreate}
           okText='Save'
           cancelText='Cancel'
    >
      <Form
        initialValues={{
          name: cameraGroupName
        }}
        ref={form}
      >
        <Form.Item label="Away Mode" name="away_mode" {...formItemLayout}>
          <Switch
            checkedChildren={<SafetyOutlined />}
            unCheckedChildren={<HomeOutlined />}
            onChange={toggleCameraGroupAwayMode}
            checked={cameraGroupAwayMode}
            disabled={!cameraGroupArmed}
          />
        </Form.Item>
        <Form.Item label="Armed" name="armed" {...formItemLayout}>
          <Switch
            checkedChildren={<LockOutlined />}
            unCheckedChildren={<UnlockOutlined />}
            onChange={toggleCameraGroupArmed}
            checked={cameraGroupArmed}
          />
        </Form.Item>
        <FormItem label='Name' name="name" {...formItemLayout}>
          <Input
            style={styles.input}
            placeholder="CameraGroup Name"
          />
        </FormItem>
        <FormItem label="Connect" name="connect" {...formItemLayout}>
          <Button type="primary" icon={<LinkOutlined />} loading={enableCameraGroupInProcess} disabled={enableCameraGroupInProcess} style={{backgroundColor: "#1890ff", width: 197}} onClick={()=>enableCameraGroup(user, cameraGroup)}>Connect Camera Group</Button>
        </FormItem>
        <FormItem label="Disconnect" name="disconnect" {...formItemLayout}>
          <Popconfirm title={<p>Are you sure you want to disconnect this camera group? <br /> <font color='orange'>WARNING: This will disconnect the ROG Security system</font></p>} onConfirm={()=>disableCameraGroup(user, cameraGroup)} okText="Disconnect" cancelText="Nevermind">
            <Button type="primary" icon={<DisconnectOutlined />} loading={disableCameraGroupInProcess} disabled={disableCameraGroupInProcess}>Disconnect Camera Group</Button>
          </Popconfirm>
        </FormItem>
        <FormItem label="Remove" name="remove" {...formItemLayout}>
          <Popconfirm title="Are you sure you want to remove this cameraGroup? This action cannot be undone." onConfirm={removeCameraGroup} okText="Yes, remove cameraGroup" cancelText="Nevermind">
            <Button type="danger" icon={<DeleteOutlined />} loading={removeCameraGroupInProcess} disabled={removeCameraGroupInProcess}>Remove Camera Group</Button>
          </Popconfirm>
        </FormItem>
        <FormItem label="Alert Tag Options" name="tag_options" {...formItemLayout}>
          <AlertTagOptions cameraGroup={cameraGroup} tag_options={tag_options} editInputChange={editInputChange} editInputConfirm={editInputConfirm} inputChange={inputChange} inputConfirm={inputConfirm} closeTag={closeTag} inputValue={inputValue} editInputIndex={editInputIndex} editInputValue={editInputValue} inputVisible={inputVisible} editTag={editTag} showInput={showInput} />
        </FormItem>
      </Form>
    </Modal>
  );
};

class EditCameraGroupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      error: false,
      away_mode: props.selectedCameraGroup.away_mode,
      armed: props.selectedCameraGroup.armed,
      tag_options: props.selectedCameraGroup.tag_options,
      inputVisible: false,
      inputValue: '',
      editInputIndex: -1,
      editInputValue: '',
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.editCameraGroupError && this.props.editCameraGroupError !== nextProps.editCameraGroupError) {
      message.error(nextProps.editCameraGroupError, 10);
    }

    if (nextProps.removeCameraGroupError && this.props.removeCameraGroupError !== nextProps.removeCameraGroupError) {
      message.error(nextProps.removeCameraGroupError, 10);
    }
  };

  showModal = () => {
    this.setState({visible: true});
  };

  handleCancel = () => {
    this.setState({visible: false});
  };

  handleCreate = (e) => {
    const form = this.form;
    form.validateFields().then(values => {
      let settings = {name: values.name};
      if (this.state.armed !== this.props.selectedCameraGroup.armed) {
        settings.armed = this.state.armed;
      }
      if (this.state.away_mode !== this.props.selectedCameraGroup.away_mode) {
        settings.away_mode = this.state.away_mode;
      }
      if (this.state.tag_options !== this.props.selectedCameraGroup.tag_options) {
        settings.tag_options = this.state.tag_options;
      }
      this.props.editCameraGroup(this.props.user, this.props.selectedCameraGroup, settings);
    });
  };

  handleDelete = (e) => {
    this.props.removeCameraGroup(this.props.user, this.props.selectedCameraGroup);
  };

  handleToggleCameraGroupAwayMode = (fieldValue) => {
    this.setState({away_mode: fieldValue});
  }

  handleToggleCameraGroupArmed = (fieldValue) => {
    if (fieldValue == false) {
      this.setState({away_mode: false});
    }
    this.setState({armed: fieldValue});
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => document.getElementsByClassName('tag-input')[0].focus());
  };

  handleCloseTag = removedTag => {
    const tag_options = this.state.tag_options.filter(tag => tag !== removedTag);
    this.setState({ tag_options });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tag_options } = this.state;
    if (inputValue && tag_options.indexOf(inputValue) === -1) {
      tag_options = [...tag_options, inputValue];
    }
    this.setState({
      tag_options,
      inputVisible: false,
      inputValue: '',
    });
  };

  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    this.setState(({ tag_options, editInputIndex, editInputValue }) => {
      const newTags = [...tag_options];
      newTags[editInputIndex] = editInputValue;
      return {
        tag_options: newTags,
        editInputIndex: -1,
        editInputValue: '',
      };
    });
  };

  handleEditTag = e => {
    this.setState({ editInputIndex: index, editInputValue: tag }, () => {
      this.editInput.focus();
    });
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <div onClick={this.showModal}>
          <EnvironmentOutlined onClick={this.showModal} />
          &nbsp;
          CameraGroup Settings
        </div>
        <EditCameraGroupForm
          form={(form) => this.form = form}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          removeCameraGroup={this.handleDelete}
          error={this.state.error}
          user={this.props.user}
          cameraGroup={this.props.selectedCameraGroup}
          cameraGroupName={this.props.selectedCameraGroup.name}
          cameraGroupAwayMode={this.state.away_mode}
          cameraGroupArmed={this.state.armed}
          toggleCameraGroupArmed={this.handleToggleCameraGroupArmed}
          toggleCameraGroupAwayMode={this.handleToggleCameraGroupAwayMode}
          editCameraGroupInProcess={this.props.editCameraGroupInProcess}
          editCameraGroupSuccess={this.props.editCameraGroupSuccess}
          removeCameraGroupInProcess={this.props.removeCameraGroupInProcess}
          removeCameraGroupSuccess={this.props.removeCameraGroupSuccess}
          enableCameraGroup={this.props.enableCameraGroup}
          disableCameraGroup={this.props.disableCameraGroup}
          enableCameraGroupInProcess={this.props.enableCameraGroupInProcess}
          disableCameraGroupInProcess={this.props.disableCameraGroupInProcess}
          tag_options={this.state.tag_options}
          editInputConfirm={this.handleEditInputConfirm}
          editInputChange={this.handleEditInputChange}
          inputConfirm={this.handleInputConfirm}
          inputChange={this.handleInputChange}
          closeTag={this.handleCloseTag}
          inputValue={this.state.inputValue}
          editInputIndex={this.state.editInputIndex}
          editInputValue={this.state.editInputValue}
          inputVisible={this.state.inputVisible}
          editTag={this.handleEditTag}
          showInput={this.showInput}
        />
      </div>
    );
  }
}

const styles = {
  modal: {
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center'
  },
  image: {
    width: '50%'
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    editCameraGroupInProcess: state.cameraGroups.editCameraGroupInProcess,
    editCameraGroupError: state.cameraGroups.editCameraGroupError,
    editCameraGroupSuccess: state.cameraGroups.editCameraGroupSuccess,
    removeCameraGroupInProcess: state.cameraGroups.removeCameraGroupInProcess,
    removeCameraGroupError: state.cameraGroups.removeCameraGroupError,
    removeCameraGroupSuccess: state.cameraGroups.removeCameraGroupSuccess,
    enableCameraGroupInProcess: state.cameraGroups.enableCameraGroupInProcess,
    disableCameraGroupInProcess: state.cameraGroups.disableCameraGroupInProcess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editCameraGroup: (user, cameraGroup, cameraGroupData) => dispatch(editCameraGroup(user, cameraGroup, cameraGroupData)),
    removeCameraGroup: (user, cameraGroup) => dispatch(removeCameraGroup(user, cameraGroup)),
    enableCameraGroup: (user, cameraGroup) => dispatch(enableCameraGroup(user, cameraGroup)),
    disableCameraGroup: (user, cameraGroup) => dispatch(disableCameraGroup(user, cameraGroup))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCameraGroupModal);
