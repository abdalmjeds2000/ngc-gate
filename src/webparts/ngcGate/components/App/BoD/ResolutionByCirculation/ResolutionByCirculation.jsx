import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import BoDTablePage from '../_Containers/TableContainer';
import ResolutionByCirculationCreateItem from './ResolutionByCirculationCreateItem';
import { Button, Form, Input, Popconfirm, Tooltip, message } from 'antd';
import pnp from 'sp-pnp-js';
import useCheckIsBoDFormAdmin from '../../Hooks/useCheckIsBoDFormAdmin';


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
    if (editing) inputRef.current.focus();
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
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Input ref={inputRef} placeholder='write here' style={{ minWidth: 100 }} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};




const ResolutionByCirculation = () => {
  const listName = 'BoD Resolution By Circulation';
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [states, setStates] = React.useState({ isCanEdit: false, isPending: false, isApproved: false });
  const pageKey = "resolution_by_circulation";
  const [isFormAdmin] = useCheckIsBoDFormAdmin(pageKey);

  const renderTD = (value, minWidth) => <div style={{ minWidth }}>{value}</div>;
  const columns = [
    { 
      title: 'Resolution By Circulation Number',
      dataIndex: 'ResolutionByCirculationNumber', 
      editable: true,
      width: '45%',
      render: value => renderTD(value, 140),
    },
    { 
      title: 'Subject', 
      dataIndex: 'Subject', 
      editable: true,
      width: '45%',
      render: value => renderTD(value, 90),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) =>
        (states.isCanEdit && !states.isPending && !states.isApproved) ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.Id)}>
            <Button type='link' danger>Delete</Button>
          </Popconfirm> ) : (
          <Tooltip title='You do not have permission to delete'>
            <Button type='link' danger disabled>Delete</Button>
          </Tooltip>
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
  const handleSave = async (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.Id === item.Id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    if (JSON.stringify(item) === JSON.stringify(row)) return;
    const payload = {
      Title: row.Title,
      ResolutionByCirculationNumber: row.ResolutionByCirculationNumber,
      Subject: row.Subject,
    };
    try {
      await pnp.sp.web.lists.getByTitle('BoD Resolution By Circulation').items.getById(item.Id).update(payload);
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
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: 'text',
        handleSave,
      }),
    };
  });

  if(!isFormAdmin) return <AntdLoader />;
  return (
    <BoDTablePage
      PageTitle="Resolution By Circulation"
      formKey={pageKey}
      dataListName={listName}
      createItemComponent={ResolutionByCirculationCreateItem}
      tableColumns={editableColumns}
      loading={loading} setLoading={setLoading}
      data={data} setData={setData}
      states={states} setStates={setStates}
      editableTableComponents={{ body: { row: EditableRow, cell: EditableCell } }}
    />
  )
}

export default ResolutionByCirculation