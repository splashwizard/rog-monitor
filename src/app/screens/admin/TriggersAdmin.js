import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as triggersActions from '../../redux/triggers/actions';
import { Table, Badge, Menu, Dropdown, Popconfirm, Form, InputNumber, Input, Button, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { isEmpty } from '../../redux/helperFunctions';

const UsersForm = ({handleSubmit, form}) => {

  return (
    <Form layout={'inline'} onFinish={handleSubmit} style={styles.formstyles} ref={form}>
      <Form.Item label="Camera Group Uuid" name="camera_groups_uuid" rules={[{type: 'string', message: 'Please enter a valid integer'}]} hasFeedback>
        <Input placeholder="Enter uuid" />
      </Form.Item>
      <Form.Item label="Camera Uuid" name="cameras_uuid" rules={[{type: 'string', message: 'Please enter a valid uuid'}]} hasFeedback>
        <Input placeholder="Enter uuid" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

class TriggersAdmin extends Component {
  constructor(props){
    super(props);

    this.columns = [
      {
        title: 'Trigger Uuid',
        dataIndex: 'id',
        key: 'id',
        editable: false,
        width: 200
      },
      {
        title: 'Base Triggers Uuid',
        dataIndex: 'base_triggers_uuid',
        key: 'base_triggers_uuid',
        editable: false,
        width: 200
      },
      {
        title: 'Users Uuid',
        dataIndex: 'users_uuid',
        key: 'users_uuid',
        editable: false,
        width: 200
      },
      {
        title: 'Cameras Uuid',
        dataIndex: 'cameras_uuid',
        key: 'cameras_uuid',
        editable: false,
        width: 200
      },
      {
        title: 'Trigger Type',
        dataIndex: 'trigger_type',
        key: 'trigger_type',
        editable: false,
        width: 200
      },
      {
        title: 'Target Type',
        dataIndex: 'target_type',
        key: 'target_type',
        editable: false,
        width: 200
      },
      {
        title: 'Trigger Duration',
        dataIndex: 'trigger_duration',
        key: 'trigger_duration',
        editable: false,
        width: 200
      },
      {
        title: 'Direction',
        dataIndex: 'direction',
        key: 'direction',
        editable: false,
        width: 200
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        width: 200,
        render: (text, record) =>
          <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteTrigger(record.key)}>
            <Button type="secondary">Delete</Button>
          </Popconfirm>
      }
    ];

    this.state = {
      dataSource: []
    };
  }


  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.fetchTriggerErrorAdmin) {
      message.error(nextProps.fetchTriggerErrorAdmin, 10);
    }
    const data = [];
    if (!isEmpty(nextProps.triggers)) {
      for (let i = 0; i < nextProps.triggers.length; ++i) {
        data.push({
          key: nextProps.triggers[i]['uuid'],
          id: nextProps.triggers[i]['uuid'],
          base_triggers_uuid: nextProps.triggers[i]['base_trigger']['uuid'],
          users_uuid: nextProps.triggers[i]['users_uuid'],
          cameras_uuid: nextProps.triggers[i]['cameras_uuid'],
          trigger_type: nextProps.triggers[i]['base_trigger']['trigger_type'],
          target_type: nextProps.triggers[i]['base_trigger']['target_type'],
          trigger_duration: nextProps.triggers[i]['base_trigger']['trigger_duration'],
          direction: nextProps.triggers[i]['base_trigger']['direction']
        });
      }
    }
    return {
      dataSource: data
    };
  }

  handleSubmit = (e) => {
    this.form.validateFields().then(values => {
      this.setState({camera_groups_uuid: values.camera_groups_uuid});
      this.setState({cameras_uuid: values.cameras_uuid});
      this.props.actions.fetchTriggersAdmin(this.props.user, values);
    });
  }

  handleDeleteTrigger = key => {
    const dataSource = [...this.state.dataSource];
    this.props.actions.deleteTriggerAdmin(this.props.user, dataSource.filter(item => item.key == key)[0], this.state.cameras_uuid, this.props.cameraGroupUuid);
  };

  handleDeleteTriggerTimeWindow = record => {
    this.props.actions.deleteTriggerTimeWindowAdmin(this.props.user, record, this.state.cameras_uuid, this.props.cameraGroupUuid);
  };

  formRef = (form) => {
    this.form = form;
  };

  expandedRowRender = (record, index, indent, expanded) => {
    const columns = [
      {
        title: 'Trigger Time Window Uuid',
        dataIndex: 'id',
        key: 'id',
        editable: false,
        width: 200
      },
      {
        title: 'Trigger Uuid',
        dataIndex: 'triggers_uuid',
        key: 'triggers_uuid',
        editable: false,
        width: 200
      },
      {
        title: 'Days Of Week',
        key: 'days_of_week',
        dataIndex: 'days_of_week',
        editable: true,
        width: 400
      },
      {
        title: 'Start At',
        dataIndex: 'start_at',
        key: 'start_at',
        editable: true,
        width: 200
      },
      {
        title: 'End At',
        dataIndex: 'end_at',
        key: 'end_at',
        editable: true,
        width: 200
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        width: 200,
        render: (text, record) =>
          <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteTriggerTimeWindow(record)}>
            <Button type="secondary">Delete</Button>
          </Popconfirm>
      }
    ];
    const data = [];
    if (typeof this.props.triggers[index].time_windows !== "undefined") {
      for (let i = 0; i < this.props.triggers[index].time_windows.length; ++i) {
        data.push({
          key: this.props.triggers[index].time_windows[i]['uuid'],
          id: this.props.triggers[index].time_windows[i]['uuid'],
          triggers_uuid: this.props.triggers[index].time_windows[i]['triggers_uuid'],
          days_of_week: this.props.triggers[index].time_windows[i]['days_of_week'],
          start_at: this.props.triggers[index].time_windows[i]['start_at'],
          end_at: this.props.triggers[index].time_windows[i]['end_at']
        });
      }
    }
    if (data !== []) {
      return (
        <EditableTable
          columns={columns}
          data={data}
          record={record}
          user={this.props.user}
          cameraGroupUuid={this.state.camera_groups_uuid}
          actions={this.props.actions}
        />
      )
    } else {
      return "";
    }
  }

  render(){
    if (!isEmpty(this.state.dataSource)) {
      return (
        <div>
          <UsersForm
            form={this.formRef}
            handleSubmit={this.handleSubmit}
          />
          <Table
            columns={this.columns}
            expandedRowRender={this.expandedRowRender}
            dataSource={this.state.dataSource}
          />
        </div>
      );
    } else {
      return (
        <UsersForm
          form={this.formRef}
          handleSubmit={this.handleSubmit}
        />
      )
    }


  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = this.props.columns;

    this.state = {
      dataSource: this.props.data,
      count: this.props.data.length
    };
  }

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    this.props.actions.updateTriggerTimeWindowAdmin(this.props.user, newData[index], this.props.record, this.props.cameraGroupUuid);
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
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    );
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

const styles={
  formstyles: {
    width: 800,
    margin: '0 auto'
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    triggers: state.triggers.polygonDataAdmin,
    fetchTriggerErrorAdmin: state.triggers.fetchTriggerErrorAdmin
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(triggersActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TriggersAdmin);
