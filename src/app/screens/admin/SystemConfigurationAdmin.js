import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as systemConfigurationActions from '../../redux/systemConfiguration/actions';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

class SystemConfigurationAdmin extends Component {
  constructor(props) {
    super(props);

    this.props.actions.readSystemConfigurations();

    this.state={}
  }

  render(){
    const data = [];
    if (this.props.systemConfigurations !== null) {
      for (var i = 0; i < this.props.systemConfigurations.length; i++) {
        data[i] = {
          key: this.props.systemConfigurations[i]['uuid'],
          name: this.props.systemConfigurations[i]['key'],
          value: this.props.systemConfigurations[i]['value']
        }
      }
    }
    return(<EditableTable data={data} actions={this.props.actions} />);
  }
}

const EditableContext = React.createContext();

class EditableCell extends React.Component {
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
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
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
        title: 'name',
        dataIndex: 'name',
        width: '33%',
        editable: false,
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => { return a.name.localeCompare(b.name)},
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'value',
        dataIndex: 'value',
        width: '34%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        width: '33%',
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
            <Button type="secondary" disabled={editingKey !== ''} onClick={() => this.edit(record)}>
              Edit
            </Button>
          );
        },
      },
    ];
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {data: nextProps.data}
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
        this.props.actions.updateSystemConfiguration(newItem['key'], newItem['name'], newItem['value'])
      }
    });
  }

  edit(record) {
    this.form.setFieldsValue({ ...record });
    this.setState({ editingKey: record.key });
  }

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
          inputType: col.dataIndex === 'text',
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
          scroll={{ y: '90vh' }}
        />
      </Form>
    );
  }
}

const styles={};

const mapStateToProps = (state) => {
  return {
    systemConfigurations: state.systemConfigurations.data
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(systemConfigurationActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemConfigurationAdmin);
