import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, Pagination, Select, Menu, Form } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';
import AlertCard from '../components/alerts/AlertCard';
import AlertFilters from '../components/alerts/AlertFilters';
import * as alertActions from '../redux/alerts/actions';
import { fetchCameraGroups } from '../redux/cameraGroups/actions';
import {isEmpty} from '../redux/helperFunctions';

const AlertSortingForm = ({AlertFilterChange, FilterTypeChange, ComponentProperties, selectedFilterType, form, time_zone}) => {
  return (
    <Form
      layout="inline"
      onFinish={AlertFilterChange}
      style={styles.formstyles}
      initialValues={{filter_type: selectedFilterType}}
      ref={form}
    >
      <Form.Item
        name="filter_type"
        rules={[{required: true, message: "This field is required"}]}
        hasFeedback
      >
        <Select
          placeholder="Select Filter Type"
          allowClear={false}
          dropdownMatchSelectWidth={true}
          style={{ width: 185 }}
          onChange={FilterTypeChange}
        >
          <Select.Option value={0}>Camera Name</Select.Option>
          <Select.Option value={1}>Camera Group Name</Select.Option>
          <Select.Option value={2}>Trigger Type</Select.Option>
          <Select.Option value={3}>Date/Time Range</Select.Option>
          <Select.Option value={4}>Most Recent</Select.Option>
        </Select>
      </Form.Item>
      <AlertFilters
        data={ComponentProperties}
        time_zone={time_zone}
      />
      {selectedFilterType !== 4 &&
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      }
    </Form>
  );
};

class Alerts extends Component {
  constructor(props) {
    super(props);

    props.actions.fetchAlerts(props.user);
    props.actions.markUserAlertsViewed(props.user);
    props.actions.countNewAlerts(props.user);
    if (props.cameraGroups.length == 0){
      props.fetchCameraGroups(props.user);
    }
    

    this.state = {
      videoSource: null,
      open: true,
      time_zone: typeof props.updatedTimeZone !== 'undefined' ? props.updatedTimeZone : props.timeZone
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (!isEmpty(nextProps.updatedTimeZone) && nextProps.timeZone !== nextProps.updatedTimeZone) {
      this.setState({time_zone: nextProps.updatedTimeZone});
      if (typeof this.form !== 'undefined') {
        this.form.setFieldsValue({time_zone: nextProps.updatedTimeZone});
      }
    }
  }

  clearAlerts = () => {
    this.props.actions.clearAlerts();
    this.props.alerts.forEach(alert => {
      this.props.actions.deleteAlert(this.props.user, alert.id);
    });
    this.props.actions.countNewAlerts(this.props.user);
  }

  handlePaginationChange = (page, pageSize) => {
    if (this.props.selectedFilterType === 3) {
      var dateTimes = [];
      if (isEmpty(this.form.getFieldsValue()['time_zone'])) {
        dateTimes[0] = this.form.getFieldsValue()['filter_parameter'][0].clone().format('YYYY-MM-DD HH:mm:ss');
        dateTimes[1] = this.form.getFieldsValue()['filter_parameter'][1].clone().format('YYYY-MM-DD HH:mm:ss');
      } else {
        dateTimes[0] = this.form.getFieldsValue()['filter_parameter'][0].clone().tz(this.form.getFieldsValue()['time_zone']).format('YYYY-MM-DD HH:mm:ss');
        dateTimes[1] = this.form.getFieldsValue()['filter_parameter'][1].clone().tz(this.form.getFieldsValue()['time_zone']).format('YYYY-MM-DD HH:mm:ss');
      }
    }
    if (typeof dateTimes !== 'undefined') {
      var filter_parameter = dateTimes;
    } else {
      var filter_parameter = this.form.getFieldsValue()['filter_parameter'];
    }
    if (page > this.props.pagination.current_page) {
      this.props.actions.fetchAlertsWithPaginationAndFilters(this.props.user, this.props.alerts[0].next_page, page, pageSize, this.props.selectedFilterType, filter_parameter);
    } else {
      this.props.actions.fetchAlertsWithPaginationAndFilters(this.props.user, this.props.alerts[0].previous_page, page, pageSize, this.props.selectedFilterType, filter_parameter);
    }
  }

  handleOnPageSizeChange = (current, size) => {
    if (this.props.selectedFilterType === 3) {
      var dateTimes = [];
      if (isEmpty(this.form.getFieldsValue()['time_zone'])) {
        dateTimes[0] = this.form.getFieldsValue()['filter_parameter'][0].clone().format('YYYY-MM-DD HH:mm:ss');
        dateTimes[1] = this.form.getFieldsValue()['filter_parameter'][1].clone().format('YYYY-MM-DD HH:mm:ss');
      } else {
        dateTimes[0] = this.form.getFieldsValue()['filter_parameter'][0].clone().tz(this.form.getFieldsValue()['time_zone']).format('YYYY-MM-DD HH:mm:ss');
        dateTimes[1] = this.form.getFieldsValue()['filter_parameter'][1].clone().tz(this.form.getFieldsValue()['time_zone']).format('YYYY-MM-DD HH:mm:ss');
      }
    }
    if (typeof dateTimes !== 'undefined') {
      var filter_parameter = dateTimes;
    } else {
      var filter_parameter = this.form.getFieldsValue()['filter_parameter'];
    }
    var current_page = (isEmpty(this.props.alerts[0])) ? ">" : this.props.alerts[0].current_page;
    this.props.actions.fetchAlertsWithPaginationAndFilters(this.props.user, current_page, current, size, this.props.selectedFilterType, filter_parameter);
  }

  handleFilterTypeChange = (e) => {
    if (this.form.getFieldsValue().hasOwnProperty('filter_parameter') && typeof this.form.getFieldsValue()['filter_parameter'] !== 'undefined') {
      this.form.resetFields(['filter_parameter', 'time_zone']);
    }
    this.props.actions.updateSelectedFilterType(parseInt(e));
  }

  handleAlertFilterChange = (e) => {
    if (this.props.selectedFilterType === 3) {
      var dateTimes = [];
      if (isEmpty(this.form.getFieldsValue()['time_zone'])) {
        dateTimes[0] = this.form.getFieldsValue()['filter_parameter'][0].clone().format('YYYY-MM-DD HH:mm:ss');
        dateTimes[1] = this.form.getFieldsValue()['filter_parameter'][1].clone().format('YYYY-MM-DD HH:mm:ss');
      } else {
        dateTimes[0] = this.form.getFieldsValue()['filter_parameter'][0].clone().tz(this.form.getFieldsValue()['time_zone']).format('YYYY-MM-DD HH:mm:ss');
        dateTimes[1] = this.form.getFieldsValue()['filter_parameter'][1].clone().tz(this.form.getFieldsValue()['time_zone']).format('YYYY-MM-DD HH:mm:ss');
      }
    }
    var current_page = (isEmpty(this.props.alerts[0])) ? ">" : this.props.alerts[0].current_page;
    this.form.validateFields().then(values => {
      if (typeof dateTimes !== 'undefined') {
        values.filter_parameter = dateTimes;
      }
      this.props.actions.fetchAlertsWithPaginationAndFilters(this.props.user, current_page, this.props.pagination.current_page, this.props.pagination.per_page, this.props.selectedFilterType, values.filter_parameter);
      if (this.props.selectedFilterType === 4) {
        this.props.actions.markUserAlertsViewed(this.props.user);
      }
      this.props.actions.countNewAlerts(this.props.user);
    });
  }

  alertSortingFormRef = (form) => {
    this.form = form;
  };

  render() {
    if (this.props.alerts.length) {
      let cameraGroupsTags = {};
      for (var i = 0; i < this.props.cameraGroups.length; i++) {
        cameraGroupsTags[this.props.cameraGroups[i].uuid] = isEmpty(this.props.cameraGroups[i].tag_options) ? ["Clear", "Contacted Police", "Contacted Fire Dept", "Contacted Ambulance"] : this.props.cameraGroups[i].tag_options;
      }
      var alerts = this.props.alerts.sort((a,b)=>{
        return moment(a.time) - moment(b.time)
      }).reverse();
      if (this.props.selectedFilterType === 4 && typeof this.form !== 'undefined') {
        this.form.setFieldsValue({filter_type: 4});
      }
      let time_zone = typeof this.form !== 'undefined' ? this.form.getFieldsValue()['time_zone'] : null
      return (
        <div>
          <Row type='flex' justify='center' style={styles.alertOptions}>
            <Col xs={{span: 12}}>
              <AlertSortingForm
                form={this.alertSortingFormRef}
                AlertFilterChange={this.handleAlertFilterChange}
                FilterTypeChange={this.handleFilterTypeChange}
                cameraGroups={this.props.cameraGroups}
                selectedFilterType={this.props.selectedFilterType}
                time_zone={this.state.time_zone}
              />
            </Col>
            <Col xs={{span: 12}}>
              <Pagination
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                hideOnSinglePage={true}
                showSizeChanger={true}
                onShowSizeChange={this.handleOnPageSizeChange}
                pageSize={this.props.pagination.per_page}
                defaultCurrent={this.props.pagination.current_page}
                total={this.props.pagination.total}
                onChange={this.handlePaginationChange}
                style={styles.pagination}
                disabled={this.props.fetchInProcess}
              />
            </Col>
          </Row>
          <Row type='flex' justify='start'>
            {alerts.map(alert=> (
              <Col key={`alert-${alert.id}`} xs={24} sm={12} md={8} lg={6}>
                <AlertCard {...alert} cameraGroupsTags={cameraGroupsTags} filter_time_zone={time_zone} />
              </Col>
            ))}
          </Row>
        </div>
      )
    } else {
      return (
        <div>
          <Row type='flex' justify='center' style={styles.alertOptions}>
            <Col xs={{span: 12}}>
              <AlertSortingForm
                form={this.alertSortingFormRef}
                AlertFilterChange={this.handleAlertFilterChange}
                FilterTypeChange={this.handleFilterTypeChange}
                cameraGroups={this.props.cameraGroups}
                selectedFilterType={this.props.selectedFilterType}
                time_zone={this.state.time_zone}
              />
            </Col>
            <Col xs={{span: 12}}></Col>
          </Row>
          <Row type='flex' justify='start' style={styles.alertListContainer}>
            <p style={styles.noAlertsText}>
              Things are looking good!
              <br />
              You have no alerts.
            </p>
          </Row>
        </div>
      )
    }
  }
}

const styles = {
  alertOptions: {
    marginTop: 20,
    marginBottom: 10
  },
  noAlertsText: {
    margin: '0 auto',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 24
  },
  alertListContainer: {
    height: 'calc(100vh - 65px)'
  },
  formstyles: {
    textAlign: 'center',
    float: 'left',
    marginLeft: 10
  },
  pagination: {
    float: 'right',
    marginRight: 2
  }
};

const mapStateToProps = (state) => {
  return {
    cameraGroups: state.cameraGroups.cameraGroups,
    user: state.auth.user,
    alerts: state.alerts.alerts,
    fetchError: state.alerts.fetchError,
    fetchInProcess: state.alerts.fetchInProcess,
    deleteInProcess: state.alerts.deleteInProcess,
    pagination: state.alerts.pagination,
    selectedFilterType: state.alerts.selectedFilterType,
    timeZone: state.auth.user.time_zone,
    updatedTimeZone: state.users.userData.time_zone
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(alertActions, dispatch),
    fetchCameraGroups: (user) => dispatch(fetchCameraGroups(user))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Alerts));
