import React, { useContext, useState } from 'react';
import { Alert, DatePicker, Divider, Form, Input, InputNumber, message, notification, Select, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import FormPageTemplate from '../../9Boxs/components/FormPageTemplate/FormPage';
import { AppCtx } from '../../App';
import HistoryNavigation from "../../Global/HistoryNavigation/HistoryNavigation";
import moment from "moment";
import TextArea from 'antd/lib/input/TextArea';
import SubmitCancel from '../../9Boxs/components/SubmitCancel/SubmitCancel';
import axios from 'axios';
import { riskType } from '../risksTypes';
import CustomAntUploader from '../../Global/CustomAntUploader/CustomAntUploader';


const FinancialImpactOptions = [
  { value: 'Actual loss', labelTitle: "Actual loss", labelDesc: "If the incident resulted in a financial loss" },
  { value: 'Potential loss', labelTitle: "Potential loss", labelDesc: "If the incident has been discovered that may or may not result in a financial loss" },
  { value: 'Near miss', labelTitle: "Near miss", labelDesc: "If the incident was averted. It should be estimated based on an assumption of a financial impact if the incident had occurred" },
];


const NewIncidentReport = () => {
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);



  const SubmitForm = async (dataForm) => {
    let isFilesFinishUpload = true;
    const files = fileList?.map((file) => {
      if (file.status === "uploading") isFilesFinishUpload = false;
      return file?.response?.uploadedFiles[0]?.Name;
    });
    if(!isFilesFinishUpload) return;

    setLoading(true);
    dataForm.RiskTypeName = riskType.filter(row => row.Type == dataForm.RiskType)[0]?.Name || '';
    dataForm.Email = user_data.Data.Mail;
    // dataForm.Id = `${user_data.Data.Id}`;
    dataForm.Id = "0";
    dataForm.DiscoveryDate = moment(dataForm.DiscoveryDate).format('MM/DD/YYYY');
    dataForm.IncidentDate = moment(dataForm.IncidentDate).format('MM/DD/YYYY');
    dataForm.Amount = `${dataForm.Amount ? dataForm.Amount : 0}`;
    dataForm.FileNames = files.join(',');

    const response = await axios.post('https://salicapi.com/api/Incidents/Add', dataForm);
    if(response) {
      console.log(response);
      form.resetFields();
      setFileList([]);
      notification.success({message: response?.data?.Message || 'Success'});
      navigate(`${defualt_route}/incidents-center/report/${response?.data?.Data}`);
    } else {
      notification.error({message: 'Failed'});
    }
    setLoading(false);
  }


  let values = riskType.filter((r)=> { return r.Type === formData.RiskType })[0]?.Incident;

  const handleFormChange = (allValues) => {
    setFormData(allValues);
    // form. Incident Date should be less than or equal to Discovery Date
    if(allValues.IncidentDate && allValues.DiscoveryDate) {
      const incidentDate = moment(allValues.IncidentDate);
      const discoveryDate = moment(allValues.DiscoveryDate);
      if(incidentDate > discoveryDate) {
        form.setFieldsValue({DiscoveryDate: incidentDate});
      }
    }
    // if Has Financial Impact is False and Impact Type is Actual loss, then set Impact Type to null
    if(allValues.HasFinancialImpact === "False" && allValues.FinancialImpactType === "Actual loss") {
      form.setFieldsValue({FinancialImpactType: null});
    }
  }
const disabledDate = (current) => {
  // Can not select days after today
  return current && current >= moment().endOf('day');
};

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/incidents-center`)}>Risk Center</a>
        <p>New Incident Report</p>
      </HistoryNavigation>

      <FormPageTemplate
        pageTitle="Incident Report"
        tipsList={[
          "Fill out all required fields marked as ‘*’ carefully.",
          "Incident date is the date in which incident occur.",
          "Discovery date is the date in which incident has been found.",
          "Be specific in choosing \"Risk Type\" & \"Incident Type\" as the system will assign this report to the appropriate team member.",
          "Describe incident completely and precisely.",
        ]}
      >
        <Form
          {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}
          form={form}
          name="incident-report"
          onFinish={SubmitForm}
          onFinishFailed={() => message.error("Please, fill out the form correctly.") }
          onValuesChange={(changedValues, allValues) => handleFormChange(allValues)}
          size='large'
        >
          <Form.Item name="Number" label="Operational Incident NO." initialValue="<<auto generated>>">
            <Input disabled />
          </Form.Item>
          <Form.Item /* name="ReportingDate" */ label="Reporting Date">
            <Input placeholder="" disabled defaultValue={moment().format('MM/DD/YYYY HH:mm')} />
          </Form.Item>
          <Form.Item name="Country" label="Country" rules={[{ required: true }]}>
            <Select placeholder="Select Country">
              <Select.Option value="KSA">KSA</Select.Option>
              <Select.Option value="Ukranie">Ukranie</Select.Option>
              <Select.Option value="Australia">Australia</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="HasFinancialImpact" /* label="Has Financial Impact" */ label="Financial Loss" initialValue="False" rules={[{ required: true }]}>
            <Select placeholder="Select Value">
              <Select.Option value="True">Yes</Select.Option>
              <Select.Option value="False">No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="FinancialImpact" label="Financial Impact" rules={[{ required: true }]}>
              <Select placeholder="Select Financial Impact">
                <Select.Option value="Company wide">Company wide</Select.Option>
                <Select.Option value="Within Department">Within Department</Select.Option>
                {/* <Select.Option value="Other Department">Other Department</Select.Option> */}
                <Select.Option value="Other Department / Subsidiary">Other Department / Subsidiary</Select.Option>
              </Select>
            </Form.Item>

          {formData.Country !== "KSA" && formData.HasFinancialImpact === "True" && 
            <Form.Item 
              name="Amount" 
              initialValue={0}
              label={<>Amount (<b>SAR</b>)</>} 
              hasFeedback 
              help={<span className='hide-scrollbar' style={{color: 'red', whiteSpace: 'nowrap', overflow: 'auto'}}>Note : amount should be in <b>SAR</b> and greater than <b>100K</b></span>} 
              rules={[{ required: true }]}
            >
              <InputNumber min={0} step={1} style={{width: '100%'}} />
            </Form.Item>}
          
            <Form.Item name="FinancialImpactType" label="Impact Type" rules={[{ required: true }]}>
              <Select placeholder="Select Financial Impact">
                {FinancialImpactOptions
                  .filter((opt) => {
                    if(formData.HasFinancialImpact === "False" && opt.value === "Actual loss") {
                      return false;
                    }
                    return true;
                  })
                  .map(option => (
                    <Select.Option value={option.value}>
                      <Typography.Text>{option.labelTitle}</Typography.Text> <br />
                      <Typography.Text type='secondary' ellipsis style={{ whiteSpace: 'break-spaces' }}>{option.labelDesc}</Typography.Text>
                    </Select.Option>
                ))}
              </Select>
            </Form.Item>

          <Divider />
          {formData.Country !== "KSA" && formData.Amount < 100000 && <Alert
            message="WARNING!"
            description="As there is no financial impact, no need to submit an incident report."
            type="warning"
            showIcon
          />}
          {(formData.Country === "KSA" || formData.Amount >= 100000) && <>
            <Form.Item name="IncidentDate" label="Incident Date" rules={[{ required: true }]}>
              <DatePicker format="MM/DD/YYYY" disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item name="DiscoveryDate" label="Discovery Date" rules={[{ required: true }]}>
              <DatePicker format="MM/DD/YYYY" disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item name="RiskType" label="Risk Type" rules={[{ required: true }]}>
              <Select placeholder="Select Risk Type">
                {riskType?.map((row, i) => <Select.Option key={i} value={row.Type}>{row.Name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="IncidentType" label="Incident Type" rules={[{ required: true }]}>
              <Select placeholder="Select Incident Type">
                {values?.map((row, i) => <Select.Option key={i} value={`${row.id}`}>{row.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="Descriptions" label="Descriptions" rules={[{ required: true }]}>
              <TextArea rows={6} placeholder='A detailed description of the incident' />
            </Form.Item>
            <Form.Item label="Attachments">
              <CustomAntUploader
                fileList={fileList}
                GetFilesList={(files) => setFileList(files)}
              />
            </Form.Item>
            <div style={{margin: '10px auto'}}>
              <SubmitCancel loaderState={loading} backTo="/incidents-center" />
            </div>
          </>}
        </Form>
      </FormPageTemplate>
    </>
  )
}

export default NewIncidentReport