import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../Hooks/useIsAdmin';
import CreateItem from './CreateItem';
import { Button, Divider, Form, Input, Popconfirm, Select, Space, Table, Typography, message } from 'antd';
import pnp from 'sp-pnp-js';
import { CheckCircleTwoTone, CloseCircleTwoTone, FileDoneOutlined, RedoOutlined, RetweetOutlined } from '@ant-design/icons';
import UserColumnInTable from '../../Global/UserColumnInTable/UserColumnInTable';
import { AppCtx } from '../../App';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const StatusOptions = [
  { label: 'Partially Achieve', value: 'Partially Achieve' },
  { label: 'Achieved', value: 'Achieved' },
  { label: 'Not Achieved', value: 'Not Achieved' },
  { label: 'Over Achieved', value: 'Over Achieved' },
];

const EditableContext = createContext(null);
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
const EditableCell = ({ title, editable, children, dataIndex, inputType, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  

  useEffect(() => {
    if (editing) inputRef?.current?.focus();
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0, width: '100%', justifyContent: 'flex-end', paddingRight: 20 }} name={inputType !== 'USER' ? dataIndex : null}>
        {
          inputType === 'TEXTAREA' ?
            <Input.TextArea ref={inputRef} placeholder='write here' rows={4} style={{ width: 275 }} onPressEnter={save} onBlur={save} />
          : inputType === 'STATUS' ?
            <Select 
              ref={inputRef} placeholder='select an Status' style={{ width: 170 }} 
              onPressEnter={save} onBlur={save}
              options={StatusOptions}
            />
          : inputType === 'CHECKBOX' ?
            <Select ref={inputRef} placeholder='select true/false' style={{ width: 170 }} onPressEnter={save} onBlur={save}>
              <Select.Option value={true}>True</Select.Option>
              <Select.Option value={false}>False</Select.Option>
            </Select>
          : <Input ref={inputRef} placeholder='write here' style={{ width: 175 }} onPressEnter={save} onBlur={save} />
        }
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};






const ActionPlansAdmin = () => {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isKPIsAdmin] = useIsAdmin('KPIs Admins');
  const listName = 'KPIs Action Plans';


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await pnp.sp.web.lists.getByTitle(listName).items
        .select('Responsible/Title,Responsible/EMail,*').expand('Responsible')
        .orderBy('Created', false).get();
      setData(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => { fetchData(); }, []);
  const renderTD = (value, minWidth) => <div style={{ minWidth }}>{value}</div>;
  const columns = [
    { 
      title: 'Status',
      dataIndex: 'Status', 
      editable: true,
      width: '7%',
      render: value => renderTD(value, 110),
    },{ 
      title: 'Date',
      dataIndex: 'Created',
      width: '9%',
      render: value => renderTD(moment(value).format('MM/DD/YYYY hh:mm A'), 140),
    },{ 
      title: 'KPI',
      dataIndex: 'Title', 
      editable: false,
      width: '18%',
      render: value => renderTD(value, 180),
    },{ 
      title: 'Issue',
      dataIndex: 'Issue', 
      editable: true,
      width: '19%',
      render: value => renderTD(value, 220),
    },{ 
      title: 'Action Plan',
      dataIndex: 'ActionPlan', 
      editable: true,
      width: '19%',
      render: value => renderTD(value, 220),
    },{ 
      title: 'Responsible',
      dataIndex: 'Responsible', 
      editable: false,
      width: '18%',
      render: value =>  value ? renderTD(<UserColumnInTable Mail={value?.EMail} DisplayName={value?.Title} />, 175) : ' - '
    },{ 
      title: 'Add. mgmt. support?',
      dataIndex: 'AddManagmentSupport', 
      editable: true,
      width: '9%',
      render: value => (
        <div style={{ textAlign: 'center', minWidth: 120 }}>
          {value ? <CheckCircleTwoTone size={20} /> : <CloseCircleTwoTone twoToneColor="#fe3e5e" size={20} />}
        </div>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: '10%',
      render: (_, record) => (
        <Space block split={<Divider type="vertical" />} size={0}>
          {
            record.IsDone ? (
              <Popconfirm 
                title={<>Sure to re-open?<br /><Typography.Text type='secondary'><small>Once re-open, resposible user can add or update the action plan.</small></Typography.Text></>} 
                placement='topRight' onConfirm={() => handleSave({ ...record, IsDone: false }, 'reopen')}>
                <Button type='link' style={{padding: 0}} icon={<RetweetOutlined />}>Re-open</Button>
              </Popconfirm>
            ) : (
              <Popconfirm 
                title={<>Sure to mark as done?<br /><Typography.Text type='secondary'><small>Once mark as done, resposible user can't add or update the action plan.</small></Typography.Text></>} 
                placement='topRight' onConfirm={() => handleSave({ ...record, IsDone: true })}>
                <Button type='link' style={{padding: 0}} icon={<FileDoneOutlined />}>Close</Button>
              </Popconfirm>
            )
          }

          <Popconfirm 
            title="Sure to delete?" placement='topRight' 
            onConfirm={() => handleDelete(record.Id)}>
            <Button type='link' style={{padding: 0}} danger >Delete</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  const handleDelete = async (id) => {
    try {
      await pnp.sp.web.lists.getByTitle(listName).items.getById(id).delete();
      message.success('Item Deleted Successfully');
    } catch (error) {
      console.log(error);
    }
    const newData = data?.filter((item) => item.Id !== id);
    setData(newData);
  };
  const handleSave = async (row, action) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.Id === item.Id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    if (JSON.stringify(item) === JSON.stringify(row)) return;
    try {
      // const payload = {
      //   Status: row.Status,
      //   Issue: row.Issue,
      //   ActionPlan: row.ActionPlan,
      //   AddManagmentSupport: row.AddManagmentSupport,
      //   IsDone: row.IsDone,
      //   ResposibleCount: action === 'reopen' ? 0 : -1
      // };
      // payload just have the fields that updated (field in row === field in item)
      const payload = Object.keys(row).reduce((acc, key) => {
        if (row[key] !== item[key]) acc[key] = row[key];
        return acc;
      }, {});
      // payload.ResposibleCount = action === 'reopen' ? 0 : -1;
      payload.ResposibleCount = -1;
      await pnp.sp.web.lists.getByTitle(listName).items.getById(item.Id).update(payload);
      message.success('Item Updated Successfully');
    } catch (error) {
      console.log(error);
    }
    setData(newData);
  };
  const editableColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => {
        // if(record.IsDone) return;
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          inputType: col.dataIndex === 'Status' ? 'STATUS' : ['Issue', 'ActionPlan'].includes(col.dataIndex) ? 'TEXTAREA' : ['AddManagmentSupport'].includes(col.dataIndex) ? 'CHECKBOX' : 'TEXT',
          handleSave,
        }
      },
    };
  });



  const ControlPanel = (
    <Space size={5}>
      <Button size='small' loading={loading} icon={<RedoOutlined />} onClick={fetchData}>Refresh</Button>
      <CreateItem listName={listName} statusOptions={StatusOptions} onFinish={fetchData} />
    </Space>
  );

  document.title = '.:: SALIC Gate - Action Plans ::.';

  if(!isKPIsAdmin) return (<AntdLoader />);
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/hc-services`)}>Human Capital Services</a>
        <p>Action Plans</p>
      </HistoryNavigation>

      <div className="table-page-container">
        <div className='content'>
          <div className="header">
            <h1>Action Plans - Admin Page</h1>
            <div>{ControlPanel}</div>
          </div>

          <div className='form'>
            <Table
              columns={editableColumns}
              dataSource={data}
              pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true, style: {padding: '25px 0'} }} 
              loading={loading}
              components={{ body: { row: EditableRow, cell: EditableCell } }}
              size="large" bordered
              rowClassName={() => {
                let classes = 'editable-row';
                // if record is new (compare now with Created date) then add new-record class
                return classes;
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ActionPlansAdmin