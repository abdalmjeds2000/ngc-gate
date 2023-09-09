import React, { useContext, useEffect, useState } from 'react';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx, apiUrl } from '../../App';
import { Alert, Steps } from 'antd';
import { FileDoneOutlined, UsergroupAddOutlined, WarningOutlined } from '@ant-design/icons';
import axios from 'axios';
import IncidentInfo from './PreviewIncidentReport/IncidentInfo';
import Assigning from './PreviewIncidentReport/Assigning';
import DepartmentFeedback from './PreviewIncidentReport/DepartmentFeedback';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../../Hooks/useIsAdmin';
import CloseAction from './PreviewIncidentReport/CloseAction';





const PreviewIncidentReport = ({ isRiskAdmin }) => {
  const { id } = useParams();
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reportData, setReportData] = useState({});

  const getReportById = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Incidents/GetById?Id=${id}`)
      setReportData(response?.data?.Data);
      document.title = `.:: NGC Gate | Incident Report #${response.data.Data.Number} ::.`;
      return response?.data?.Data;
    } catch (error) {
      setError(true);
    }
  }
  useEffect(() => {
    if(id) {
      setLoading(true);
      getReportById()
      .then(() => setLoading(false))
      
    } else {
      navigate(defualt_route + "/incidents-center");
    }
  }, []);

  const isClosed = ["CLOSED", "CLOSEDEARLY"].includes(reportData?.Status);
  const currentDepFeedbackData = reportData?.Assignees?.filter(item => item?.ToUser?.Mail?.toLowerCase() == user_data?.Data?.Mail?.toLowerCase())?.[0];

  const stepsItems = [
    { 
      status: 'finish', title: <span style={{fontSize: '1.2rem'}}>Application</span>, 
      content: <IncidentInfo reportData={reportData} />, 
      icon: <WarningOutlined />
    },{
      status: 'finish', title: <span style={{fontSize: '1.2rem'}}>Responsible Departments</span>,
      content: <Assigning reportData={reportData} onFinish={getReportById} />,
      icon: <UsergroupAddOutlined />,
      disabled: reportData?.Status === 'REVIEW' && !isRiskAdmin,
    },(currentDepFeedbackData ? {
      status: 'finish', title: <span style={{fontSize: '1.2rem'}}>Departments Feedback</span>,
      content: <DepartmentFeedback reportData={reportData} formData={currentDepFeedbackData || {}} onFinish={getReportById} />,
      icon: <FileDoneOutlined />,
      // disabled: currentDepFeedbackData ? false : true,
    } : null)
  ];


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/incidents-center`)}>Risk Center</a>
        <p>New Incident Report :: #{reportData?.Number || '???'}</p>
      </HistoryNavigation>

      <div className="standard-page">
        <div className='preview-incident-container'>
          {
            (!loading && !error) &&
              <div className='header hide-scrollbar'>
                <Steps
                  items={stepsItems}
                  current={current}
                  onChange={setCurrent}
                  className="site-navigation-steps"
                />
                {isRiskAdmin && !isClosed ? <CloseAction reportData={reportData} onSuccess={getReportById} /> : null}
              </div>
          }
          
          <div className="content">
            {loading && <AntdLoader />}
            {error && <Alert
                        message="Error" type="error" showIcon style={{margin: "25px"}}
                        description="Something is wrong, please check that the link above is correct or make sure you are connected to the Internet." />}
            {(!loading && !error) ? stepsItems[current]?.content : null}
          </div>
        </div>
      </div>
    </>
  )
}

const Index = () => {
  const [isRiskAdmin, checkIsAdmin, admins, fetchAdmins, loading] = useIsAdmin('Incident_Admin');

  if(loading) return <AntdLoader />;
  return <PreviewIncidentReport isRiskAdmin={isRiskAdmin} />;
}

export default Index