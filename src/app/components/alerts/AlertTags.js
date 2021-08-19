import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tag, Input, Select, Tooltip, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { updateAlertTags } from '../../redux/alerts/actions';
import {isEmpty} from '../../redux/helperFunctions';
import moment from 'moment';

class AlertTags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputVisible: false,
      inputValue: '',
      editInputIndex: -1,
      editInputValue: '',
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.updateAlertTagsError && this.props.updateAlertTagsErrorUuid == this.props.uuid && this.props.updateAlertTagsError !== prevProps.updateAlertTagsError) {
      message.error(this.props.updateAlertTagsError, 10);
    }
  }

  handleClose = removedTag => {
    const tags = Object.keys(this.props.tags).filter(tag => tag !== removedTag);
    tags.push("removed_"+removedTag);
    this.props.updateAlertTags(this.props.user, this.props.uuid, tags, this.props.cameraGroupsTags[this.props.cameraGroupUuid]);
  };

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
    this.props.updateAlertTags(this.props.user, this.props.uuid, tags, this.props.cameraGroupsTags);
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  };

  handleEditInputChange = e => {
    this.setState({ editInputValue: e });
  };

  handleEditInputConfirm = () => {
    this.setState(({ tags, editInputIndex, editInputValue }) => {
      const newTags = [...Object.keys(tags)];
      newTags.push("update_"+newTags[editInputIndex]+"_"+editInputValue);
      newTags[editInputIndex] = editInputValue;
      this.props.updateAlertTags(this.props.user, this.props.uuid, newTags, this.props.cameraGroupsTags[this.props.cameraGroupUuid]);
      return {
        editInputIndex: -1,
        editInputValue: '',
      };
    });
  };

  saveInputRef = input => {
    this.input = input;
  };

  saveEditInputRef = input => {
    this.editInput = input;
  };

  formatTimeWithTimezone = (tag) => {
    const timezone = isEmpty(this.props.userData) ? this.props.user.time_zone : this.props.userData.time_zone;
    let formattedTag = tag;
    if (tag.indexOf('at: ') !== -1) {
      var time_str = tag.substring(tag.indexOf('at: ') + 4, tag.length);
      var converted_time = moment.utc(time_str, "MM/DD/YYYY, HH:mm:ss").tz(timezone).format("MM/DD/YYYY, HH:mm:ss");
      formattedTag = tag.replace(time_str, converted_time);
    }
    return formattedTag;
  };

  render() {
    const { inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    const tags = isEmpty(this.props.tags) ? [] : this.props.tags;
    const tag_options = isEmpty(this.props.cameraGroupsTags[this.props.cameraGroupUuid]) ? ["Clear", "Contacted Police", "Contacted Fire Dept", "Contacted Ambulance"] : this.props.cameraGroupsTags[this.props.cameraGroupUuid];
    return (
      <div>
        {Object.keys(tags).map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Select
                ref={this.saveEditInputRef}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={this.handleEditInputChange}
                onBlur={this.handleEditInputConfirm}
                defaultOpen={true}
                autoFocus={true}
                dropdownMatchSelectWidth={false}
              >
                {tag_options.map(tag_option => (
                  <Select.Option key={tag_option} value={tag_option} title={tag_option}>{tag_option}</Select.Option>
                ))}
              </Select>
            );
          }
          const formattedTag = this.formatTimeWithTimezone(tag);

          const isLongTag = formattedTag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable={tags[tag]}
              onClose={() => this.handleClose(tag)}
            >
              <span
                onDoubleClick={e => {
                  if (tags[tag]) {
                    this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                      this.editInput.focus();
                    });
                    e.preventDefault();
                  }
                }}
              >
                {isLongTag ? `${formattedTag.slice(0, 20)}...` : formattedTag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={formattedTag} key={tag} placement="bottom">
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Select
            ref={this.saveInputRef}
            size="small"
            className="tag-input"
            value={inputValue}
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
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput}>
            <PlusOutlined /> Select Tag
          </Tag>
        )}
      </div>
    );
  }
}

const styles = {}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    userData: state.users.userData,
    updateAlertTagsError: state.alerts.updateAlertTagsError,
    updateAlertTagsErrorUuid: state.alerts.updateAlertTagsErrorUuid,
    updateAlertTagsInProcess: state.alerts.updateAlertTagsInProcess,
    updateAlertTagsInProcessUuid: state.alerts.updateAlertTagsInProcessUuid,
    updateAlertTagsSuccessUuid: state.alerts.updateAlertTagsSuccessUuid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAlertTags: (user, alertUuid, tags, tag_options) => dispatch(updateAlertTags(user, alertUuid, tags, tag_options))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlertTags));
