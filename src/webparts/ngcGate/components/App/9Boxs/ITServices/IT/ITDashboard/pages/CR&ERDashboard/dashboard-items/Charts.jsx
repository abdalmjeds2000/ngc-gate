import React, { useContext } from "react";
import axios from "axios";
import Card from "../../../../../../../Global/Card/Card";
import moment from "moment";
import { Bar, Pie } from "@ant-design/plots";
import { Avatar, Badge, Segmented, Skeleton, Space, Table, Typography } from "antd";
import { colors } from '../../../index';
import UserColumnInTable from "../../../../../../../Global/UserColumnInTable/UserColumnInTable";
import { CalendarOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { AppCtx } from "../../../../../../../App";
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { MdAccessTime } from "react-icons/md";
import { FiTarget } from "react-icons/fi";
import "./cr-er.styles.css";

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { CgPerformance } from "react-icons/cg";


const sceletonLoader = (
  <div>
    <Skeleton.Button active block shape="default" /> <br /><br />
    <Skeleton.Button active block shape="default" /> <br /><br />
    <Skeleton.Button active block shape="default" /> <br /><br />
    <Skeleton.Button active block shape="default" /> <br /><br />
  </div>
);
const legendSettings = {
  position: 'bottom',
  // maxRow: 10,
  itemName: {
    style: {
      fontSize: 16,
    }
  }
}

export const DepartmentStats = ({ paramsFilter, className }) => {
  const [state, setState] = React.useState({ data: [], loading: true });
  const getData = async (signal) => {
    setState({ data: state.data, loading: true });
    try {
      const joinedParams = Object.entries(paramsFilter).map(([key, value]) => `${key}=${value}`).join('&');
      const response = await axios.get(`https://salicapi.com/api/ChangeRequests/ByDepartment?${joinedParams}`, { signal });
      setState({ data: response.data, loading: false });
    } catch (error) {
      // message.error("Failed to load Department Stats");
    }
  }
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getData(signal);
    return () => {controller.abort();};
  }, [JSON.stringify(paramsFilter)]);

  const config = {
    data: state?.data,
    xField: 'count',
    yField: 'name',
    seriesField: 'name',
    color: colors,
    // barWidthRatio: 0.8,
    label: {
      position: 'right',
      style: {
        fill: '#000',
        fontSize: 10,
      },
    },
    yAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
        autoEllipsis: true,
      },
    },
    xAxis: {
      grid: {
        line: false
      }
    },
    legend: false,
  };

  return (
    <Card label="By Department" className={className}>
      {state.loading ? sceletonLoader : <Bar {...config} />}
    </Card>
  )
}
export const ByPriority = ({ paramsFilter,className }) => {
  const [state, setState] = React.useState({ data: [], loading: true });
  const getData = async (signal) => {
    setState({ data: state.data, loading: true });
    try {
      const joinedParams = Object.entries(paramsFilter).map(([key, value]) => `${key}=${value}`).join('&');
      const response = await axios.get(`https://salicapi.com/api/ChangeRequests/ByPriority?${joinedParams}`, { signal });
      setState({ data: response.data?.Data, loading: false });
    } catch (error) {
      // message.error("Failed to load By Priority data");
    }
  }
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getData(signal);
    return () => {controller.abort();};
  }, [JSON.stringify(paramsFilter)]);

  const config = {
    data: state?.data,
    angleField: 'Count',
    colorField: 'Title',
    radius: 0.8,
    innerRadius: 0.7,
    appendPadding: 0,
    color: ({ Title }) => {
      if (Title === "Critical") {
        return "#C44633";
      } 
      return "#1746A2";
    },
    statistic: {
      title: false,
    },
    legend: legendSettings,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
    animation: {
      appear: {
        animation: 'none',
      },
    },
  };
  
  return (
    <Card label="By Priority" className={className}>
      {state.loading ? sceletonLoader : <Pie {...config} />}
    </Card>
  )
}
export const ByClassification = ({ paramsFilter,className }) => {
  const [state, setState] = React.useState({ data: [], loading: true });
  const getData = async (signal) => {
    setState({ data: state.data, loading: true });
    try {
      const joinedParams = Object.entries(paramsFilter).map(([key, value]) => `${key}=${value}`).join('&');
      const response = await axios.get(`https://salicapi.com/api/ChangeRequests/ByClassification?${joinedParams}`, { signal });
      setState({ data: response.data, loading: false });
    } catch (error) {
      // message.error("Failed to load By Priority data");
    }
  }
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getData(signal);
    return () => {controller.abort();};
  }, [JSON.stringify(paramsFilter)]);

  const config = {
    data: state?.data,
    angleField: 'Count',
    colorField: 'Title',
    radius: 0.8,
    innerRadius: 0.7,
    appendPadding: 0,
    color: ({ Title }) => {
      if (Title === "Medium") {
        return "#FFC26F";
      } else if (Title === "Major") {
        return "#C44633";
      } else if (Title === "Minor") {
        return "#1746A2";
      }
      return "#3a9bcc";
    },
    statistic: {
      title: false,
    },
    
    legend: legendSettings,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
    animation: {
      appear: {
        animation: 'none',
      },
    },
  };
  
  return (
    <Card label="By Classification" className={className}>
      {state.loading ? sceletonLoader : <Pie {...config} />}
    </Card>
  )
}


const initialStat = {
  data: [],
  tableParams: {
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
      position: ['none', 'bottomCenter'], style: {padding: '25px 0'},
      pageSizeOptions: [10, 20, 24, 50, 100]
    },
  },
  from: '',
  to: '',
  loading: false,
  search: '',
  draw: 1,
}


const RequestCard = ({ 
  type,
  id,
  subject,
  createdAt,
  startDate,
  expectedEndDate,
  createdBy,
  pendingWith,
  progress,
  perc,
  status,
  priorit,
  classification,
  uniqueCode
}) => {
  const { defualt_route, sp_site } = useContext(AppCtx);
  const userAvatarURL = `${sp_site}/_layouts/15/userphoto.aspx?size=M&username=`;


  const Lbl = ({ label, value, icon }) => (
    <div className="item" title={`${label}: ${value}`}>
      <div style={{marginRight: 4, backgroundColor: "#eee", color: "#aaa", width: 40, height: 40, overflow: "hidden", borderRadius: 99, display:"flex",alignItems:"center",justifyContent:"center"}}>
        {icon}
      </div>
      <div>
        <Typography.Text type="secondary" style={{display: "block", whiteSpace: "nowrap", fontSize: "0.9rem", lineHeight: 1}}>{label}</Typography.Text>
        <Typography.Text style={{display: "block", whiteSpace: "nowrap", fontSize: "1.1rem"}}>{value || "-"}</Typography.Text>
      </div>
    </div>
  )
  return (
    <div className="er-cr_card keen-slider__slide">
      <div className="main">
        <div className="header">
          <div className="meta">
            <span className={`meta_priority ${priorit === "1" ? "info" : "danger"}`} title={`Priority: ${priorit === "1" ? "Normal" : "High"}`}>
              {priorit === "1" ? <><FaCaretDown /> NORMAL PRIORITY</>
                : priorit === "2" ? <><FaCaretUp /> HIGH PRIORITY</>
                : null}
            </span>
            {/* <span className={`meta_status ${perc < 60 ? "bg-info" : perc < 80 ? "bg-warning" : "bg-danger"}`}>{perc < 60 ? "On Time" : perc < 80 ? "Late" : "Too Late"}</span> */}
          </div>
          <Typography.Link title={`Subject: ${subject}`} className="title" target="_blank" href={defualt_route + `/services-requests/${id}`}>
            {uniqueCode ? `${uniqueCode} :: ` : null}{subject}
          </Typography.Link>
          <div className="progress" title={`Progress: ${Math.floor(progress)}%`}>
            <p className={`progress_label ${progress < 35 ? "danger" : progress < 70 ? "warning" : "info"}`}>
              {progress||0}%
            </p>
            <div className="progress_bar">
              <div className={`progress_bar_inner ${progress < 35 ? "bg-danger" : progress < 70 ? "bg-warning" : "bg-info"}`} style={{width: `${progress||2}%`}} />
            </div>
          </div>
        </div>
        <div className="body">
          <div className="labels">
            <Lbl
              label="Start Date" 
              value={startDate || "-"}
              icon={<MdAccessTime size={24} />}
            />
            <Lbl
              label="Expected End Date"
              value={expectedEndDate || "-"}
              icon={<FiTarget size={24} />}
            />
            <Lbl
              label="Pending With"
              value={pendingWith?.DisplayName || "-"}
              icon={<Avatar src={userAvatarURL+pendingWith?.Mail} size={35} />}
            />
            <Lbl
              label="Classification"
              value={
                <><Badge dot color={classification==="Major"?"var(--brand-red-color)":classification==="Minor"?"var(--second-color)":classification==="Medium"?"var(--brand-orange-color)":""} /> {classification}</>
                // <span className={`${classification==="Major"?"danger":classification==="Minor"?"info":classification==="Medium"?"warning":""}`}>{classification}</span> || "-"
              }
              icon={<CgPerformance size={24} />}
            />
          </div>
        </div>
      </div>

      <div className="footer">
        <span className="createdby" title={`Creted By: ${createdBy?.DisplayName}`}>
          <Avatar src={userAvatarURL+createdBy?.Mail} size={26} style={{marginRight: 5}} />
          <p>{createdBy?.DisplayName}</p>
        </span>
        <Typography.Text title={`Created At: ${createdAt}`} type="secondary" style={{fontSize: "0.8rem"}}>at {createdAt}</Typography.Text>
      </div>
    </div>
  )
}
export const RequestsList = ({ paramsFilter, className }) => {
  const { defualt_route } = useContext(AppCtx);
  const { users, from, to } = paramsFilter;
  const [pendingState, setPendingState] = React.useState({ data: [], loading: true });
  const [closedState, setClosedState] = React.useState(initialStat);
  const [cancelledState, setCancelledState] = React.useState(initialStat);
  const [reStatus, setReStatus] = React.useState("Pending");
  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    breakpoints: {
      "(min-width: 992px)": {
        slides: { perView: 2, spacing: 5 },
      },
      "(min-width: 1600px)": {
        slides: { perView: 3, spacing: 10 },
      },
      "(min-width: 2000px)": {
        slides: { perView: 4, spacing: 10 },
      },
    },
    slides: { perView: 1 },
  });
  
  const getPending = async (signal) => {
    setPendingState({ data: pendingState.data, loading: true });
    try {
      const response = await axios.get(`https://salicapi.com/api/ChangeRequests/Pending?from=${from || ""}&to=${to || ""}`, { signal });
      setPendingState({ data: response.data, loading: false });
    } catch (error) {
      // message.error("Failed to load By Type data");
    }
  }
  const getClosed = async (signal) => {
    const skipItems = closedState.tableParams.pagination.pageSize * (closedState.tableParams.pagination.current - 1);
    const takeItems = closedState.tableParams.pagination.pageSize;
    const orderBy = (closedState.tableParams?.field && closedState.tableParams.order) ? `${closedState.tableParams.field} ${closedState.tableParams.order === 'ascend' ? 'asc' : 'desc'}` : 'Id desc';
    const _emails = users ? users?.join(",") : "";
    try {
      setClosedState(prev => ({ ...prev, loading: true }));
      await axios.get(`https://salicapi.com/api/ChangeRequests/Get?draw=${closedState.draw}&order=${orderBy}&start=${skipItems}&length=${takeItems}&from=${from || ''}&to=${to || ''}&email=${_emails}&query=status:closed`, { signal: signal })
        .then((res) => {
          setClosedState(prev => ({
            ...prev,
            draw: prev.draw + 1,
            data: res.data?.data,
            tableParams: {
              ...prev.tableParams,
              pagination: {
                ...prev.tableParams.pagination,
                total: res.data.recordsTotal,
              },
            },
          }));
        })
    } catch (error) {
      console.log(error);
    } finally {
      setClosedState(prev => ({ ...prev, loading: false }));
    }
  }
  const getCancelled = async (signal) => {
    const skipItems = cancelledState.tableParams.pagination.pageSize * (cancelledState.tableParams.pagination.current - 1);
    const takeItems = cancelledState.tableParams.pagination.pageSize;
    const orderBy = (cancelledState.tableParams?.field && cancelledState.tableParams.order) ? `${cancelledState.tableParams.field} ${cancelledState.tableParams.order === 'ascend' ? 'asc' : 'desc'}` : 'Id desc';
    const _emails = users ? users?.join(",") : "";
    try {
      setCancelledState(prev => ({ ...prev, loading: true }));
      await axios.get(`https://salicapi.com/api/ChangeRequests/Get?draw=${cancelledState.draw}&order=${orderBy}&start=${skipItems}&length=${takeItems}&from=${from || ''}&to=${to || ''}&email=${_emails}&query=status:cancelled`, { signal: signal })
        .then((res) => {
          setCancelledState(prev => ({
            ...prev,
            draw: prev.draw + 1,
            data: res.data?.data,
            tableParams: {
              ...prev.tableParams,
              pagination: {
                ...prev.tableParams.pagination,
                total: res.data.recordsTotal,
              },
            },
          }));
        })
    } catch (error) {
      console.log(error);
    } finally {
      setCancelledState(prev => ({ ...prev, loading: false }));
    }
  }

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getPending(signal);
    return () => {controller.abort();};
  }, [from, to]);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getClosed(signal);
    return () => {controller.abort();};
  }, [closedState.search, JSON.stringify(paramsFilter), JSON.stringify(paramsFilter), closedState.tableParams.pagination.current, closedState.tableParams.pagination.pageSize, closedState.tableParams.field, closedState.tableParams.order]);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getCancelled(signal);
    return () => {controller.abort();};
  }, [cancelledState.search, JSON.stringify(paramsFilter), JSON.stringify(paramsFilter), cancelledState.tableParams.pagination.current, cancelledState.tableParams.pagination.pageSize, cancelledState.tableParams.field, cancelledState.tableParams.order]);




  const columns = [
    {
      title: 'SR. #',
      dataIndex: 'Id',
      width: '5%',
      sorter: true,
      render: (val, record) => (
        <Typography.Link href={defualt_route + `/services-requests/${record.Id}`} target="_blank">
          {`#${val}`}
        </Typography.Link>
      )
    },{
      title: 'Subject',
      dataIndex: 'Subject',
      width: '35%',
      sorter: true,
      render: (val, record) => (
        <Space direction='horizontal' style={{minWidth: 220}}>
          <InfoCircleOutlined style={{color: record.Priority === "1" ? "var(--main-color)" : "--brand-red-color"}} /> 
          <div>
            <Typography.Link href={defualt_route + `/services-requests/${record.Id}`} target="_blank">
              {val}
            </Typography.Link>
            {
              record.Tags && Array.isArray(record?.Tags) && record?.Tags?.length > 0 ? (
                <>
                  <br />
                  <Typography.Text type='secondary' style={{fontSize: 12}}>
                    {record?.Tags?.map((mention, index) => (
                      <Typography.Link key={index} href={`https://salic.sharepoint.com/_layouts/15/me.aspx/?p=${mention?.email}&v=work`} target='_blank' style={{color: '#c61316', marginRight: 5}}>{`@${mention.name}`}</Typography.Link>
                    ))}
                  </Typography.Text>
                </>
              ) : null
            }
          </div>
        </Space>
      )
    },{
      title: 'Date & Time',
      dataIndex: 'CreatedAt',
      width: '12%',
      sorter: true,
      render: (val) => <div style={{minWidth: 140}}>{moment(val).format('MM/DD/YYYY h:mm A')}</div>
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
      title: 'Unique Code',
      dataIndex: 'UniqueCode',
      width: '8%',
    },{
      title: 'Type',
      dataIndex: 'RequestType',
      sorter: true,
      width: '8%',
    }
  ];

  const handleClosedTableChange = (pagination, filters, sorter) => {
    if(sorter.field === 'Requester') sorter.field = 'Requester.DisplayName';
    if(sorter.field === 'PendingWith') sorter.field = 'PendingWith.DisplayName';
    setClosedState(prev => ({
      ...prev,
      tableParams: {
        ...prev.tableParams,
        pagination,
        filters,
        ...sorter,
      },
    }));
  };
  const handleCancelledTableChange = (pagination, filters, sorter) => {
    if(sorter.field === 'Requester') sorter.field = 'Requester.DisplayName';
    if(sorter.field === 'PendingWith') sorter.field = 'PendingWith.DisplayName';
    setCancelledState(prev => ({
      ...prev,
      tableParams: {
        ...prev.tableParams,
        pagination,
        filters,
        ...sorter,
      },
    }));
  };


  return (
    <Card
      label={`ER's & CR's Requests (${reStatus==="Pending" ? pendingState?.data?.length : reStatus==="Closed" ? closedState?.tableParams?.pagination?.total : cancelledState?.tableParams?.pagination?.total})`}
      className={className}
      extra={<Segmented options={["Pending", "Closed", "Cancelled"]} value={reStatus} onChange={setReStatus} disabled={pendingState.loading || closedState.loading} />}
    >
      {
        reStatus === "Pending" ? (
            pendingState.loading
            ? sceletonLoader
            : (
              <div ref={sliderRef} className="keen-slider">
                {
                  pendingState.data.map((item, index) => (
                    <RequestCard
                      key={item?.Id || index}
                      type={item?.RequestType}
                      id={item.Id}
                      subject={item?.Subject}
                      createdAt={item?.CreatedAt ? moment(item?.CreatedAt).format('MM/DD/YYYY h:mm A') : "-"}
                      startDate={item?.StartDate ? moment(item?.StartDate).format('ll') : "-"}
                      expectedEndDate={item?.ExpectedEndDate ? moment(item?.ExpectedEndDate).format('ll') : "-"}
                      createdBy={item?.CreatedBy}
                      pendingWith={item?.PendingWith}
                      progress={Math.floor(item?.Progress)}
                      perc={Math.floor(item?.Percentage)}
                      status={item?.Status}
                      priorit={item?.Priority}
                      classification={item?.ChangeClassification}
                      uniqueCode={item?.UniqueCode}
                    />
                  ))
                }
              </div>
            )
          )
        : reStatus === "Cancelled" ? (
          cancelledState.loading
          ? sceletonLoader
          : (
            <div style={{ maxHeight: 430, overflow: "auto" }}>
              <Table
                columns={columns}
                dataSource={cancelledState.data}
                pagination={cancelledState.tableParams.pagination}
                loading={cancelledState.loading}
                onChange={handleCancelledTableChange}
                size="small"
                showSorterTooltip={false}
              />
            </div>
          )
        )
        : (
          closedState.loading
          ? sceletonLoader
          : (
            <div style={{ maxHeight: 430, overflow: "auto" }}>
              <Table
                columns={columns}
                dataSource={closedState.data}
                pagination={closedState.tableParams.pagination}
                loading={closedState.loading}
                onChange={handleClosedTableChange}
                size="small"
                showSorterTooltip={false}
              />
            </div>
          )
        )
      }
    </Card>
  )
}
