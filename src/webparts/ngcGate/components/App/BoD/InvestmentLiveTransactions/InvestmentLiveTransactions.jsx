import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import BoDTablePage from '../_Containers/TableContainer';
import InvestmentLiveTransactionsCreateItem from './InvestmentLiveTransactionsCreateItem';
import Highlighter from 'react-highlight-words';
import { Button, Form, Input, InputNumber, Popconfirm, Space, Tooltip, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import pnp from 'sp-pnp-js';
import { roundedNum } from '../../Global/roundedNum';
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
          inputType === 'percentage' ?
            <InputNumber ref={inputRef} placeholder='enter a number' step={1} style={{ minWidth: 100 }} onPressEnter={save} onBlur={save} formatter={(value) => `${roundedNum(value)}%`} parser={(value) => value?.replace('%', '')} />
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



const InvestmentLiveTransactions = () => {
  const listName = 'BoD Investment Live Transactions';
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [states, setStates] = React.useState({ isCanEdit: false, isPending: false, isApproved: false });
  const pageKey = "investment_live_transactions";
  const [isFormAdmin] = useCheckIsBoDFormAdmin(pageKey);

  const [searchText, setSearchText] = React.useState('');
  const [searchedColumn, setSearchedColumn] = React.useState('');
  const searchInput = React.useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder="Type to search"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{width: 90}}>
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>close</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    }
  });

  const renderTD = (value, dataIndex, minWidth) => {
    return (
      <div style={{ minWidth }}>
        {searchedColumn === dataIndex ? (
          <Highlighter 
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={value ? value?.toString() : ''}
          />
        ) : value}
      </div>
    )
  };

  const columns = [
    { 
      title: 'Type', 
      dataIndex: 'Type_', 
      editable: true,
      render: value => renderTD(value, 'Type_', 120),
      ...getColumnSearchProps('Type_'),
    },
    { 
      title: 'Project Name', 
      dataIndex: 'ProjectName', 
      editable: true,
      render: value => renderTD(value, 'ProjectName', 130),
      ...getColumnSearchProps('ProjectName'),
    },
    { 
      title: 'Target', 
      dataIndex: 'Target', 
      editable: true,
      render: value => renderTD(value, 'Target', 100),
      ...getColumnSearchProps('Target'),
    },
    { 
      title: 'Commodity', 
      dataIndex: 'Commodity', 
      editable: true,
      render: value => renderTD(value, 'Commodity', 200),
      ...getColumnSearchProps('Commodity'),
    },
    { 
      title: 'Country', 
      dataIndex: 'Country', 
      editable: true,
      render: value => renderTD(value, 'Country', 150),
      ...getColumnSearchProps('Country'),
    },
    { 
      title: 'Stake', 
      dataIndex: 'Stake', 
      editable: true,
      render: value => renderTD(value, 'Stake', 80),
      ...getColumnSearchProps('Stake'),
    },
    { 
      title: 'SALIC Coverage (Tons)', 
      dataIndex: 'SALICCoverage', 
      editable: true,
      render: value => renderTD(value, 'SALICCoverage',  80),
      ...getColumnSearchProps('SALICCoverage'),
    },
    { 
      title: 'Contribution', 
      dataIndex: 'Contribution', 
      editable: true,
      render: value => renderTD(value, 'Contribution', 80),
      ...getColumnSearchProps('Contribution'),
    },
    { 
      title: 'Consideration', 
      dataIndex: 'Consideration', 
      editable: true,
      render: value => renderTD(value, 'Consideration', 140),
      ...getColumnSearchProps('Consideration'),
    },
    { 
      title: 'Status', 
      dataIndex: 'Status', 
      editable: true,
      render: value => renderTD(value, 'Status', 100),
      ...getColumnSearchProps('Status'),
    },
    { 
      title: 'Commodity Coverage', 
      dataIndex: 'CommodityCoverage', 
      editable: true,
      render: value => renderTD(value, 'CommodityCoverage', 140),
      ...getColumnSearchProps('CommodityCoverage'),
    },
    { 
      title: 'Comments', 
      dataIndex: 'Comments', 
      editable: true,
      render: value => renderTD(value, 'Comments', 200),
      ...getColumnSearchProps('Comments'),
    },
    { 
      title: 'Next Steps', 
      dataIndex: 'NextSteps', 
      editable: true,
      render: value => renderTD(value, 'NextSteps', 200),
      ...getColumnSearchProps('NextSteps'),
    },
    { 
      title: 'Deal Size (US$ mm)', 
      dataIndex: 'DealSize_x0028_US_x0024_mm_x0029', 
      editable: true,
      render: value => renderTD(value, 'DealSize_x0028_US_x0024_mm_x0029', 100),
      ...getColumnSearchProps('DealSize_x0028_US_x0024_mm_x0029'),
    },
    { 
      title: 'Progress', 
      dataIndex: 'Progress', 
      editable: true,
      render: value => <div style={{ minWidth: 80, textAlign: "center" }}>{roundedNum(value)}%</div>,
      ...getColumnSearchProps('Progress'),
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
      Type_: row.Type_, 
      ProjectName: row.ProjectName,
      Target: row.Target,
      Commodity: row.Commodity,
      Country: row.Country,
      Stake: row.Stake,
      SALICCoverage: row.SALICCoverage,
      Contribution: row.Contribution,
      Consideration: row.Consideration,
      Status: row.Status,
      CommodityCoverage: row.CommodityCoverage,
      Comments: row.Comments,
      NextSteps: row.NextSteps,
      Progress: roundedNum(row.Progress/100),
      DealSize_x0028_US_x0024_mm_x0029: row.DealSize_x0028_US_x0024_mm_x0029,
    };
    try {
      await pnp.sp.web.lists.getByTitle('BoD Investment Live Transactions').items.getById(item.Id).update(payload);
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
        inputType: ['Commodity', 'Country', 'Comments', 'NextSteps'].includes(col.dataIndex) ? 'textarea' : ['SALICCoverage', 'Contribution', 'DealSize_x0028_US_x0024_mm_x0029'].includes(col.dataIndex) ? 'number' : ['Progress'].includes(col.dataIndex) ? 'percentage' : 'text',
        handleSave,
      }),
    };
  });

  if(!isFormAdmin) return <AntdLoader />;
  return (
    <BoDTablePage
      PageTitle="Investment Live Transactions"
      formKey={pageKey}
      dataListName={listName}
      createItemComponent={InvestmentLiveTransactionsCreateItem}
      tableColumns={editableColumns}
      loading={loading} setLoading={setLoading}
      data={data} setData={setData}
      states={states} setStates={setStates}
      editableTableComponents={{ body: { row: EditableRow, cell: EditableCell } }}
    />
  )
}

export default InvestmentLiveTransactions