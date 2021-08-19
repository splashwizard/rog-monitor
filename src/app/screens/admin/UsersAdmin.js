import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as usersActions from '../../redux/users/actions';
import { isEmpty } from '../../redux/helperFunctions';
import { Form, Input, Button, Table, InputNumber, Popconfirm, Select, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment-timezone';

const UsersForm = ({handleSubmit, form}) => {
  return (
    <Form layout={'inline'} onFinish={handleSubmit} style={styles.formstyles} ref={form}>
      <Form.Item label="User uuid" name="user_uuid" rules={[{type: 'string', message: 'Please enter a valid UUID'}]} hasFeedback>
        <Input placeholder="Enter uuid" />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{type: 'string', message: 'Please enter a valid string'}]} hasFeedback>
        <Input placeholder="Enter Email" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

const AddUserForm = ({visible, onCancel, onCreate, form, addUserInProcess, createSelectItems, updateTimeZone, currentTimeZone}) => {
  const layout = {
    wrapperCol: {
      span: 16,
      offset: 4
    }
  };
  return (
    <Modal title='Add a User'
      visible={visible}
      onCancel={onCancel}
      onOk={onCreate}
      okText='Add'
      cancelText='Cancel'
      confirmLoading={addUserInProcess}
    >
      <Form ref={form} initialValues={{time_zone: currentTimeZone}} {...layout}>
        <Form.Item name="email" rules={[{required: true, pattern: new RegExp("^.+@[^\.].*\.[a-z]{2,}$"), message: "Please enter a valid email address."}]} hasFeedback>
          <Input placeholder='Email'/>
        </Form.Item>
        <Form.Item name="password" rules={[{required: true, message: 'Please enter the user password'}]} hasFeedback>
          <Input type='password' placeholder='Password'/>
        </Form.Item>
        <Form.Item name="first_name" rules={[{required: false, message: 'Please enter the user first name'}]} hasFeedback>
          <Input placeholder='First Name'/>
        </Form.Item>
        <Form.Item name="last_name" rules={[{required: false, message: 'Please enter the user last name'}]} hasFeedback>
          <Input placeholder='Last Name'/>
        </Form.Item>
        <Form.Item name="time_zone" rules={[{required: true, message: 'Please enter your time zone'}]} hasFeedback>
          <Select
            showSearch
            placeholder="Enter Time Zone"
            optionFilterProp="children"
            onChange={updateTimeZone}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {createSelectItems()}
          </Select>
        </Form.Item>
        <p>Number of Licenses to Add:</p>
        <Form.Item name="number_to_add" rules={[{type: 'number', message: 'Please enter a valid integer'}]} hasFeedback>
          <InputNumber placeholder="0" min={0} defaultValue={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

class UsersAdmin extends Component {
  constructor(props) {
    super(props);

    this.state={
      visible: false,
      addUserError: '',
      time_zone: moment.tz.guess()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.updateUserError !== '') {
      message.error(nextProps.updateUserError, 10);
    }
    if (nextProps.addUserError !== '' && nextProps.addUserError !== prevState.addUserError) {
      message.error(nextProps.addUserError, 10);
      return {visible: prevState.visible, addUserError: nextProps.addUserError}
    }
    return null;
  }

  handleSubmit = (e) => {
    this.form.validateFields().then(values => {
      if (values.email !== undefined) {
        this.props.actions.readUserByEmailAdmin(values);
      } else {
        this.props.actions.readUserByUuidAdmin(values);
      }
    }).finally(() => {
      this.form.resetFields();
    });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCreate = () => {
    const form = this.formRef;
    form.validateFields().then(values => {
      if (typeof values.number_to_add === 'undefined') {
        values.number_to_add = 0;
      }
      if (typeof values.first_name === 'undefined') {
        values.first_name = null;
      }
      if (typeof values.last_name === 'undefined') {
        values.last_name = null;
      }
      this.props.actions.createUserAdmin(values);
      this.setState({ visible: false });
      form.resetFields();
    });
  };

  handleCancel = () => {
    this.formRef.resetFields();
    this.setState({ visible: false });
  };

  saveFormRef = (form) => {
    this.form = form;
  };

  addUserFormRef = formRef => {
    this.formRef = formRef;
  };

  handleCreateSelectItems = () => {
    if (this.state.visible == true) {
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
  }

  handleUpdateTimeZone = (fieldValue) => {
    this.setState({time_zone: fieldValue});
  }

  render(){
    const data = [];
    if (!isEmpty(this.props.userData)) {
      for (var i = 0; i < this.props.userData.length; i++) {
        data[i] = {
          key: this.props.userData[i]['uuid'],
          uuid: this.props.userData[i]['uuid'],
          email: this.props.userData[i]['email'],
          first_name: this.props.userData[i]['first_name'],
          last_name: this.props.userData[i]['last_name'],
          time_zone: this.props.userData[i]['time_zone'],
          enabled: this.props.userData[i]['enabled'].toString(),
          user_privileges_id: this.props.userData[i]['user_privileges_id'],
          mute: this.props.userData[i]['mute'].toString()
        }
      }
      return(
        <div style={{marginTop: 10}}>
          <UsersForm
            form={this.saveFormRef}
            handleSubmit={this.handleSubmit}
          />
          <Button onClick={this.showModal} type="primary" style={{ marginBottom: 16 }}>
            Add a User
          </Button>
          <AddUserForm
            form={this.addUserFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            addUserError={this.props.addUserError}
            addUserInProcess={this.props.addUserInProcess}
            createSelectItems={this.handleCreateSelectItems}
            updateTimeZone={this.handleUpdateTimeZone}
            currentTimeZone={this.state.time_zone}
          />
          <EditableTable
            data={data}
            actions={this.props.actions}
            adminUser={this.props.user}
          />
        </div>
      )
    } else {
      return(
        <div style={{marginTop: 10}}>
          <UsersForm
            form={this.saveFormRef}
            handleSubmit={this.handleSubmit}
          />
          <Button onClick={this.showModal} type="primary" style={{ marginBottom: 16 }}>
            Add a User
          </Button>
          <AddUserForm
            form={this.addUserFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            addUserError={this.props.addUserError}
            addUserInProcess={this.props.addUserInProcess}
            createSelectItems={this.handleCreateSelectItems}
            updateTimeZone={this.handleUpdateTimeZone}
            currentTimeZone={this.state.time_zone}
          />
        </div>
      )
    }
  }
}

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.dataIndex === 'enabled' || this.props.dataIndex === 'mute'){
      return <Select placeholder="true or false" allowClear={true} dropdownMatchSelectWidth={true} style={{ width: 80 }}><Select.Option value="true">true</Select.Option><Select.Option value="false">false</Select.Option></Select>;
    }
    if (this.props.dataIndex === 'user_privileges_id') {
      return <Select placeholder="Select Privilege" allowClear={true} dropdownMatchSelectWidth={true} style={{ width: 80 }}><Select.Option value="0">admin</Select.Option><Select.Option value="1">reco</Select.Option><Select.Option value="2">user</Select.Option></Select>;
    }
    if (this.props.inputType === 'text') {
      return <Input />;
    }
  };

  renderCell = () => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    const inputNode = this.getInput();
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }} name={dataIndex} rules={[{required: true, message: `Please Input ${title}!`}]}>
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      editingKey: '',
      searchText: ''
    }

    this.columns = [
      {
        title: 'User uuid',
        dataIndex: 'uuid',
        editable: false,
        sorter: (a, b) => a.uuid - b.uuid,
        sortDirections: ['descend', 'ascend'],
        width: 150
      },
      {
        title: 'Email',
        dataIndex: 'email',
        editable: true,
        ...this.getColumnSearchProps('email'),
        sorter: (a, b) => { return a.email.localeCompare(b.email)},
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'First Name',
        dataIndex: 'first_name',
        editable: true,
        ...this.getColumnSearchProps('first_name'),
        sorter: (a, b) => { return a.first_name.localeCompare(b.first_name)},
        sortDirections: ['descend', 'ascend'],
        width: 200
      },
      {
        title: 'Last Name',
        dataIndex: 'last_name',
        editable: true,
        ...this.getColumnSearchProps('last_name'),
        sorter: (a, b) => { return a.last_name.localeCompare(b.last_name)},
        sortDirections: ['descend', 'ascend'],
        width: 200
      },
      {
        title: 'Time Zone',
        dataIndex: 'time_zone',
        ...this.getColumnSearchProps('time_zone'),
        sorter: (a, b) => { return a.time_zone.localeCompare(b.time_zone)},
        sortDirections: ['descend', 'ascend'],
        width: 200,
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <EditableContext.Consumer>
              {() => (
                <Form.Item name="time_zone" rules={[{required: true, message: 'Please enter your time zone'}]} style={{ margin: 0 }} hasFeedback>
                  <Select
                    showSearch
                    placeholder="Enter Time Zone"
                    optionFilterProp="children"
                    onChange={this.handleUpdateTimeZone}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.handleCreateSelectItems()}
                  </Select>
                </Form.Item>
              )}
            </EditableContext.Consumer>
          ) : (
            <EditableContext.Consumer>
              {() => (
                <span>
                  <span>
                    {text}
                  </span>
                </span>
              )}
            </EditableContext.Consumer>
          );
        },
      },
      {
        title: 'Enabled',
        dataIndex: 'enabled',
        editable: true,
        width: 150
      },
      {
        title: 'User Privilege Id',
        dataIndex: 'user_privileges_id',
        editable: true,
        width: 150
      },
      {
        title: 'Mute',
        dataIndex: 'mute',
        editable: true,
        width: 150
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        width: 150,
        fixed: 'right',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {() => (
                  <Popconfirm title="Save changes?" onConfirm={() => this.save(record)}>
                    <Button type="secondary"
                      style={{ marginRight: 8 }}
                    >
                      Save
                    </Button>
                  </Popconfirm>
                )}
              </EditableContext.Consumer>
              <Button type="secondary" onClick={() => this.cancel(record.key)}>Cancel</Button>
            </span>
          ) : (
            <div>
              <Button type="secondary" disabled={editingKey !== ''} onClick={() => this.edit(record)} style={{ marginRight: 8 }}>
                Edit
              </Button>
              <Popconfirm title="delete record?" onConfirm={() => this.delete(record.key)}>
                <Button type="secondary" style={{ marginRight: 8 }}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

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

  save(record) {
    let key = record.key;
    this.form.validateFields().then(row => {
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        const newItem = newData[index];
        this.setState({ data: newData, editingKey: '' });
        this.props.actions.updateUserAdmin(this.props.adminUser, newItem);
      }
    });
  }

  edit(record) {
    this.form.setFieldsValue({ ...record });
    this.setState({ editingKey: record.key });
  }

  delete(key) {
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.key !== key) });
    this.props.actions.deleteUserAdmin(key);
  };

  formRef = (form) => {
    this.form = form;
  }

  render() {
    const components = {
      body: {
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
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <Form ref={this.formRef} component={false}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
          scroll={{ x: 1300, y: '90vh' }}
        />
      </Form>
    );
  }
}

const styles={
  formstyles: {
    width: 650,
    margin: '0 auto'
  },
  timeZone: {
    width: '80%'
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    userData: state.users.userData,
    updateUserError: state.users.updateUserError,
    updateUserInProgress: state.users.updateUserInProgress,
    updateUserSuccess: state.users.updateUserSuccess,
    addUserInProcess: state.users.addUserInProcess,
    addUserError: state.users.addUserError
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(usersActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersAdmin);
