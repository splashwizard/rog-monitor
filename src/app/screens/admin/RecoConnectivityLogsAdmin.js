import React, { useContext, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as recoConnectivityLogsActions from '../../redux/recoConnectivityLogs/actions';
import { Table, Input, Button, Popconfirm, Form, InputNumber, message } from 'antd';
import { isEmpty } from '../../redux/helperFunctions';

const RecoConnectivityLogsAdminForm = ({handleSubmit, form}) => {

  return (
    <Form layout={'inline'} onFinish={handleSubmit} style={styles.formstyles} ref={form}>
      <Form.Item label="User Email" name="email" rules={[{type: 'string', message: 'Please enter a valid email'}]} hasFeedback>
        <Input placeholder="Enter Email" />
      </Form.Item>
      <Form.Item label="Camera Group UUID" name="camera_groups_uuid" rules={[{type: 'string', message: 'Please enter a valid uuid'}]} hasFeedback>
        <Input placeholder="Enter UUID" />
      </Form.Item>
      <Form.Item label="Camera UUID" name="cameras_uuid" rules={[{type: 'string', message: 'Please enter a valid uuid'}]} hasFeedback>
        <Input placeholder="Enter UUID" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

class RecoConnectivityLogsAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state={}
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.fetchRecoConnectivityLogsError !== '') {
      message.error(nextProps.fetchRecoConnectivityLogsError, 10);
    }
    return null;
  }

  handleSubmit = (e) => {
    this.form.validateFields().then(values => {
      this.props.actions.readAllRecoConnectivityLogs(values);
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  };

  render(){
    const data = [];
    if (!isEmpty(this.props.recoConnectivityLogs)) {
      for (var i = 0; i < this.props.recoConnectivityLogs.length; i++) {
        data[i] = {
          key: this.props.recoConnectivityLogs[i]['uuid'],
          timestamp: this.props.recoConnectivityLogs[i]['timestamp'],
          cameras_uuid: this.props.recoConnectivityLogs[i]['cameras_uuid'],
          cameras_name: this.props.recoConnectivityLogs[i]['cameras_name'],
          email: this.props.recoConnectivityLogs[i]['email'],
          status: this.props.recoConnectivityLogs[i]['status'],
          url_type_id: this.props.recoConnectivityLogs[i]['url_type_id'],
          url_type_name: this.props.recoConnectivityLogs[i]['url_type_name'],
          duration: this.props.recoConnectivityLogs[i]['duration']
        }
      }
      return(
        <div>
          <RecoConnectivityLogsAdminForm
            form={this.saveFormRef}
            handleSubmit={this.handleSubmit}
          />
          <EditableTable
            data={data}
            userData={this.props.userData}
            actions={this.props.actions}
          />
        </div>
      )
    } else {
      return(
        <div>
          <RecoConnectivityLogsAdminForm
            form={this.saveFormRef}
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
        title: 'Timestamp',
        dataIndex: 'timestamp',
        width: 200,
        editable: false
      },
      {
        title: 'Camera UUID',
        dataIndex: 'cameras_uuid',
        width: 200,
        editable: false
      },
      {
        title: 'Camera Name',
        dataIndex: 'cameras_name',
        width: 200,
        editable: false
      },
      {
        title: 'User Email',
        dataIndex: 'email',
        width: 200,
        editable: false
      },
      {
        title: 'Activity',
        dataIndex: 'status',
        width: 150,
        editable: false
      },
      {
        title: 'URL Type ID',
        dataIndex: 'url_type_id',
        width: 100,
        editable: false
      },
      {
        title: 'URL Type Name',
        dataIndex: 'url_type_name',
        width: 200,
        editable: false
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        width: 150,
        editable: false
      }
    ];

    this.state = {
      dataSource: this.props.data,
      count: this.props.data.length,
    };
  }

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
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          scroll={{ y: 500 }}
        />
      </div>
    );
  }
}

const styles={
  formstyles: {
    width: 1000,
    margin: '0 auto'
  }
};

const mapStateToProps = (state) => {
  return {
    userData: state.users.userData,
    recoConnectivityLogs: state.recoConnectivityLogs.recoConnectivityLogsAdmin,
    fetchRecoConnectivityLogsError: state.recoConnectivityLogs.fetchRecoConnectivityLogsError
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(recoConnectivityLogsActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(RecoConnectivityLogsAdmin);
