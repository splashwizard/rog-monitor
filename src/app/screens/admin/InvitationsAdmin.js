import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as InvitationsAdminActions from '../../redux/invites/actions';
import { Form, Input, Button, Table, InputNumber, Popconfirm, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const InvitationsForm = ({handleSubmit, form}) => {
  return (
    <Form layout={'inline'} onFinish={handleSubmit} style={styles.formstyles} ref={form}>
      <Form.Item label="User uuid" name="user_uuid" rules={[{type: 'string', message: 'Please enter a valid integer'}]} hasFeedback>
        <Input placeholder="Enter uuid" />
      </Form.Item>
      <Form.Item label="Invitation uuid" name="invitation_uuid" rules={[{type: 'string', message: 'Please enter a valid integer'}]} hasFeedback>
        <Input placeholder="Enter uuid" />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{type: 'email', message: 'Please enter a valid email.'}]} hasFeedback>
        <Input placeholder="Enter Email" />
      </Form.Item>
      <Form.Item label="Type" name="type">
        <Select
          placeholder="Select Type"
          allowClear={true}
          dropdownMatchSelectWidth={true}
          style={{ width: 150 }}
        >
          <Select.Option value="share_group">Share Group</Select.Option>
          <Select.Option value="share_group_register">Share Group Register</Select.Option>
          <Select.Option value="forgot_password">Forgot Password</Select.Option>
          <Select.Option value="register">Register</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

class InvitationsAdmin extends Component {
  constructor(props){
    super(props);

    this.state={}
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.fetchReceivedError !== '') {
      message.error(nextProps.fetchReceivedError, 10);
    }
    if (nextProps.updateInvitationError !== '') {
      message.error(nextProps.updateInvitationError, 10);
    }
    if (nextProps.deleteInvitationError !== '') {
      message.error(nextProps.deleteInvitationError, 10);
    }
    return null;
  }

  handleSubmit = (e) => {
    this.form.validateFields().then(values => {
      this.props.actions.fetchUserInvites(values);
    });

  };

  saveFormRef = (form) => {
    this.form = form;
  };

  render(){
    const data = [];
    if (this.props.invites !== null) {
      for (var i = 0; i < this.props.invites.length; i++) {
        data[i] = {
          key: this.props.invites[i]['uuid'],
          uuid: this.props.invites[i]['uuid'],
          users_uuid: this.props.invites[i]['users_uuid'],
          email: this.props.invites[i]['email'],
          type: this.props.invites[i]['type'],
          action: this.props.invites[i]['action'],
          status: this.props.invites[i]['status']
        }
      }
      return(
        <div>
          <InvitationsForm
            form={this.saveFormRef}
            handleSubmit={this.handleSubmit}
          />
          <EditableTable
            data={data}
            actions={this.props.actions}
          />
        </div>
      )
    } else {
      return(
        <InvitationsForm
          form={this.saveFormRef}
          handleSubmit={this.handleSubmit}
        />
      )
    }
  }
}

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.dataIndex === 'type'){
      return <Select placeholder="Select Type" allowClear={true} dropdownMatchSelectWidth={true} style={{ width: 150 }}><Select.Option value="share_group">Share Group</Select.Option><Select.Option value="forgot_password">Forgot Password</Select.Option><Select.Option value="register">Register</Select.Option></Select>;
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
          <Form.Item style={{ margin: 0 }} name={dataIndex} rules={[{required: true, message: `Please Input ${title}!`}]} defaultValue={record[dataIndex]}>
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
        title: 'Invitation Uuid',
        dataIndex: 'uuid',
        editable: false,
        sorter: (a, b) => a.uuid - b.uuid,
        sortDirections: ['descend', 'ascend'],
        width: 150
      },
      {
        title: 'User uuid',
        dataIndex: 'user_uuid',
        editable: false,
        sorter: (a, b) => a.user_uuid - b.user_uuid,
        sortDirections: ['descend', 'ascend'],
        width: 100
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
        title: 'Type',
        dataIndex: 'type',
        editable: true,
        ...this.getColumnSearchProps('type'),
        sorter: (a, b) => { return a.type.localeCompare(b.type)},
        sortDirections: ['descend', 'ascend'],
        width: 200
      },
      {
        title: 'Action',
        dataIndex: 'action',
        editable: true,
        sorter: (a, b) => { return a.action.localeCompare(b.action)},
        sortDirections: ['descend', 'ascend'],
        width: 300
      },
      {
        title: 'Status',
        dataIndex: 'status',
        editable: false,
        ...this.getColumnSearchProps('status'),
        sorter: (a, b) => { return a.status.localeCompare(b.status)},
        sortDirections: ['descend', 'ascend'],
        width: 200
      },
      {
        title: 'operation',
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
                  <Popconfirm title="Save changes?" onConfirm={() => this.save(record.key)}>
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
                <Button type="secondary"
                  style={{ marginRight: 8 }}
                >
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

  save(key) {
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
        this.props.actions.updateInvitation(newItem);
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
    this.props.actions.deleteInvitation(key);
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
    width: 1150,
    margin: '0 auto'
  }
};

const mapStateToProps = (state) => {
  return {
    invites: state.invites.invites,
    fetchReceivedError: state.invites.fetchReceivedError,
    updateInvitationError: state.invites.updateInvitationError,
    deleteInvitationError: state.invites.deleteInvitationError
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(InvitationsAdminActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InvitationsAdmin);
