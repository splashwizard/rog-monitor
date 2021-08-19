import React, { useContext, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as usersActions from '../../redux/users/actions';
import { Table, Input, Button, Popconfirm, Form, InputNumber, message } from 'antd';
import { isEmpty } from '../../redux/helperFunctions';

const UsersForm = ({handleSubmit, form}) => {
  return (
    <Form layout={'inline'} onFinish={handleSubmit} style={styles.formstyles} ref={form}>
      <Form.Item label="User uuid" name="user_uuid" rules={[{type: 'string', message: 'Please enter a valid integer'}]} hasFeedback>
        <Input placeholder="Enter uuid" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

const LicenseAddForm = ({handleAdd, form}) => {

  return (
    <Form layout={'inline'} onFinish={handleAdd} style={styles.formstyles} ref={form} initialValues={{number_to_add: 0}}>
      <Form.Item label="Number Of Licenses To Add" name="number_to_add" rules={[{type: 'number', message: 'Please enter a valid integer'}]} hasFeedback>
        <InputNumber placeholder="0" min={0} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Add License(s)</Button>
      </Form.Item>
    </Form>
  )
};

class LicensesAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state={}
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.updateUserError !== '') {
      message.error(nextProps.updateUserError, 10);
    }
    return null;
  }

  handleSubmit = (e) => {
    this.userForm.validateFields(['user_uuid']).then(values => {
      this.props.actions.readUserCameraLicensesAdmin(values);
    });
  }

  handleAddForm = (form) => {
    this.licenseForm = form;
  };

  handleUserForm = (form) => {
    this.userForm = form;
  };

  handleAdd = (e) => {
    this.licenseForm.validateFields(['number_to_add']).then(values => {
      if (!isEmpty(this.props.userData)) {
        this.props.actions.createUserLicense(this.props.userData, values.number_to_add);
      }
    });
  };

  render(){
    let count = 0;
    const data = [];
    if (!isEmpty(this.props.cameraLicenseData)) {
      for (var i = 0; i < this.props.cameraLicenseData.length; i++) {
        data[i] = {
          key: this.props.cameraLicenseData[i]['uuid'],
          uuid: this.props.cameraLicenseData[i]['uuid'],
          cameras_uuid: this.props.cameraLicenseData[i]['cameras_uuid'],
          tier_0: this.props.cameraLicenseData[i]['tier_0'],
          tier_1: this.props.cameraLicenseData[i]['tier_1'],
          tier_2: this.props.cameraLicenseData[i]['tier_2']
        }
        count++;
      }
      return(
        <div>
          <UsersForm
            form={this.handleUserForm}
            handleSubmit={this.handleSubmit}
          />
          <LicenseAddForm
            form={this.handleAddForm}
            handleAdd={this.handleAdd}
          />
          <div style={{paddingBottom: 10, paddingLeft: 20, marginTop: -40}}>Total Licenses For This User: {count}</div>
          <EditableTable
            data={data}
            userData={this.props.userData}
            actions={this.props.actions}
          />
        </div>
      )
    } else if (!isEmpty(this.props.userData)) {
      return(
        <div>
          <UsersForm
            form={this.handleUserForm}
            handleSubmit={this.handleSubmit}
          />
          <LicenseAddForm
            form={this.handleAddForm}
            handleAdd={this.handleAdd}
          />
        </div>
      )
    } else {
      return (
        <div>
          <UsersForm
            form={this.handleUserForm}
            handleSubmit={this.handleSubmit}
          />
        </div>
      )
    }
  }
}

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

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Uuid',
        dataIndex: 'uuid',
        width: 200,
        editable: false,
        defaultSortOrder: 'descend',
        sorter:(a, b) => a.uuid - b.uuid,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Cameras Uuid',
        dataIndex: 'cameras_uuid',
        width: 200,
        editable: true,
        defaultSortOrder: 'descend',
        sorter:(a, b) => a.cameras_uuid - b.cameras_uuid,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Tier 0',
        dataIndex: 'tier_0',
        width: 200,
        editable: true,
        defaultSortOrder: 'descend',
        sorter:(a, b) => a.tier_0 - b.tier_0,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Tier1',
        dataIndex: 'tier_1',
        width: 200,
        editable: true,
        defaultSortOrder: 'descend',
        sorter:(a, b) => a.tier_1 - b.tier_1,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Tier 2',
        dataIndex: 'tier_2',
        width: 200,
        editable: true,
        defaultSortOrder: 'descend',
        sorter:(a, b) => a.tier_2 - b.tier_2,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        width: 200,
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <Button type="secondary">Delete</Button>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: this.props.data,
      count: this.props.data.length,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {dataSource: nextProps.data}
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.props.actions.deleteUserLicenseAdmin(this.props.userData, dataSource.filter(item => item.key == key)[0]);
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    this.props.actions.updateUserLicense(this.props.userData, newData[index]);
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
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
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        scroll={{ y: 500 }}
      />
    );
  }
}

const styles={
  formstyles: {
    width: 500,
    margin: '0 auto'
  }
};

const mapStateToProps = (state) => {
  return {
    userData: state.users.userData,
    cameraLicenseData: state.users.cameraLicenseData,
    updateUserError: state.users.updateUserError,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(usersActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LicensesAdmin);
