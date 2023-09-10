import { Button } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx, apiUrl } from '../../App';
import HistoryNavigation from "../../Global/HistoryNavigation/HistoryNavigation";
import RequestsTable from '../../Global/RequestsComponents/RequestsTable';
import moment from 'moment';
import UserColumnInTable from '../../Global/UserColumnInTable/UserColumnInTable';
import axios from 'axios';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
// import { riskType } from '../risksTypes'
import { PlusCircleOutlined } from '@ant-design/icons';
import pnp from 'sp-pnp-js';



const MyReports = () => {
  const { user_data, defualt_route, myIncidentReports, setMyIncidentReports } = useContext(AppCtx);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [incidentsTypes, setIncidentsTypes] = useState([]);
  
  const FetchData = async () => {
    const response = await axios.get(`${apiUrl}/Incidents/Get?Email=${user_data?.Data?.Mail}&draw=1&order[0][column]=0&order[0][dir]=asc&start=0&length=-1&search[value]=&search[regex]=false&SortBy=CreatedAt&Method=desc&query=&_=1669561213357`);
    setMyIncidentReports(response.data.Data);
    setLoading(false);
  }
  const FetchIncidentsTypes = async () => {
    const response = await pnp.sp.web.lists.getByTitle('Incident Types').items.select('Title', 'Type_Id', 'Incident', 'Incident_Id').get();
    const _data = [];
    response.forEach(row => {
      if(!_data.some(x => x.Type == row.Type_Id)) {
        _data.push({
          Name: row.Title,
          Type: row.Type_Id,
          Incident: response.filter(x => x.Type_Id == row.Type_Id).map(x => ({ name: x.Incident, id: x.Incident_Id }))  
        });
      }
    });
    setIncidentsTypes(_data);
  }

  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      FetchData();
    }
  }, [user_data]);
  useEffect(() => { FetchIncidentsTypes() }, []);
  
  const ControlPanel = (
    <Button 
      type='primary'
      size='small'
      onClick={() => navigate('/incidents-center/new-report')}
    >
      <PlusCircleOutlined /> Add Incident Report
    </Button>
  );

  const columns = [
    {
      title: 'Operational #',
      dataIndex: 'Number',
      width: '7%',
      render: (val, record) => <a href={defualt_route + "/incidents-center/report/" + record.Id} target="_blank">
        {val}
      </a>
    },{
      title: 'Incident Date',
      dataIndex: 'IncidentDate',
      width: '10%',
      render: (val) => moment(val).format('MM/DD/YYYY')
    },{
      title: 'Discovery Date',
      dataIndex: 'DiscoveryDate',
      width: '10%',
      render: (val) => moment(val).format('MM/DD/YYYY')
    },{
      title: 'Risk Type',
      dataIndex: 'RiskType',
      width: '20%',
      render: (val) => incidentsTypes.filter(row => row.Type == val)[0]?.Name
    },{
      title: 'Incident Type',
      dataIndex: 'IncidentType',
      width: '20%',
      render: (val, record) => incidentsTypes.filter(row => row.Type == record.RiskType)[0]?.Incident.filter(x=> x.id == record.IncidentType)[0].name
    },{
      title: 'Submitter',
      dataIndex: 'Requester',
      width: '15%',
      render: (val) => <UserColumnInTable Mail={val?.Mail} DisplayName={val?.DisplayName} />
    },{
      title: 'Status',
      dataIndex: 'Status',
      width: '10%',
      render: (val) => <>{val?.replace(/[_]/g,' ')}</>
    }
  ];


  
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`/incidents-center`)}>Risk Center</a>
        <p>My Requests</p>
      </HistoryNavigation>

      {
        !loading
        ? (
          <div>
            <RequestsTable
              Title="Operational Risk Management"
              HeaderControlPanel={ControlPanel}
              IsLoading={loading}
              Columns={columns}
              DataTable={myIncidentReports}
            />
          </div>
        )
        : <AntdLoader />
      }
      

    </>
  )
}



export default MyReports