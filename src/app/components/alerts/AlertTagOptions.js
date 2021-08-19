import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { editCameraGroup } from '../../redux/cameraGroups/actions';
import {isEmpty} from '../../redux/helperFunctions';

class AlertTagOptions extends Component {
  constructor(props){
    super(props);

    this.state={
      tag_options: typeof props.tag_options !== 'undefined' ? props.tag_options : []
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.tag_options !== 'undefined' && this.props.tag_options != nextProps.tag_options){
      this.setState({tag_options: nextProps.tag_options});
    }
  }

  saveInputRef = input => {
    this.input = input;
  };

  saveEditInputRef = input => {
    this.editInput = input;
  };

  render() {
    const { inputVisible, inputValue, editInputIndex, editInputValue, editInputChange, editInputConfirm, editTag, closeTag, inputChange, inputConfirm, showInput } = this.props;
    return (
      <div>
        {this.state.tag_options.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={editInputChange}
                onBlur={editInputConfirm}
                onPressEnter={editInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable={true}
              onClose={() => closeTag(tag)}
            >
              <span
                onDoubleClick={editTag}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            className="tag-input"
            value={inputValue}
            onChange={inputChange}
            onBlur={inputConfirm}
            onPressEnter={inputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={showInput}>
            <PlusOutlined /> New Tag
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
    editCameraGroupInProcess: state.cameraGroups.editCameraGroupInProcess,
    editCameraGroupError: state.cameraGroups.editCameraGroupError,
    editCameraGroupSuccess: state.cameraGroups.editCameraGroupSuccess
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editCameraGroup: (user, cameraGroup, cameraGroupData) => dispatch(editCameraGroup(user, cameraGroup, cameraGroupData))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlertTagOptions));
