import React, { useContext, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cameraGroupsActions from '../../redux/cameraGroups/actions';
import { Table, Input, Button, Popconfirm, Form, InputNumber, message } from 'antd';
import { isEmpty } from '../../redux/helperFunctions';

const UsersForm = ({handleSubmit, form}) => {

  return (
    <Form layout={'inline'} onFinish={handleSubmit} style={styles.formstyles} ref={form}>
      <Form.Item label="User uuid" name="user_uuid" rules={[{type: 'string', message: 'Please enter a valid uuid'}]} hasFeedback>
        <Input placeholder="Enter uuid" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

class CameraGroupsAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state={}
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.editCameraGroupError !== '') {
      message.error(nextProps.editCameraGroupError, 10);
    }
    return null;
  }

  handleSubmit = (e) => {
    this.form.validateFields().then(values => {
      this.props.actions.readAllCameraGroupsForUser(values);
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  };

  render(){
    const data = [];
    if (!isEmpty(this.props.cameraGroups)) {
      for (var i = 0; i < this.props.cameraGroups.length; i++) {
        data[i] = {
          key: this.props.cameraGroups[i]['uuid'],
          uuid: this.props.cameraGroups[i]['uuid'],
          name: this.props.cameraGroups[i]['name'],
          away_mode: this.props.cameraGroups[i]['away_mode'].toString()
        }
      }
      return(
        <div>
          <UsersForm
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
          <UsersForm
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
        title: 'Camera Group Uuid',
        dataIndex: 'uuid',
        width: 200,
        editable: false,
        defaultSortOrder: 'descend',
        sorter:(a, b) => a.uuid - b.uuid,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: 'Name',
        dataIndex: 'name',
        width: 200,
        editable: true
      },
      {
        title: 'Away Mode',
        dataIndex: 'away_mode',
        width: 300,
        editable: true
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

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.props.actions.deleteCameraGroup(this.props.userData, dataSource.filter(item => item.key == key)[0]);
  };

  handleAdd = () => {
    this.props.actions.createCameraGroupAdmin(this.props.userData);
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
    this.props.actions.updateCameraGroup(this.props.userData, newData[index]);
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
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
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
    width: 400,
    margin: '0 auto'
  }
};

const mapStateToProps = (state) => {
  return {
    userData: state.users.userData,
    cameraGroups: state.cameraGroups.cameraGroupsAdmin,
    editCameraGroupError: state.cameraGroups.editCameraGroupError
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(cameraGroupsActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraGroupsAdmin);
