import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import BoDTablePage from '../_Containers/TableContainer';
import ContributionCreateItem from './ContributionCreateItem';
import { Button, Form, Input, InputNumber, Popconfirm, Tooltip, message } from 'antd';
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
        {
          inputType === 'textarea' ?
            <Input.TextArea ref={inputRef} placeholder='write here' rows={4} style={{ minWidth: 200 }} onPressEnter={save} onBlur={save} />
          : inputType === 'number' ?
            <InputNumber ref={inputRef} placeholder='enter a number' step={1} style={{ minWidth: 100 }} onPressEnter={save} onBlur={save} />
          :
            <Input ref={inputRef} placeholder='write here' style={{ minWidth: 100 }} onPressEnter={save} onBlur={save} />
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






const Contribution = () => {
  const listName = 'BoD Contribution';
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [states, setStates] = React.useState({ isCanEdit: false, isPending: false, isApproved: false });
  const pageKey = "contribution";
  const [isFormAdmin] = useCheckIsBoDFormAdmin(pageKey);


  const renderTD = (value, minWidth) => <div style={{ minWidth }}>{value}</div>;
  const columns = [
    { 
      title: 'Commodity',
      dataIndex: 'Commodity', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 140),
    },
    { 
      title: 'Commodity Type', 
      dataIndex: 'CommodityType', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 90),
    },
    { 
      title: 'Year 2022', 
      dataIndex: 'Year2022', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 90),
    },
    { 
      title: 'Year 2023', 
      dataIndex: 'Year2023', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 90),
    },
    { 
      title: 'Portfolio Company', 
      dataIndex: 'PortfolioCompany', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 90),
    },
    { 
      title: 'Comments', 
      dataIndex: 'Comments', 
      editable: true,
      width: '15%',
      render: value => renderTD(value, 200),
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
      Commodity: row.Commodity,
      CommodityType: row.CommodityType,
      Year2022: row.Year2022,
      Year2023: row.Year2023,
      PortfolioCompany: row.PortfolioCompany,
      Comments: row.Comments,
    };
    try {
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
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: col.dataIndex === 'Comments' ? 'textarea' : ['Year2022', 'Year2023'].includes(col.dataIndex) ? 'number' : 'text',
        handleSave,
      }),
    };
  });

  if(!isFormAdmin) return <AntdLoader />;
  return (
    <BoDTablePage
      PageTitle="Contribution"
      formKey={pageKey}
      dataListName={listName}
      createItemComponent={ContributionCreateItem}
      tableColumns={editableColumns}
      loading={loading} setLoading={setLoading}
      data={data} setData={setData}
      states={states} setStates={setStates}
      editableTableComponents={{ body: { row: EditableRow, cell: EditableCell } }}
    />
  )
}

export default Contribution