import React, { useContext, useRef, useState } from 'react';
import ProtectRouteIT from '../../../../../Routers/ProtectRoutes/ProtectRouteIT';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../../../../App';
import { useNavigate } from 'react-router-dom';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';
import TeamTree from './teamTree/TeamTree';
import Tabs from '../../../../Global/CustomTabs/Tabs';
import { Button, DatePicker, Tooltip, Typography } from 'antd';
import { AreaChartOutlined, CalendarOutlined, ExpandAltOutlined, FundProjectionScreenOutlined, NodeCollapseOutlined, TableOutlined, UserSwitchOutlined } from '@ant-design/icons';
import moment from "moment";
// import ToggleButton from '../../../../Global/ToggleButton';
import { TiFlowChildren } from 'react-icons/ti';
import ServicesRequests from './pages/RequestsTable/ServicesRequests';
import ITDashboard from './pages/SRDashboard/ITDashboard';
import ERCRDashboard from './pages/CR&ERDashboard/ERCRDashboard';
import './index.styles.css';
import { ToggleButton } from 'salic-react-components';



export const colors = ["#1746A2", "#23BB99", "#526D82", "#3a9bcc", "#4A55A2", "#E98EAD", "#C44633", "#FFC26F"];
const initDatesFilter = { active: false, from: null, to: null };

const Main = () => {
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  function allChildren(treeData, flatData = []) {
    treeData.forEach(node => {
      flatData.push(node);
      if (node?.DirectUsers?.length !== 0) {
        allChildren(node.DirectUsers, flatData);
      }
    });
    return flatData;
  }
  const allUsers = allChildren([user_data?.Data]);
  const [selectedUsers, setSelectedUsers] = useState(allUsers);
  const [datesFilter, setDatesFilter] = useState(initDatesFilter);
  const [showTreeNames, setShowTreeNames] = useState(true);

  console.log(allUsers, allUsers.map(u => u?.Id));

  const treeRef = useRef();
  const handleShowTree = (e) => {
    treeRef.current.style.display = treeRef.current.style.display != "none" ? "none" : "block";
  }

  const datesParams = datesFilter.active ? { from: datesFilter.from, to: datesFilter.to } : {};
  const usersParams = selectedUsers.length > 0 ? { users: selectedUsers.map(u => u.Mail) } : {};
  const params = { ...datesParams, ...usersParams };

  return (
    <ProtectRouteIT>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/services-requests`)}>IT Service Center</a>
        <p>Service Requests Dashboard</p>
      </HistoryNavigation>

      <div className='standard-page service-requests-dashboard-container'>
        {
          user_data?.Data?.DirectUsers?.length > 0 && (
            <div className='employees-tree'>
              <div style={{display:showTreeNames?"flex":"block", justifyContent:"space-between",alignItems:"center",marginBottom:10,padding:"8px 14px 4px",backgroundColor:"#f4f4f4",borderBottom:"1.5px solid #dedede"}}>
                {showTreeNames && <Typography.Text strong style={{display: 'block', fontSize: '1.1rem'}}>
                  IT Members
                </Typography.Text>}
                <span className='toggle-names-btn'>
                  <ToggleButton
                    icon={showTreeNames ? <NodeCollapseOutlined /> : <ExpandAltOutlined />}
                    title="Minimize Employees Names"
                    btnSize='middle'
                    btnType='default'
                    callback={() => setShowTreeNames(!showTreeNames)}
                  />
                </span>
                <span className='expand-tree-btn'>
                  <ToggleButton
                    icon={<TiFlowChildren />}
                    title="Show Employees Tree"
                    btnSize='middle'
                    btnType='default'
                    callback={handleShowTree}
                  />
                </span>
              </div>
              <div className='tree-container' ref={treeRef}>
                <TeamTree showNames={showTreeNames} allKeys={allUsers.map(u => u?.Id)} treeData={[user_data?.Data]} setSelectedUsers={setSelectedUsers} />
              </div>
            </div>
          )
        }

        <div style={{width:"100%"}}>
          <Tabs
            rightOfTabs={<DatesFilter setDates={setDatesFilter} />}
            items={[
              {
                key: "service-requests",
                icon: <TableOutlined />, 
                title: 'Service Requests', 
                content: <ServicesRequests params={params} />,
              },{
                key: "sr-dashboard",
                icon: <FundProjectionScreenOutlined />, 
                title: "SR's Dashboard", 
                content: <ITDashboard params={params} />,
              },{
                key: "er-cr-dashboard",
                icon: <AreaChartOutlined />, 
                title: "CR's & ER's Dashboard", 
                content: <ERCRDashboard params={params} />,
              }
            ]}
          />
        </div>
      </div>
    </ProtectRouteIT>
  )
}

const DatesFilter = ({ setDates }) => {
  const [active, setActive] = useState(false);

  if(!active) return (
    <Tooltip title="Filter by dates">
      <Button type='link' icon={<CalendarOutlined />} onClick={() => setActive(true)} style={{ backgroundColor: '#fff', boxShadow: '0 3px 5px var(--third-color)' }}>
        All Time
      </Button>
    </Tooltip>
  )
  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <Button type='link' danger onClick={() => {setActive(false); setDates(initDatesFilter);} }>Clear</Button>
      <DatePicker.RangePicker
        allowClear={false}
        style={{ width: 240 }}
        format="MM/DD/YYYY"
        onChange={(date, dateString) => {
          setDates({ active: true, from: dateString[0], to: dateString[1] })
        }}
        ranges={{
          Today: [moment(), moment()],
          'Last 7 Days': [moment().subtract(7, 'days'), moment()],
          'Last 30 Days': [moment().subtract(30, 'days'), moment()],
          'Last 90 Days': [moment().subtract(90, 'days'), moment()],
          'Last 180 Days': [moment().subtract(180, 'days'), moment()],
          'Last 365 Days': [moment().subtract(365, 'days'), moment()],
        }}
      />
    </span>
  )
}


const index = () => {
  const { user_data } = useContext(AppCtx);
  if(Object.keys(user_data)?.length === 0) return <AntdLoader />;
  return <Main />;
}


export default index
