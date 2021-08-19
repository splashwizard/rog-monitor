import React, { useContext, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as camerasActions from '../../redux/cameras/actions';
import { Table, Input, Button, Popconfirm, Form, InputNumber, message, Radio, Modal, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { isEmpty } from '../../redux/helperFunctions';
import Highlighter from 'react-highlight-words';

const UrlsForm = ({handleSubmit, form}) => {
  return (
    <Form layout={'inline'} onFinish={handleSubmit} style={styles.formstyles} ref={form}>
      <Form.Item label="Camera Uuid" name="cameras_uuid" rules={[{type: 'string', message: 'Please enter a valid uuid'}]} hasFeedback>
        <Input placeholder="Enter Camera Uuid" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

class UrlsAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state={}
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.editUrlError !== '') {
      message.error(nextProps.editUrlError, 10);
    }
    return null;
  }

  handleSubmit = (e) => {
    this.form.validateFields().then(values => {
      this.setState({cameras_uuid: values.cameras_uuid});
      this.props.actions.readUrlsAdmin(this.props.user, values);
    });
  }

  cameraUrlFormRef = (form) => {
    this.form = form;
  };

  resetFields = () => {
    this.formRef.resetFields();
    this.setState({fullRtspUrl: null});
  };

  render(){
    const data = [];
    if (!isEmpty(this.props.urls)) {
      for (var i = 0; i < this.props.urls.length; i++) {
        data[i] = {
          key: this.props.urls[i]['url_uuid'],
          cameras_uuid: this.state.cameras_uuid,
          url_uuid: this.props.urls[i]['url_uuid'],
          url_set_uuid: this.props.urls[i]['url_set_uuid'],
          url_type_id: this.props.urls[i]['url_type_id'],
          enabled: this.props.urls[i]['enabled'].toString(),
          reco_active: !isEmpty(this.props.urls[i]['reco_active']) ? this.props.urls[i]['reco_active'].toString() : null,
          url: this.props.urls[i]['url'],
          synched_at: this.props.urls[i]['synched_at'],
          url_id: this.props.urls[i]['url_id'],
          verified: this.props.urls[i]['verified'].toString(),
          alt_chart_id: this.props.urls[i]['alt_chart_id'],
          inserted_at: this.props.urls[i]['inserted_at'],
          updated_at: this.props.urls[i]['updated_at']
        }
      }

      return(
        <div>
          <UrlsForm
            form={this.cameraUrlFormRef}
            handleSubmit={this.handleSubmit}
          />
          <EditableTable
            data={data}
            user={this.props.user}
            actions={this.props.actions}
          />
        </div>
      )
    } else {
      return(
        <div>
          <UrlsForm
            form={this.cameraUrlFormRef}
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
        title: 'Url Uuid',
        dataIndex: 'url_uuid',
        width: 200,
        editable: false,
        defaultSortOrder: 'descend',
        sorter:(a, b) => a.uuid - b.uuid,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Url Set Uuid',
        dataIndex: 'url_set_uuid',
        width: 200,
        editable: false,
        defaultSortOrder: 'descend',
        sorter:(a, b) => a.uuid - b.uuid,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Url Type Id',
        dataIndex: 'url_type_id',
        width: 100,
        editable: false,
        defaultSortOrder: 'descend',
        sorter:(a, b) => a.uuid - b.uuid,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Enabled',
        dataIndex: 'enabled',
        width: 100,
        editable: true
      },
      {
        title: 'Alt Chart Id',
        dataIndex: 'alt_chart_id',
        width: 100,
        editable: true
      },
      {
        title: 'RECO Active',
        dataIndex: 'reco_active',
        width: 100,
        editable: false
      },
      {
        title: 'URL',
        dataIndex: 'url',
        editable: false
      },
      {
        title: 'Synched At',
        dataIndex: 'synched_at',
        width: 300,
        editable: false
      },
      {
        title: 'URL Id',
        dataIndex: 'url_id',
        width: 100,
        editable: false
      },
      {
        title: 'Verified',
        dataIndex: 'verified',
        width: 100,
        editable: true
      },
      {
        title: 'Inserted At',
        dataIndex: 'inserted_at',
        width: 300,
        editable: false
      },
      {
        title: 'Updated At',
        dataIndex: 'updated_at',
        width: 300,
        editable: false
      }
    ];

    this.state = {
      dataSource: this.props.data,
      count: this.props.data.length
    };
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

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    this.props.actions.updateUrlsAdmin(this.props.user, newData[index]);
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
        scroll={{ x:2700, y: 500 }}
      />
    );
  }
}

const styles={
  formstyles: {
    width: 500,
    margin: '0 auto'
  },
  videoContainer: {
    backgroundColor: 'black',
    height: 130,
    width: 230,
    color: 'white',
    margin: '0 auto'
  },
  videoContainerText: {
    paddingTop: 50
  },
  error: {
    color: 'red'
  },
  timeZone: {
    width: '80%'
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    urls: state.cameras.urlsAdmin,
    editUrlError: state.cameras.editUrlError
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(camerasActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UrlsAdmin);
