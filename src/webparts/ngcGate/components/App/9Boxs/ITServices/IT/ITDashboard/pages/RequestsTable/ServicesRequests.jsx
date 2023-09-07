import React, { useContext, useEffect, useState } from 'react';
import { Button, Popover, Space, Table, Typography } from 'antd';
import moment from 'moment';
import { AppCtx, apiUrl } from '../../../../../../App';
import UserColumnInTable from '../../../../../../Global/UserColumnInTable/UserColumnInTable';
import { CloseCircleOutlined, FileExcelOutlined, FilterOutlined, InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import axios from 'axios';
import HoverTicketDescription from './HoverTicketDescription';


export const initialStat = {
  data: [],
  tableParams: {
    pagination: {
      current: 1,
      pageSize: 24,
      total: 0,
      position: ['none', 'bottomCenter'], style: {padding: '25px 0'},
      pageSizeOptions: [10, 20, 24, 50, 100]
    },
  },
  from: '',
  to: '',
  loading: false,
  search: '',
  draw: 0,
}

function ServicesRequests(props) {
  const { params } = props;
  const { users, from, to } = params;

  const { ITRequests, setITRequests, defualt_route } = useContext(AppCtx);
  const [isFilterActive, setIsFilterActive] = useState(true);

  const fetchData = async (signal) => {
    const skipItems = ITRequests.tableParams.pagination.pageSize * (ITRequests.tableParams.pagination.current - 1);
    const takeItems = ITRequests.tableParams.pagination.pageSize;
    const orderBy = (ITRequests.tableParams?.field && ITRequests.tableParams.order) ? `${ITRequests.tableParams.field} ${ITRequests.tableParams.order === 'ascend' ? 'asc' : 'desc'}` : 'Id desc';
    const _emails = (isFilterActive && users) ? users?.join(",") : "";
    try {
      setITRequests(prev => ({ ...prev, loading: true }));
      await axios.get(`${apiUrl}/tracking/Get?draw=${ITRequests.draw}&order=${orderBy}&start=${skipItems}&length=${takeItems}&search[value]=&search[regex]=false&from=${from || ''}&to=${to || ''}&email=${_emails}&query=${ITRequests.search}&_=1668265007659`, { signal: signal })
        .then((res) => {
          setITRequests(prev => ({
            ...prev,
            draw: prev.draw + 1,
            data: res.data?.data,
            tableParams: {
              ...prev.tableParams,
              pagination: {
                ...prev.tableParams.pagination,
                total: isFilterActive ? res.data.recordsFiltered : res.data.recordsTotal,
              },
            },
          }));
        })
    } catch (error) {
      console.log(error);
    } finally {
      setITRequests(prev => ({ ...prev, loading: false }));
    }
  }

  const controller = new AbortController();
  const signal = controller.signal;
  useEffect(() => {
    fetchData(signal);
    return () => {controller.abort();};
  }, [ITRequests.search, isFilterActive.toString(), JSON.stringify(params), ITRequests.tableParams.pagination.current, ITRequests.tableParams.pagination.pageSize, ITRequests.tableParams.field, ITRequests.tableParams.order]);

  useEffect(() => {
    if(!isFilterActive) setIsFilterActive(true);
  }, [users?.toString()]);
  useEffect(() => {
    setITRequests(prev => ({
      ...prev,
      tableParams: {
        ...prev.tableParams,
        pagination: {
          ...prev.tableParams.pagination,
          current: 1,
        },
      },
    }));
  }, [isFilterActive, users?.toString()]);
  
  const handleTableChange = (pagination, filters, sorter) => {
    if(sorter.field === 'Requester') sorter.field = 'Requester.DisplayName';
    if(sorter.field === 'PendingWith') sorter.field = 'PendingWith.DisplayName';
    setITRequests(prev => ({
      ...prev,
      tableParams: {
        ...prev.tableParams,
        pagination,
        filters,
        ...sorter,
      },
    }));
  };


  var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

  const columns = [
    {
      title: 'SR. #',
      dataIndex: 'Id',
      width: '6%',
      sorter: true,
      // render: (val) => <b>{`SR[#${val}]`}</b>
      render: (val, record) => (
        <Typography.Link href={defualt_route + `/services-requests/${record.Id}`} target={!mobile ? "_blank" : ""}>
          {`SR[#${val}]`}
        </Typography.Link>
      )
    },{
      title: 'Date & Time',
      dataIndex: 'CreatedAt',
      width: '12%',
      sorter: true,
      render: (val) => <div style={{minWidth: 140}}>{moment(val).format('MM/DD/YYYY hh:mm:ss')}</div>
    },{
      title: 'Subject',
      dataIndex: 'Subject',
      width: '32%',
      sorter: true,
      render: (val, record) => (
        <Space direction='horizontal' style={{minWidth: 220}}>
          <Popover destroyTooltipOnHide content={<HoverTicketDescription RequestId={record.Id} />} overlayInnerStyle={{ color: '#333', width: 'fit-content', overflow: 'auto', minWidth: 400, maxWidth: '100vh', maxHeight: 400 }}>
            <InfoCircleOutlined style={{color: record.Priority === "1" ? "#0c508c" : "#ff272b"}} /> 
          </Popover>
          <div>
            <Typography.Link href={defualt_route + `/services-requests/${record.Id}`} target={!mobile ? "_blank" : ""}>
              {val}
            </Typography.Link>
            {
              record.Tags && Array.isArray(record.Tags) && record.Tags.length > 0 ? (
                <>
                  <br />
                  <Typography.Text type='secondary' style={{fontSize: 12}}>
                    {record?.Tags?.map((mention, index) => (
                      <Typography.Link key={index} href={`https://nationalgrain.sharepoint.com/_layouts/15/me.aspx/?p=${mention?.email}&v=work`} target='_blank' style={{color: '#c61316', marginRight: 5}}>{`@${mention.name}`}</Typography.Link>
                    ))}
                  </Typography.Text>
                </>
              ) : null
            }
          </div>
        </Space>
      )
    },{
      title: 'Requester',
      dataIndex: 'Requester',
      width: '16%',
      sorter: true,
      render: (val) => <div style={{minWidth: 180}}><UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /></div>
    },{
      title: 'Assgined To',
      dataIndex: 'PendingWith',
      width: '16%',
      sorter: true,
      render: (val, record) => <div style={{minWidth: 180}}><UserColumnInTable Mail={val?.Mail || record.ClosedBy?.Mail} DisplayName={val?.DisplayName || record.ClosedBy?.DisplayName} /></div>
    },{
      title: 'Status',
      dataIndex: 'Status',
      width: '8%',
    },{
      title: 'Request Type',
      dataIndex: 'RequestType',
      sorter: true,
      width: '10%',
    }
  ];



  const ControlPanel = (
    <Space direction='horizontal'>
      <Button size='small' onClick={() => setIsFilterActive(!isFilterActive)} icon={isFilterActive ? <CloseCircleOutlined /> : <FilterOutlined />}>{isFilterActive ? 'Remove Filter' : 'Apply Filter'}</Button>
      <Button
        size='small' 
        type='primary' 
        onClick={() => window.open(`${apiUrl}/Tracking/ExportData?ServiceRequestId=&ClosedBy=&EmailAddress=&RequestType=&PendingWith=&CreatedFrom=&CreatedTo=`, "_blank")}
      >
        <FileExcelOutlined /> Export
      </Button>
      <Button type='primary' size='small' loading={ITRequests.loading} onClick={_ => fetchData(signal)} icon={<RedoOutlined />}>Refresh</Button>
    </Space>
  );


  return (
    <div className="table-page-container it-service-requests-table-container" style={{top: 0, marginBottom: 0, padding: 0, minHeight: "initial"}}>
      <div className='content'>
        <div className="header" style={{borderRadius: 0}}>
          <h1>IT Service Requests</h1>
          <div>{ControlPanel}</div>
        </div>

        <div className='form' style={{overflowX: 'auto', padding: 0}}>
          <Table
            columns={columns}
            dataSource={ITRequests.data}
            pagination={ITRequests.tableParams.pagination}
            loading={ITRequests.loading}
            onChange={handleTableChange}
            showSorterTooltip={false}
            rowClassName={(record, index) => (
              record.Status === "PROCESSING"
                ? "PROCESSING"
              : record.Status === "Waiting For Approval"
                ? "Waiting_For_Approval"
              : record.Status === "SUBMITTED"
                ? "SUBMITTED"
              : ""
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default ServicesRequests