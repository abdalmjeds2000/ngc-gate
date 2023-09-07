import React, { useContext } from 'react';
import { Card, Table, Typography, message } from 'antd';
import moment from 'moment';
import UserColumnInTable from '../../../../Global/UserColumnInTable/UserColumnInTable';
import { useNavigate } from 'react-router-dom';
import { AppCtx, apiUrl } from '../../../../App';
import axios from 'axios';


const CardTitle = (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
    <Typography.Text strong style={{fontSize: '1.2rem'}}>Latest Requests</Typography.Text>
  </div>
);

export const adminTableInitialStat = {
  data: [],
  tableParams: {
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
      position: ['none', 'bottomCenter'], style: {padding: '25px 0'},
      pageSizeOptions: [10, 20, 30, 50, 100]
    },
  },
  loading: false,
  search: '',
  draw: 1,
}

const LatestRequests = ({ dataFor, selectdRequests }) => {
  const { defualt_route, adminDashboardRequests, setAdminDashboardRequests } = useContext(AppCtx);
  const navigate = useNavigate();

  const fetchLatestRequests = async (user, signal) => {
    const skipItems = adminDashboardRequests.tableParams.pagination.pageSize * (adminDashboardRequests.tableParams.pagination.current - 1);
    const takeItems = adminDashboardRequests.tableParams.pagination.pageSize;
    const query = (adminDashboardRequests.search && adminDashboardRequests.search !== "") 
        ? adminDashboardRequests.search 
        : selectdRequests.join(",");
    try {
      setAdminDashboardRequests(prev => ({ ...prev, loading: true }));
      const response = await axios.get(`${apiUrl}/Processes/Get?draw=${adminDashboardRequests.draw}&Email=${user.Mail}&start=${skipItems}&length=${takeItems}&query=${query}`, { signal: signal });
      setAdminDashboardRequests(prev => ({
        ...prev,
        draw: prev.draw + 1,
        data: response.data?.data,
        tableParams: {
          ...prev.tableParams,
          pagination: {
            ...prev.tableParams.pagination,
            total: response.data.recordsTotal,
          },
        },
      }));
    } catch (error) {
      // message.error(error?.message || "Something went wrong");
      console.log(error?.message);
    } finally {
      setAdminDashboardRequests(prev => ({ ...prev, loading: false }));
    }
  }

  // fetch latest requests
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if(Object.keys(dataFor).length > 0) fetchLatestRequests(dataFor, signal);
    return () => {controller.abort();};
  }, [dataFor, selectdRequests, adminDashboardRequests.search, adminDashboardRequests.tableParams.pagination.current, adminDashboardRequests.tableParams.pagination.pageSize]);


  const ToUpdatePage = (RequestType, RequestId) => {
    const Code = RequestType.split("-")[0];
    if(Code === "VISA") {
      navigate(defualt_route + `/admin-services/issuing-VISA/${RequestId}`);
    } else if(Code === "BG") {
      navigate(defualt_route + `/admin-services/business-gate/${RequestId}`);
    } else if(Code === "SHP") {
      navigate(defualt_route + `/admin-services/shipment/${RequestId}`);
    } else if(Code === "SUP") {
      navigate(defualt_route + `/admin-services/office-supply/${RequestId}`);
    } else if(Code === "MAN") {
      navigate(defualt_route + `/admin-services/maintenance/${RequestId}`);
    } else if(Code === "VIS") {
      navigate(defualt_route + `/admin-services/visitor/${RequestId}`);
    } else if(Code === "TS") {
      navigate(defualt_route + `/admin-services/transportation/${RequestId}`);
    }
    return null
  }

  const columns = [
    {
      title: '#Id',
      dataIndex: 'Id',
      width: '5%',
      render: (value, record) => <div style={{ minWidth: 45 }}><a onClick={() => ToUpdatePage(record.ReferenceCode, record.Id)}>{value}</a></div>
    },
    {
      title: 'Ref. Code',
      dataIndex: 'ReferenceCode',
      render: (code, record) => (
        <div style={{ minWidth: 160 }}>
          <a onClick={() => ToUpdatePage(code, record.Id)}>
            {
              record?.Status !== "FIN" && moment(moment()).diff(record.CreatedAt, 'days') >= 2
                ? <span style={{ userSelect: "none", fontSize: "2.5rem", lineHeight: 0, position: "relative", top: 7, color: "var(--brand-orange-color)"}}>•</span>
                : null
            }
            {code}
          </a>
        </div>
      )
    },
    {
      title: 'Name',
      dataIndex: 'ApplicationName',
      render: (value, record) => <div style={{ minWidth: 120 }}><a onClick={() => ToUpdatePage(record.ReferenceCode, record.Id)}>{value}</a></div>
    },
    {
      title: 'Created',
      dataIndex: 'CreatedAt',
      render: (value) => <div style={{ minWidth: 140 }}>{moment(value).format("MM/DD/YYYY HH:mm A")}</div>
    },
    {
      title: 'Requester',
      dataIndex: 'ByUser',
      render: (val) => val ? <UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /> : '-'
    },
    {
      title: 'By',
      dataIndex: 'ToUser',
      render: (val) => val ? <UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} /> : '-'
    },
    // {
    //   title: 'Processing Status',
    //   dataIndex: '',
    //   render: (_, record) => (
    //     <div style={{ minWidth: 120 }}>
    //       {
    //         record?.Status !== "FIN" &&
    //         moment(moment()).diff(record.CreatedAt, 'days') >= 2
    //           ? <Tag color="warning">Delayed</Tag>
    //         : record?.Status === "FIN"
    //           ? <Tag color="success">On Time</Tag>
    //         : null
    //       }
    //     </div>
    //   ),
    // },
    {
      title: 'Closed Date',
      dataIndex: 'Date',
      render: (value, record) => record.Status === "FIN" ? <div style={{ minWidth: 140 }}>{moment(value).format("MM/DD/YYYY HH:mm A")}</div> : null
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      render: (value) => <div>{value === "FIN" ? "Closed" : value === "ACTION" ? "Pending" : value}</div>
    },
  ];

  const handleTableChange = (pagination) => {
    setAdminDashboardRequests(prev => ({
      ...prev,
      tableParams: {
        ...prev.tableParams,
        pagination,
      },
    }));
  };

  return (
    <div>
      <Card bodyStyle={{ padding: 0, overflowX: "auto" }} title={CardTitle}>
        <Table 
          columns={columns} 
          dataSource={adminDashboardRequests.data} 
          // size="small"
          pagination={adminDashboardRequests.tableParams.pagination}
          loading={adminDashboardRequests.loading}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  )
}

export default LatestRequests