import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, Switch } from 'antd';
import { NodeExpandOutlined, NodeCollapseOutlined } from '@ant-design/icons';
import { readAllIntegrationTemplates } from '../../redux/cameras/actions';
import {isEmpty} from '../../redux/helperFunctions';

const { Option } = Select;

class ExternalIntegration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      integrationActive: false,
      integrationList: null,
      selectedIntegrationTemplate: null,
      integrationTemplateFields: null,
      resetFields: false,
      externalIntegrationData: typeof props.externalIntegrationData === 'undefined' ? null : props.externalIntegrationData,
    };
    if (!isEmpty(this.state.externalIntegrationData)) {
      this.state['integrationActive'] = true;
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    let nextState = {...prevState}
    if (nextProps.integrationList !== prevState.integrationList) {
      nextState['integrationList'] = nextProps.integrationList;
    }
    if (typeof nextProps.externalIntegrationData !== 'undefined' && nextProps.externalIntegrationData !== prevState.externalIntegrationData) {
      nextState['externalIntegrationData'] = nextProps.externalIntegrationData;
    }
    if (nextProps.resetFields === true && isEmpty(nextProps.externalIntegrationData)) {
      nextState['integrationActive'] = false;
      nextState['integrationList'] = null;
      nextState['selectedIntegrationTemplate'] = null;
      nextState['integrationTemplateFields'] = null;
      nextState['externalIntegrationData'] = null;
      nextProps.fieldsReset();
    }
    return nextState
  }

  handleToggleIntegration = (fieldValue) => {
    if (fieldValue === true) {
      this.props.readAllIntegrationTemplates(this.props.user);
    } else {
      this.setState({
        selectedIntegrationTemplate: null,
        integrationTemplateFields: null
      });
    }
    this.setState({integrationActive: fieldValue});
  }

  handleUpdateIntegrationTemplate = (fieldValue) => {
    for (var i = 0; i < this.state.integrationList.length; i++) {
      if (this.state.integrationList[i].uuid === fieldValue) {
        let templateFields = JSON.parse(this.state.integrationList[i]['template']);
        for (var key in templateFields) {
          if (templateFields.hasOwnProperty(key)) {
            let field = {};
            field[key] = templateFields[key];
            this.props.setFormFieldsValue(field);
          }
        }
        this.setState({
          selectedIntegrationTemplate: fieldValue,
          integrationTemplateFields: this.state.integrationList[i]
        });
        break;
      }
    }
  }

  handleLoadTemplateFields = (integrationTemplateFields) => {
    let domTemplate = [];
    let templateFields = null;
    if (integrationTemplateFields.hasOwnProperty('template')) {
      templateFields = JSON.parse(integrationTemplateFields['template']);
    } else {
      templateFields = integrationTemplateFields;
    }
    if (!isEmpty(templateFields)) {
      for (var key in templateFields) {
        if (templateFields.hasOwnProperty(key) && key !== 'external_stream') {
          domTemplate.push(
            <div key={this.guid()} id={key}>
              <p key={this.guid()} style={{margin: '0 auto', marginBottom: 14, marginTop: -10}}>{key}:</p>
              <Form.Item key={this.guid()} name={key} initialValue={templateFields[key]}>
                <Input key={this.guid()} placeholder={key} disabled={this.props.disabled} />
              </Form.Item>
            </div>
          );
        }
      }
      domTemplate.push(
        <Form.Item key={this.guid()} name="external_stream" initialValue={integrationTemplateFields['external_stream']} hidden={true}>
          <Input key={this.guid()} hidden={true} />
        </Form.Item>
      )
    }
    return domTemplate;
  }

  guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  render() {
    let domRender = [];
    domRender.push(
      <Form.Item key={this.guid()} name="external_integration" label="External Integration" style={{width: 215, textAlign: 'right', margin: '0 auto', marginBottom: 14}}>
        <Switch key={this.guid()} onChange={this.handleToggleIntegration} checkedChildren={<NodeExpandOutlined />} unCheckedChildren={<NodeCollapseOutlined />} checked={this.state.integrationActive} disabled={this.props.disabled}></Switch>
      </Form.Item>
    );
    if (this.state.integrationActive) {
      if (isEmpty(this.state.externalIntegrationData)) {
        domRender.push(
          <Form.Item key={this.guid()} name="integration_template">
            <Select key={this.guid()} onChange={this.handleUpdateIntegrationTemplate} placeholder="Select Template" disabled={this.props.disabled}>
              {this.state.integrationList.map((values) => (
                <Option key={values.uuid} value={values.uuid}>{values.name}</Option>
              ))}
            </Select>
          </Form.Item>
        );
      }
      if (!isEmpty(this.state.externalIntegrationData)) {
        domRender.push(this.handleLoadTemplateFields(this.state.externalIntegrationData));
      } else if (!isEmpty(this.state.integrationTemplateFields)) {
        domRender.push(this.handleLoadTemplateFields(this.state.integrationTemplateFields));
      }
    }
    return(
      <div>
        {domRender}
      </div>
    );
  }
}

const styles = {
  error: {
    color: 'red'
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    integrationList: state.cameras.integrationList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    readAllIntegrationTemplates: (user) => dispatch(readAllIntegrationTemplates(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExternalIntegration);
