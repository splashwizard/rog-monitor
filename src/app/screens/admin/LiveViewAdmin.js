import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as liveViewActions from '../../redux/liveView/actions';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

class LiveViewAdmin extends Component {
  constructor(props) {
    super(props);

    this.props.actions.readLiveViews();

    this.state={}
  }

  render(){
    const data = [];
    if (this.props.liveViews !== null) {
      for (var i = 0; i < this.props.liveViews.length; i++) {
        data[i] = {
          key: this.props.liveViews[i]['id'],
          uuid: this.props.liveViews[i]['uuid'],
          camera_name: this.props.liveViews[i]['camera_name'],
          camera_url: this.props.liveViews[i]['camera_url'],
          camera_group_name: this.props.liveViews[i]['camera_group_name']
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
        title: 'Camera Group Name',
        dataIndex: 'camera_group_name',
        width: '25%',
        editable: false,
        ...this.getColumnSearchProps('camera_group_name'),
        sorter: (a, b) => { return a.camera_group_name.localeCompare(b.camera_group_name)},
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Camera Name',
        dataIndex: 'camera_name',
        width: '25%',
        editable: false,
        ...this.getColumnSearchProps('camera_name'),
        sorter: (a, b) => { return a.camera_name.localeCompare(b.camera_name)},
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'UUID',
        dataIndex: 'uuid',
        width: '25%',
        editable: false,
      },
      {
        title: 'Camera URL',
        dataIndex: 'camera_url',
        width: '25%',
        editable: false,
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
    liveViews: state.liveView.data
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(liveViewActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LiveViewAdmin);
