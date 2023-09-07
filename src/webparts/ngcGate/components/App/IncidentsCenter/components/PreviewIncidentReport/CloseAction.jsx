import React, { useContext, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, message, notification } from 'antd';
import { AppCtx } from '../../../App';
import axios from 'axios';
import { IssuesCloseOutlined } from '@ant-design/icons';


const CloseAction = ({ reportData, onSuccess }) => {
  const { user_data } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const data = values;
    data.Email = user_data?.Data?.Mail;
    data.Incident_Id = `${reportData.Id}`;

    const response = await axios.post(`https://salicapi.com/api/Incidents/CloseIncidentReport`, data);
    if(response?.status == 200 || response?.status == 201) {
      notification.success({message: "Incident report has been closed"});
      form.resetFields();
      setOpenModal(false);
      if(onSuccess) onSuccess();
    } else {
      notification.error({message: "failed"})
    }
    setLoading(false);
  }
  
  return (
    <>
      <Button type='primary' danger size='large' onClick={() => setOpenModal(true)} icon={<IssuesCloseOutlined />}>
        Close Incident
      </Button>
      <Modal 
        title={<><IssuesCloseOutlined /> Close Incident Report</>}
        open={openModal} 
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <Form
          name="incident-report-close-request" 
          layout="vertical"
          form={form} 
          onFinish={handleSubmit}
          onFinishFailed={() => message.error("Please, fill out the form correctly.")}
        >
          <Form.Item name="close_feedback" label="Write your feedback" rules={[{required: true, message: ''}]} style={{ marginBottom: 10 }}>
            <Input.TextArea size='large' rows={4} placeholder="write here" />
          </Form.Item>
          <Row gutter={10} justify="end">
            <Col>
              <Button htmlType='submit' danger type='primary' loading={loading}>
                Close Incident
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default CloseAction