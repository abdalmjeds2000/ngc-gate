import React, { useContext } from 'react';
import { AppCtx } from '../../../App';
import { Button, Col, DatePicker, Form, Input, InputNumber, List, Radio, Row, Select, message, notification } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Section } from 'salic-react-components';
import { BarsOutlined } from '@ant-design/icons';

const DepartmentFeedback = ({ reportData, formData, onFinish, customLayout }) => {
  const { user_data, defualt_route, salic_departments } = useContext(AppCtx);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showOperationalLossForm, setShowOperationalLossForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const canEdit = () => {
    if(formData?.ToUser?.Mail?.toLowerCase() == user_data?.Data?.Mail?.toLowerCase()) {
      return true;
    }
    return false;
  }

  const submitData = async (values) => {
    setLoading(true);
    let data = values;
    data.Email = user_data?.Data?.Mail;
    data.IncidentId = `${reportData.Id}`;
    data.TaskId = formData.Id;

    if(data.RecoveryDate) data.RecoveryDate = moment(data.RecoveryDate).format('MM/DD/YYYY');
    if(data.ResolutionTargetDate) data.ResolutionTargetDate = moment(data.ResolutionTargetDate).format('MM/DD/YYYY');
    if(data.LossAmount) data.LossAmount = `${data.LossAmount}`;
    if(data.RecoveryAmount) data.RecoveryAmount = `${data.RecoveryAmount}`;
    if(data.RecoveryAmount) data.RecoveryAmount = `${data.RecoveryAmount}`;

    const response = await axios.post('https://salicapi.com/api/Incidents/DepartmentRespond', data);
    if(response?.status == 200 || response?.status == 201) {
      if(onFinish) onFinish();
      notification.success({message: response?.data?.Message || "DONE !"});
    } else {
      notification.error({message: "failed"});
    }
    setLoading(false);
  }
  const isPendingWithDepartment = formData?.Status === "PENDING_WITH_DEPARTMENT";

  // handle LossAmountField & RecoveryAmountField (RecoveryAmountField always should be less than LossAmountField);
  const limitRecoveryAmount = () => {
    const LossAmountField = form.getFieldValue("LossAmount") || 0;
    const RecoveryAmountField = form.getFieldValue("RecoveryAmount");
    if(RecoveryAmountField > LossAmountField) {
      form.setFieldValue("RecoveryAmount", form.getFieldValue("LossAmount"))
    }
  }
  /* transform all date props to moment */
  const initFormValues = () => {
    let data = formData;
    if(data.RecoveryDate) data.RecoveryDate = moment(data.RecoveryDate);
    if(data.ResolutionTargetDate) data.ResolutionTargetDate = moment(data.ResolutionTargetDate);
    if(data.LossAmount) data.LossAmount = parseFloat(data.LossAmount);
    if(data.RecoveryAmount) data.RecoveryAmount = parseFloat(data.RecoveryAmount);
    if(data.RecoveryAmount) data.RecoveryAmount = parseFloat(data.RecoveryAmount);
    return data;
  }

  return (
    <React.Fragment>
      <div className='incident_department-feedback-container'>
        {reportData?.Status !== 'REVIEW' && (
          <div className='form'>
            <Form
              labelCol={!customLayout ? { span: 6 } : null} wrapperCol={!customLayout ? { span: 18 } : null}
              name="responsible-department-part" layout={customLayout ? customLayout : "horizontal"}
              form={form} onFinish={submitData}
              labelWrap
              onFinishFailed={() => message.error("Please, fill out the form correctly.")}
              initialValues={initFormValues()}
              disabled={!isPendingWithDepartment || !canEdit() || ["CLOSED", "CLOSEDEARLY"].includes(reportData?.Status)}
            >
              <Form.Item name="Causes" label="Cause" rules={[{required: true}]}>
                <Input.TextArea size='large' rows={6} placeholder="what led to the incident" />
              </Form.Item>
              <Form.Item name="ActionsPlan" label="Actions Plan" rules={[{required: true}]}>
                <Input.TextArea size='large' rows={6} placeholder="write action plan" />
              </Form.Item>
              <Form.Item name="ActionsTaken" label="Actions Taken" rules={[{required: true}]}>
                <Input.TextArea size='large' rows={6} placeholder="write action taken" />
              </Form.Item>
              <Form.Item name="FinancialImpact" label="Financial Impact" rules={[{required: true}]}>
                <Radio.Group size='large' onChange={e => setShowOperationalLossForm(e.target.value == 1)}>
                  <Radio value={1}>Yes</Radio>
                  <Radio value={2}>No</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="ActionParty" label="Action By" rules={[{required: true}]}>
                <Select
                  placeholder="Select a department" removeIcon size='large'
                  showSearch optionFilterProp="children"
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                  options={[
                    { value: 'IT', label: 'Department Of IT', },
                    ...salic_departments.filter(item => item !== "").map(item => ({ label: item, value: item }))
                  ]}
                />
              </Form.Item>
              <Form.Item name="ResolutionTargetDate" label="Resolution Target Date" rules={[{required: true}]} initialValue={moment(reportData?.ResolutionTargetDate ? new Date(reportData?.ResolutionTargetDate) : new Date())}>
                <DatePicker size='large' format='MM/DD/YYYY' style={{ width: '100%' }} />
              </Form.Item>

              {(showOperationalLossForm || formData?.FinancialImpact == 1 || formData?.FinancialImpact == "1") && (
                <React.Fragment>
                  {/* <Divider /> */}
                  {/* <Typography.Text style={{ display: 'block', fontSize: '1.2rem', marginBottom: 12, fontWeight: "500" }}>Operational Loss Form: </Typography.Text> */}
                  <br />
                  <Form.Item name="LossAmount" label="Loss Amount" rules={[{required: true}]}>
                    <InputNumber
                      size="large" placeholder="Select Loss Amount & Currency"
                      style={{width: "100%"}} 
                      onChange={limitRecoveryAmount}
                      addonAfter={
                        <Form.Item name="LossAmountCurrency" style={{margin: 0, padding: 0}}>
                          <Select style={{ width: 100 }} size="large">
                            <Select.Option value="USD">US Dollar</Select.Option>
                            <Select.Option value="AUD">Australian Dollar</Select.Option>
                            <Select.Option value="EUR">Euro</Select.Option>
                            <Select.Option value="SAR">Saudi Riyal</Select.Option>
                            <Select.Option value="UAH">Ukrainian hryvnia</Select.Option>
                            <Select.Option value="CAD">Canadian Dollar</Select.Option>
                            <Select.Option value="INR">Indian Rupee</Select.Option>
                          </Select>
                        </Form.Item>
                      } 
                    />
                  </Form.Item>
                  <Form.Item name="RecoveryAmount" label="Recovery Amount" rules={[{required: true}]}>
                    <InputNumber
                      size="large" placeholder="Select Recovery Amount & Currency"
                      style={{width: "100%"}}
                      onChange={limitRecoveryAmount}
                      addonAfter={
                        <Form.Item name="RecoveryAmountCurrency" style={{margin: 0, padding: 0}}>
                          <Select style={{ width: 100 }} size="large">
                            <Select.Option value="USD">US Dollar</Select.Option>
                            <Select.Option value="AUD">Australian Dollar</Select.Option>
                            <Select.Option value="EUR">Euro</Select.Option>
                            <Select.Option value="SAR">Saudi Riyal</Select.Option>
                            <Select.Option value="UAH">Ukrainian hryvnia</Select.Option>
                            <Select.Option value="CAD">Canadian Dollar</Select.Option>
                            <Select.Option value="INR">Indian Rupee</Select.Option>
                          </Select>
                        </Form.Item>
                      } 
                    />
                  </Form.Item>
                  <Form.Item name="IfNotRecovered" label="If Amount Not Recovered Now, Is it Expected in the Future?" rules={[{required: true}]}>
                    <Radio.Group size='large'>
                      <Radio value={1}>Yes</Radio>
                      <Radio value={2}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name="RecoveryDate" label="Recovery Date" rules={[{required: true}]} initialValue={reportData?.RecoveryDate ? moment(new Date(reportData?.RecoveryDate)) : ""}>
                    <DatePicker size='large' format='MM/DD/YYYY' disabled={!isPendingWithDepartment} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="EnsureAction" label="Actions Taken To Ensure Loss Will Not Be Repeated" rules={[{required: true}]}>
                    <Input.TextArea size='large' rows={6} placeholder="Actions Taken To Ensure Loss Will Not Be Repeated" />
                  </Form.Item>
                </React.Fragment>
              )}

              <Col span={24}>
                <Row justify="center" gutter={10}>
                  <Col>
                    <Button htmlType='submit' size='large' type='primary' loading={loading}>Submit</Button>
                  </Col>
                  <Col>
                    <Button type='primary' size='large' danger onClick={() => navigate(defualt_route + "/incidents-center")}>Cancel</Button>
                  </Col>
                </Row>
              </Col>
            </Form>
          </div>
        )}
        <div className='tips'>
          <Section SectionTitle={<><BarsOutlined /> Tips</>}>
            <List
              size="small"
              dataSource={[
                "Financial Loss indicates monetary losses in SAR.",
                "Financial impact could be financial loss classified as companywide, department level or subsidiary level.",
                "Please select the Impact type carefully considering your understanding about the incident.",
                "Attach any evidence if available."
              ]}
              renderItem={(item) => <List.Item style={{padding: '6px 0'}}>{item}</List.Item>}
            />
          </Section>
        </div>
      </div>
    </React.Fragment>
  )
}

export default DepartmentFeedback