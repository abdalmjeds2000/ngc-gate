import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Table, Typography, message } from 'antd';
import { InfoCircleOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import UserColumnInTable from '../../../../Global/UserColumnInTable/UserColumnInTable';
import { AppCtx, apiUrl } from '../../../../App';
import moment from 'moment';
import ProtectRouteIT from '../../../../../Routers/ProtectRoutes/ProtectRouteIT';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';
import axios from 'axios';


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
  loading: false,
  search: '',
  draw: 0,
}

function CancelledRequests() {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [state, setState] = useState(initialStat);

  async function GetRequests(signal) {
    try {
      setState({ ...state, loading: true });
      const orderBy = (state.tableParams?.field && state.tableParams.order) ? `${state.tableParams.field} ${state.tableParams.order === 'ascend' ? 'asc' : 'desc'}` : 'Status desc';
      const response = await axios.get(`${apiUrl}/tracking/cancelled?draw=${state.draw}&order=${orderBy}&start=0&length=-1&query=${state.search}`, { signal })
      setState(prev => ({
        ...prev,
        draw: prev.draw + 1,
        data: response.data?.Data,
        tableParams: {
          ...prev.tableParams,
          pagination: {
            ...prev.tableParams.pagination,
            total: response.data?.Data?.length,
          },
        },
      }));
    } catch (error) {
      message.error('Error while fetching data');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }

  const controller = new AbortController();
  const signal = controller.signal;
  useEffect(() => {
    GetRequests(signal);
    return () => {controller.abort();};
  }, [state.tableParams.field, state.tableParams.order]);

  const columns = [
    {
      title: 'SR. #',
      dataIndex: 'Id',
      width: '5%',
      sorter: true,
      render: (val) => <b>{`SR[#${val}]`}</b>
    },{
      title: 'Subject',
      dataIndex: 'Subject',
      width: '40%',
      sorter: true,
      render: (val, record) => (
        <Space direction='horizontal' style={{minWidth: 200}}>
          <InfoCircleOutlined style={{color: record.Priority === "1" ? "#0c508c" : "#ff272b"}} /> 
          <Typography.Link href={defualt_route + `/services-requests/${record.Id}`} target='_blank'>{val}</Typography.Link>
        </Space>
      )
    },{
      title: 'Date & Time',
      dataIndex: 'CreatedAt',
      width: '15%',
      sorter: true,
      render: (val) => <div style={{minWidth: 130}}>{moment(val).format('MM/DD/YYYY hh:mm:ss')}</div>
    },{
      title: 'Requester',
      dataIndex: 'Requester',
      width: '18%',
      // sorter: true,
      render: (val) => <div style={{minWidth: 150}}><UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /></div>
    }/* ,{
      title: 'Pending With',
      dataIndex: 'PendingWith',
      width: '16%',
      render: (val) => val ? <UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /> : '-'
    } */,{
      title: 'Status',
      dataIndex: 'Status',
      width: '11%',
      sorter: true,
    },{
      title: 'Request Type',
      dataIndex: 'RequestType',
      width: '11%',
      sorter: true,
    }
  ];


  const handleTableChange = (pagination, filters, sorter) => {
    if(sorter.field === 'Requester') sorter.field = 'Requester.DisplayName';
    // if(sorter.field === 'PendingWith') sorter.field = 'PendingWith.DisplayName';
    setState(prev => ({
      ...prev,
      tableParams: {
        ...prev.tableParams,
        filters,
        ...sorter,
      },
    }));
  };
  const ControlPanel = (
    <Space direction='horizontal'>
      <Button size='small' loading={state.loading} onClick={_ => GetRequests(signal)}><RedoOutlined /> Refresh</Button>
      <Button size='small' disabled={state.loading} type='primary' onClick={() => navigate(defualt_route+'/services-requests/services-request')} icon={<PlusOutlined />}>New Request</Button>
    </Space>
  )
  
  return (
    <ProtectRouteIT>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/services-requests`)}>IT Services Center</a>
        <p>Cancelled Requests</p>
      </HistoryNavigation>

      <div className="table-page-container">
        <div className='content'>
          <div className="header">
            <h1>IT Service Requests</h1>
            <div>{ControlPanel}</div>
          </div>

          <div className='form'>
            <Table
              columns={columns}
              dataSource={state.data}
              pagination={
                // hide if data for one page only
                state.tableParams.pagination.total <= state.tableParams.pagination.pageSize ? false : state.tableParams.pagination
              }
              loading={state.loading}
              onChange={handleTableChange}
              showSorterTooltip={false}
            />
          </div>
        </div>
      </div>
    </ProtectRouteIT>
  )
}


const Index = () => {
  const { user_data } = useContext(AppCtx);

  if(Object.keys(user_data).length === 0) return <AntdLoader />
  return <CancelledRequests />
}


export default Index