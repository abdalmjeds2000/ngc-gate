import React, { useContext, useEffect, useState } from "react";
import FormPageTemplate from "../../../components/FormPageTemplate/FormPage";
import HistoryNavigation from "../../../../Global/HistoryNavigation/HistoryNavigation";
import { useNavigate } from "react-router-dom";
import { AppCtx } from "../../../../App";
import GetIssuesTypes from '../../API/GetIssuesTypes';
import { ITServiceRequestForm } from "salic-react-components";


function NewITRequest() {
  const { user_data } = useContext(AppCtx);
  let navigate = useNavigate();
  const [issueTypes, setIssueTypes] = useState([]);

  const GetIssuesFromSP = async () => {
    const response = await GetIssuesTypes();
    return response;
  }
  useEffect(() => {
    GetIssuesFromSP().then(res => setIssueTypes(res))
  }, []);

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate("/services-requests")}>IT Service Center</a>
        <p>New Service Request</p>
      </HistoryNavigation>

      <FormPageTemplate
        pageTitle="Service Request"
        tipsList={[
          "Fill out required fields carefully.",
          "If Possile upload captured images for the problem.",
          "Be specific in describing the problem you are facing. Please do not write fussy words or incomplete statements.",
          "Be specific in choosing 'Issue Category' as the system will assign SR. to the appropriate team member.",
        ]}
      >
        <ITServiceRequestForm
          listOfIssue={issueTypes}
          Email={user_data?.Data?.Mail}
          Source="WEB"
        />
      </FormPageTemplate>
    </>
  );
}

export default NewITRequest;
