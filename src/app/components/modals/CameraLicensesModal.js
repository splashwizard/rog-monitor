import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Modal, Form, Input, Button } from 'antd';
import {IdcardOutlined} from '@ant-design/icons';
import {isEmpty} from '../../redux/helperFunctions';
const FormItem = Form.Item;

const CameraLicensesForm = ({onCancel, visible, cancelSave, cancelSaveButton, error, cameraLicenses, cameraGroups, updatelicenses}) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
    },
    wrapperCol: {
      xs: { span: 12 },
    },
  };

  const countTotalCameraLicenses = () => {
    let count = 0;
    if (!isEmpty(cameraLicenses)) {
      cameraLicenses.map(cameraLicense => cameraLicense.uuid !== null ? count++ : count)
    }
    return count;
  }

  const countUsedCameraLicenses = () => {
    let count = 0;
    if (!isEmpty(cameraLicenses)) {
      cameraLicenses.map(cameraLicense => cameraLicense.cameras_uuid !== null ? count++ : count)
    }
    return count;
  }

  const countAvailableCameraLicenses = () => {
    let count = 0;
    if (!isEmpty(cameraLicenses)) {
      cameraLicenses.map(cameraLicense => cameraLicense.cameras_uuid == null ? count++ : count)
    }
    return count;
  }

  const columns = [{
    title: 'Owner',
    dataIndex: 'owner',
    width: 100,
    align: 'center'
  }, {
    title: 'Distributer',
    dataIndex: 'distributer',
    width: 100,
    align: 'center'
  }, {
    title: 'Manager',
    dataIndex: 'manager',
    width: 100,
    align: 'center'
  }, {
    title: 'Camera ID',
    dataIndex: 'cameras_uuid',
    width: 100,
    align: 'center',
    fixed: 'right'
  }];

  const data = [];
  if (!isEmpty(cameraLicenses)) {
    for (var i = 0; i < cameraLicenses.length; i++) {
      data.push({
        key: cameraLicenses[i].uuid,
        owner: cameraLicenses[i].tier_0,
        distributer: cameraLicenses[i].tier_1,
        manager: cameraLicenses[i].tier_2,
        cameras_uuid: cameraLicenses[i].cameras_uuid
      });
    }
  }

  return (
    <Modal title='Camera License Settings'
           visible={visible}
           style={styles.modal}
           onCancel={onCancel}
           footer={[
             error &&
             <span style={styles.error}>Number of licenses may not be less than number of Used Licenses</span>
           ]}
           className='cameraLicensesModal'
    >
      <Table
        columns={[{
          title: 'Total',
          dataIndex: 'total',
          width: '33%',
          align: 'center'
        }, {
          title: 'Used',
          dataIndex: 'used',
          width: '34%',
          align: 'center'
        }, {
          title: 'Available',
          dataIndex: 'available',
          width: '33%',
          align: 'center'
        }]}
        dataSource={[{
          key: 1,
          total: countTotalCameraLicenses(),
          used: countUsedCameraLicenses(),
          available: countAvailableCameraLicenses(),
        }]}
        pagination={false}
        scroll={{ y: 100 }}
        style={{maxWidth: 417, margin: '0 auto'}}
        size="small"
      />
      <div style={{height: 10}}></div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 400, y: 300 }}
        style={{maxWidth: 417, margin: '0 auto'}}
        size="small"
      />
      <div style={{height: 20}}></div>
      <div style={styles.subscriptionAgreement}>
        <a target='_blank' href='https://www.gorog.co/subscription-agreement'>Subscription Agreement</a>
      </div>
    </Modal>
  );
};

class CameraLicenses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      hidden: false,
      error: false
    }

  }

  updateInputValue = (e) => {
    if (e.target.id === '1') {
      this.setState({
        LicensesText: e.target.value
      });
    }
  };

  cancelSaveButton = () => {
    // this.setState({hidden: !this.state.hidden})
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
      if (values.licenses < values.used) {
        this.setState({error: true});
      } else {
        this.setState({error: false});
      }

      // console.log('Received values of form: ', values);

      // form.resetFields();
    });
  };

  render() {
    return (
      <div>
        <div onClick={this.showModal}>
          <IdcardOutlined />
          &nbsp;&nbsp;
          <span>Licenses</span>
        </div>
        <CameraLicensesForm
          visible={this.state.visible}
          onCancel={this.handleCancel}
          cancelSaveButton={this.cancelSaveButton}
          cancelSave={this.state.hidden}
          error={this.state.error}
          cameraLicenses={this.props.user.cameraLicenses}
          cameraGroups={this.props.cameraGroups}
          updatelicenses={this.updateInputValue}
        />
      </div>
    );
  }
}

const styles = {
  modal: {
    textAlign: 'center'
  },
  error: {
    color: 'red',
    textAlign: 'center'

  },
  subscriptionAgreement: {
    float: 'right',
    marginTop: -10,
    marginRight: 15
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    cameraGroups: state.cameraGroups.cameraGroups
  }
}

export default connect(mapStateToProps, null)(CameraLicenses);
