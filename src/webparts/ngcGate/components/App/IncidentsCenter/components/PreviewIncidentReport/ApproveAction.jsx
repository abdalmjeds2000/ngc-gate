import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Button, Input, message, notification } from 'antd';
import { AppCtx } from '../../../App';


const ApproveAction = ({ taskConvId, onFinish }) => {
  const { user_data } = useContext(AppCtx);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");


  const handleSubmit = async (action) => {
    const url = action==="approve" ? "https://salicapi.com/api/Incidents/ApproveIncidentTask" : "https://salicapi.com/api/Incidents/RejectIncidentTask";
    if(action==="reject" && (!body || body?.trim() == "")) return message.error("Please, enter a message.");
    try {
      setLoading(true);
      const payload = {
        IncidentIaskConversationId: taskConvId,
        Email: user_data.Data.Mail,
        Body: body,
      }
      await axios.post(url, payload);
      if(onFinish) onFinish();
      notification.success({ message: `Incident Report ${action} Successfully.` });
    } catch (error) {
      message.error("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  }



  return (
      <div>
        <Input.TextArea rows={4} value={body} placeholder='write a reject reason here ...' onChange={(e) => setBody(e.target.value)} style={{marginBottom: 7}} />
        <div style={{display: "flex", justifyContent: "flex-end", gap: 4}}>
          <Button type='primary' danger loading={loading} onClick={() => handleSubmit("reject")}>
            Reject
          </Button>
          <Button type='primary' loading={loading} onClick={() => handleSubmit("approve")} className='ant-btn-success'>
            Approve
          </Button>
        </div>
      </div>
  )
}

export default ApproveAction