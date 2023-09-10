import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppCtx, apiUrl } from '../../../../App';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import useIsAdmin from '../../../../Hooks/useIsAdmin';
import { PreviewItServiceRequest as TicketViewer } from "salic-react-components";
import GetIssuesTypes from '../../API/GetIssuesTypes';
import axios from 'axios';


function PreviewITServiceRequest({ isAdmin, issueTypes }) {
  let { id } = useParams();
  const { user_data, communicationList, setCommunicationList } = useContext(AppCtx);
  const navigate = useNavigate();


  const fetchCommunications = async () => {
    try {
      const response = await axios.get(`${apiUrl}/User/GetCommunicationList`);
      setCommunicationList(response.data?.Data || []);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if(communicationList.length === 0) {
      fetchCommunications();
    }
  }, []);


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate("/services-requests")}>IT Service Center</a>
        {isAdmin && <a onClick={() => navigate("/services-requests/service-requests-dashboard#service-requests")}>Service Requests Dashboard</a>}
        <p>Preview IT Service Request</p>
      </HistoryNavigation>
      
      <div className='standard-page'>
        <TicketViewer
          TicketId={id}
          Email={user_data?.Data?.Mail}
          IsAdmin={isAdmin}
          IssueTypes={issueTypes || []}
          organizationUsers={communicationList?.map(user => ({ email: user.email, displayname: user.name }))}
          handleAfterDeleteRequest={() => navigate("/services-requests/service-requests-dashboard#service-requests")}
        />
      </div>
    </>
    
  )
}


const Index = () => {
  const { user_data } = useContext(AppCtx);
  const [isAdmin, checkIsAdmin, admins, fetchAdmins, loading] = useIsAdmin('IT_Admin');
  const [issueTypes, setIssueTypes] = useState([]);

  const GetIssuesFromSP = async () => {
    const response = await GetIssuesTypes();
    return response;
  }
  useEffect(() => { GetIssuesFromSP().then(res => setIssueTypes(res)) }, []);


  if (loading || Object.keys(user_data)?.length === 0 || issueTypes?.length === 0) return null;
  return <PreviewITServiceRequest isAdmin={isAdmin} issueTypes={issueTypes} />;
}


export default Index;