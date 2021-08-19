import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {Modal, Table, Input, Button, Popconfirm, Form} from 'antd';
import MobileOutlined from '@ant-design/icons';
import { updateUserDevice, deleteUserDevice } from '../../redux/users/actions';


const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableFormRow = () => (EditableRow);

class EditableCell extends Component {
  state = {
    editing: false,
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  save = (e) => {
    const { record, handleSave } = this.props;
    this.form.validateFields().then(values => {
      // if (error && error[e.currentTarget.uuid]) {
      //   return;
      // }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <Form.Item className="editable-cell-input">
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                        style={{ width: '100%', borderRadius: '4px' }}
                      />
                    )}
                  </Form.Item>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'Name',
      dataIndex: 'name',
      width: 200,
      editable: true,
      align: 'center'
    }, {
      title: 'UUID',
      dataIndex: 'uuid',
      width: 100,
      align: 'center'
    }, {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        this.state.dataSource.length >= 1
          ? (
            <Popconfirm title="Are you sure?" onConfirm={() => this.handleDelete(record.key)}>
              <Button type="secondary">Delete</Button>
            </Popconfirm>
          ) : null
      ),
    }];

    this.state = {
      dataSource: [],
      count: 0,
    };
    for (var i = 0; i < this.props.userDevices.length; i++) {
      this.state.dataSource[i] = {
        key: this.props.userDevices[i].uuid,
        name: this.props.userDevices[i].device_name,
        uuid: this.props.userDevices[i].uuid
      }
      this.state.count++;
    }

  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    for (var i = 0; i < this.props.userDevices.length; i++) {
      if (key == this.props.userDevices[i].uuid) {
        this.props.deleteUserDevice(this.props.userDevices[i].users_uuid, key, this.props.userDevices[i].device_token);
      }
    }
  }

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    this.props.updateUserDevice(this.props.userDevices[index].users_uuid, row.uuid, row.name);
  }

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          scroll={{ x:400, y: 300 }}
          pagination={false}
          style={{maxWidth: 417, margin: '0 auto'}}
          size="small"
        />
        <div style={{height: 20}}></div>
      </div>
    );
  }
}

const UserDevicesForm = ({onCancel, visible, error, userDevices, updateUserDevice, deleteUserDevice}) => {

  return (
    <Modal title='User Devices'
           visible={visible}
           style={styles.modal}
           onCancel={onCancel}
           footer={[
             error &&
             <span style={styles.error}>You cannot remove a device that is currently in use.</span>
           ]}
           className='userDevicesModal'
    >
      <EditableTable
        userDevices={userDevices}
        updateUserDevice={updateUserDevice}
        deleteUserDevice={deleteUserDevice}
      />
      <div style={styles.subscriptionAgreement}>
        <a target='_blank' href='https://www.gorog.co/subscription-agreement'>Subscription Agreement</a>
      </div>
    </Modal>
  );
};

class UserDevices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      hidden: false,
      error: false
    }

  }

  showModal = () => {
    this.setState({visible: true});
  };

  handleCancel = () => {
    this.setState({visible: false});
  };

  render() {
    return (
      <div>
        <div onClick={this.showModal}>
          <MobileOutlined />
          &nbsp;&nbsp;
          <span>User Devices</span>
        </div>
        <UserDevicesForm
          visible={this.state.visible}
          onCancel={this.handleCancel}
          error={this.state.error}
          userDevices={this.props.user.devices}
          updateUserDevice={this.props.updateUserDevice}
          deleteUserDevice={this.props.deleteUserDevice}
        />
      </div>
    );
  }
}

const styles = {
  modal: {
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
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserDevice: (userUuid, deviceUuid, name) => dispatch(updateUserDevice(userUuid, deviceUuid, name)),
    deleteUserDevice: (userUuid, deviceUuid, token) => dispatch(deleteUserDevice(userUuid, deviceUuid, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDevices);
