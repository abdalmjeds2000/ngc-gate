import React, { useContext, useEffect, useRef, useState } from 'react';
import './KeyFinancialMetrics.css';
import { Collapse, Form, InputNumber, Space, Table, message } from 'antd';
import { groupedData } from './util';
import CreateItem from './CreateItem';
import pnp from 'sp-pnp-js';
import { roundedNum } from '../../Global/roundedNum';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import { FundProjectionScreenOutlined, TableOutlined } from '@ant-design/icons';
import Tabs from '../../Global/CustomTabs/Tabs';
import PowerBIEmbed from '../../Global/PowerBiEmbed/PowerBiEmbed';
import useCheckIsBoDFormAdmin from '../../Hooks/useCheckIsBoDFormAdmin';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';

function getMonthName(monthNumber) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  if (monthNumber >= 1 && monthNumber <= 12) {
    return monthNames[monthNumber - 1];
  } else {
    return monthNumber;
  }
}
const EditableContext = React.createContext(null);
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
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    if(['Change', 'Variance'].includes(dataIndex)) {
      form.setFieldsValue({ [dataIndex]: roundedNum(record[dataIndex] * 100) });
    } else {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      if(values.Change) values.Change = roundedNum(values.Change / 100);
      if(values.Variance) values.Variance = roundedNum(values.Variance / 100);
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
      <Form.Item
        style={{ margin: 0, minHeight: 0 }}
        name={dataIndex}
        rules={[
          { required: true, message: '' },
        ]}
      >
        <InputNumber ref={inputRef} parser={(value) => roundedNum(value)} onPressEnter={save} size='small' onBlur={save} step={0.01} style={{ width: '100%' }} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};



const KeyFinancialMetrics = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState([]);
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  const [link, setLink] = React.useState(null);
  const listName = 'KeyFinancialMetrics';
  const pageKey = 'key_financial_metrics';
  const [isFormAdmin] = useCheckIsBoDFormAdmin(pageKey);

  const fetchLink = async () => {
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Pages Info').items.filter(`PageKey eq '${pageKey}'`).get();
      setLink(response[0]);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchData = async () => {
    setLoading(true);
    const result = await pnp.sp.web.lists.getByTitle(listName).items.top(5000).get();
    setData(result);
    setDataSource(groupedData(result));
    setLoading(false);
  }
  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchLink(); }, []);

  const defaultColumns = [
    {
      title: 'Title',
      dataIndex: 'header',
      width: '50%',
      render: (val, record) => (
        <div style={{ minWidth: 150, fontWeight: 500, fontSize: record.level === 1 ? '1.15rem' : '1rem' }}>
          {record.level === 3 ? getMonthName(val) : val}
        </div>
      ),
      onCell: (record, index) => {
        return { colSpan: record.isEditable ? 1 : 3 };
      },
    },
    {
      title: 'Actual',
      dataIndex: 'Actual',
      editable: true,
      width: '25%',
      render: (val) => <div style={{ minWidth: 100 }}>{val}</div>
    },
    {
      title: 'Budget',
      dataIndex: 'Budget',
      editable: true,
      width: '25%',
      render: (val) => <div style={{ minWidth: 100 }}>{val}</div>
    },
  ];
  const columns = defaultColumns.map((col) => {
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
        handleSave,
        colSpan: record.isEditable ? 1 : 0
      }),
    };
  });

  const handleSave = async (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.Id === item.Id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    if(
      row.Actual == item.Actual && 
      row.Budget == item.Budget
    ) {
      console.log('No Changes');
    } else {
      const payload = {
        Actual: newData[index].Actual,
        Budget: newData[index].Budget,
      };
      const updateResponse = await pnp.sp.web.lists.getByTitle(listName).items.getById(item.Id).update(payload);
      console.log('updateResponse', updateResponse);
      message.success("The item has been modified successfully", 1);
    }
    setData(newData);
    setDataSource(groupedData(newData));
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleOnCreateItem = (row) => {
    const newData = [...data, row];
    setData(newData);
    setDataSource(groupedData(newData));
  }

  const dataTypesList = dataSource
    ?.map((r) => r.parent)
    ?.filter(function (item, pos, self) { return self.indexOf(item) == pos; })


  const ControlPanel = (
    <Space size={5}>
      <CreateItem onSuccess={handleOnCreateItem} dataSource={dataSource} />
    </Space>
  );

  const content = (
    <div className="table-page-container" style={{top: 0, marginBottom: 25, padding: 0, minHeight: 'fit-content'}}>
      <div className='content'>
        <div className="header" style={{borderRadius: 0}}>
          <h1>Key Financial Metrics</h1>
          <div>{ControlPanel}</div>
        </div>

        <Form form={form} component={false}>
          <div className='form' style={{padding: '10px 0', minHeight: 'unset'}}>
            <Collapse defaultActiveKey={["1"]}>
              {dataTypesList?.map((row, i) => (
                <Collapse.Panel key={i + 1} header={`Key Financial Ratio :: ${row}`}>
                  <div style={{ overflowX: "auto" }}>
                    <Table
                      components={components}
                      bordered
                      loading={loading}
                      dataSource={dataSource?.filter((r) => r.parent === row)}
                      columns={columns}
                      pagination={false}
                      rowClassName={(record) => `editable-row key-financial-metrics-row-header lvl-${record.level}`}
                    />
                  </div>
                </Collapse.Panel>
              ))}
            </Collapse>
          </div>
        </Form>
      </div>
    </div>
  );

  const tabsItems = [
    {
      key: 'data', 
      icon: <TableOutlined />, 
      title: 'Key Financial Metrics', 
      content: content
    },{
      key: 'preview', 
      icon: <FundProjectionScreenOutlined />, 
      title: "Preview", 
      content: (
        <iframe
          name="reportFrame"
          src={link?.PreviewLink}
          width="100%"
          style={{ border: 0, minHeight: "calc(100vh - 215px)" }}
        />
        // link ? <PowerBIEmbed
        //   reportId={link?.ReportId}
        //   groupId={link?.WorkspaceId}
        //   iframeClassName='bod-preview-iframe'
        // /> : null
      ),
    },
  ];

  if(!isFormAdmin) return <AntdLoader />;
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>Key Financial Metrics</p>
      </HistoryNavigation>

      <div className='standard-page key-financial-metrics-page-container'>
        <Tabs items={tabsItems} />
      </div>
    </>
  )
}

export default KeyFinancialMetrics