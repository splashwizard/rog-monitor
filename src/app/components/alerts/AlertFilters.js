import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, DatePicker, Select, Form, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import * as alertActions from '../../redux/alerts/actions';
import moment from 'moment-timezone';

const { RangePicker } = DatePicker;

const rangeConfig = {
  rules: [
    {
      type: 'array',
      required: true,
      message: 'Please select a time!'
    },
  ],
};

class AlertFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  handleCreateSelectItems = () => {
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

  handleUpdateTimeZone = (fieldValue) => {
    this.setState({time_zone: fieldValue});
  }

  render() {
    switch (this.props.selectedFilterType) {
      case 0:
        return (
          <Form.Item
            hasFeedback
            name="filter_parameter"
            rules={[
              {required: true, message: "This field is required"}
            ]}
          >
            <Select style={{width: 250}} placeholder="select a camera">
              {this.props.cameraGroups.map(cameraGroup => (
                cameraGroup.hasOwnProperty('cameras') ?
                cameraGroup.cameras.map(camera => (
                  <Select.Option key={`camera-${camera.id}`} value={camera.name}>{camera.name}</Select.Option>
                )) : ''
              ))}
            </Select>
          </Form.Item>
        )
        break;
      case 1:
        return (
          <Form.Item
            hasFeedback
            name="filter_parameter"
            rules={[
              {required: true, message: "This field is required"}
            ]}
          >
            <Select style={{width: 250}} placeholder="select a camera group">
              {this.props.cameraGroups.map(cameraGroup => (
                <Select.Option key={`cameragroup-${cameraGroup.id}`} value={cameraGroup.name}>{cameraGroup.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )
        break;
      case 2:
        return (
          <Form.Item
            hasFeedback
            name="filter_parameter"
            rules={[
              {required: true, message: "This field is required"}
            ]}
          >
            <Select
              placeholder="Select Trigger Type"
              allowClear={false}
              dropdownMatchSelectWidth={true}
              style={{ width: 150 }}
            >
              <Select.Option value="RA">Restricted Area</Select.Option>
              <Select.Option value="VW">Virtual Wall</Select.Option>
              <Select.Option value="LD">Loitering Detection</Select.Option>
            </Select>
          </Form.Item>
        )
        break;
      case 3:
        return (
          <div>
            <Form.Item
              {...rangeConfig}
              hasFeedback
              name="filter_parameter"
              rules={[
                {required: true, message: "This field is required"}
              ]}
              style={{display: 'inline-block', width: 346}}
            >
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                ranges={{
                  Today: [moment().tz('UTC').startOf('day'), moment().tz('UTC').endOf('day')],
                  'This Week': [moment().tz('UTC').startOf('week'), moment().tz('UTC').endOf('week')],
                  'This Month': [moment().tz('UTC').startOf('month'), moment().tz('UTC').endOf('month')],
                  'This Year': [moment().tz('UTC').startOf('year'), moment().tz('UTC').endOf('year')]
                }}
              />
            </Form.Item>
            <Form.Item
              name="time_zone"
              rules={[{required: false, message: 'Please enter your time zone'}]}
              hasFeedback
              style={{display: 'inline-block', width: 171}}
            >
              <Select
                showSearch
                placeholder="Select Time Zone"
                optionFilterProp="children"
                onChange={this.handleUpdateTimeZone}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {this.handleCreateSelectItems()}
              </Select>
            </Form.Item>
          </div>
        )
        break;
      default:
        return (
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Most Recent Alerts
            </ Button>
          </Form.Item>
        )
    }
  }
}

const styles = {};

const mapStateToProps = (state) => {
  return {
    cameraGroups: state.cameraGroups.cameraGroups,
    selectedFilterType: state.alerts.selectedFilterType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(alertActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertFilters);
