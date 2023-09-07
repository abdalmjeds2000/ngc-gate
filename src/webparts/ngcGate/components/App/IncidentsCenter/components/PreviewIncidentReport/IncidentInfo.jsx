import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Form, Input, List, Steps, Typography } from 'antd';
import moment from 'moment';
import Section from '../../../Global/RequestsComponents/Section';
import FileIcon from '../../../Global/RequestsComponents/FileIcon';
import { ReviewTips, TipsForDepartment } from './tips';
import { BarsOutlined, LinkOutlined, MoreOutlined } from '@ant-design/icons';
import { AppCtx } from '../../../App';
import pnp from 'sp-pnp-js';

const IncidentInfo = ({ reportData }) => {
  const [form] = Form.useForm();
  const { sp_site } = useContext(AppCtx);
  const [showDetails, setShowDetails] = React.useState(false);
  const detailsRef = React.useRef(null);
  const [incidentsTypes, setIncidentsTypes] = useState([]);

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
  useEffect(() => { FetchIncidentsTypes() }, []);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
    detailsRef.current.style.display = showDetails ? "none" : "block";
  }
  if(incidentsTypes.length === 0) return <></>;
  return (
    <div style={{ maxWidth: 2300, margin: '0px auto' }}>
      <div className='info-section-container'>
        <div className='infos'>
          <div style={{ maxWidth: 1500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span></span>
              <span className='close-btn'><Button onClick={handleToggleDetails}>{<MoreOutlined />}</Button></span>
            </div>
            <br />
            {Object.keys(reportData).length > 0 && (
              <Form 
                form={form} 
                {...{ labelCol: { span: 7 }, wrapperCol: { span: 17 } }}
                labelWrap
                size='large'
                disabled
              >
                <Form.Item label="Reporting Date" name='CreatedAt' initialValue={moment(reportData?.CreatedAt).format('MM/DD/YYYY h:mm A') || ' - '}>
                  <Input />
                </Form.Item>
                <Form.Item label="Operational Incident NO" name='Number' initialValue={reportData?.Number || ' - '}>
                  <Input value={reportData?.Number || ' - '} />
                </Form.Item>
                <Form.Item label="Incident Date" name='IncidentDate' initialValue={moment(reportData?.IncidentDate).format('MM/DD/YYYY') || ' - '}>
                  <Input />
                </Form.Item>
                <Form.Item label="Discovery Date" name='DiscoveryDate' initialValue={moment(reportData?.DiscoveryDate).format('MM/DD/YYYY') || ' - '}>
                  <Input />
                </Form.Item>
                <br />
                <Form.Item label="Country" name='Country' initialValue={reportData?.Country || ' - '}>
                  <Input />
                </Form.Item>
                <Form.Item label="Has Financial Impact" name='HasFinancialImpact' initialValue={reportData?.HasFinancialImpact ? 'Yes' : 'No' || ' - '}>
                  <Input />
                </Form.Item>
                <Form.Item label="Impact Type" name='FinancialImpactType' initialValue={reportData?.FinancialImpactType || ' - '}>
                  <Input />
                </Form.Item>
                <Form.Item label="Financial Impact" name='FinancialImpact' initialValue={reportData?.FinancialImpact || ' - '}>
                  <Input />
                </Form.Item>
                <Form.Item label="Amount (SAR)" name='Amount' initialValue={reportData?.Amount || '0'}>
                  <Input />
                </Form.Item>
                <Form.Item label="Risk Type" name='RiskType' initialValue={incidentsTypes?.filter(r => r.Type == reportData.RiskType)[0]?.Name || ' - '}>
                  <Input />
                </Form.Item>
                <Form.Item label="Incident Type" name='IncidentType' initialValue={incidentsTypes?.filter(r => r.Type == reportData.RiskType)[0]?.Incident?.filter(x => x.id == reportData.IncidentType)[0]?.name || ' - '}>
                  <Input />
                </Form.Item>
                <br />
                <Form.Item label="Descriptions" name='Descriptions' initialValue={reportData?.Descriptions || ' - '}>
                  <Input.TextArea rows={6} />
                </Form.Item>
              </Form>)}
          </div>
        </div>

        <div className='details' ref={detailsRef}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: "12px 0" }}>
            <div style={{ width: 45, height: 45, borderRadius: 99, overflow: 'hidden', }}>
              <img src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${reportData?.Requester?.Mail}`} width='100%' alt='' />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontWeight: 500, fontSize: '1.1rem', }} title='Display Name'>
                  {reportData?.Requester?.DisplayName}
                </span>
              <span style={{ fontSize: '0.8rem', color: '#555', }} title='Deparment'>
                {reportData?.Requester?.Department}
              </span>
            </div>
          </div>
          <Section SectionTitle={<><LinkOutlined /> Attached Files</>}>
            <div className='attachments-container'>
              {reportData?.Files?.map((file,i) => (
                <a target='_blank' href={`https://salicapi.com/File/${file?.Guid}`} style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 5 }}>
                  <FileIcon
                    key={i} 
                    FileType={file?.FileName?.split(".")[file?.FileName?.split(".")?.length-1]}
                    FileName={file?.FileName}
                    FilePath={`https://salicapi.com/File/${file?.Guid}`}
                    IconWidth='22px'
                  />
                  <span style={{ color: '#555'}}>{file?.FileName}</span>
                </a>
                )
              )}
              {
                reportData?.Files?.length === 0
                ? <Typography.Text>No attachments for this ticket</Typography.Text>
                : null
              }
            </div>
          </Section>
          <Section SectionTitle={<><BarsOutlined /> Tips</>}>
            {/* <List
              size="small"
              dataSource={
                ["PENDING_WITH_DEPARTMENT", "ForApproval", "CLOSED"].includes(reportData?.Status)
                ? TipsForDepartment
                : ReviewTips
              }
              renderItem={(item) => <List.Item style={{padding: '6px 0'}}>{item}</List.Item>}
            /> */}
            <ul style={{ listStyle: "disc" }}>
              {
                ["PENDING_WITH_DEPARTMENT", "ForApproval", "CLOSED"].includes(reportData?.Status)
                ? TipsForDepartment.map((item, i) => <li key={i} style={{padding: '6px 0'}}>{item}</li>)
                : ReviewTips.map((item, i) => <li key={i} style={{padding: '6px 0'}}>{item}</li>)
              }
            </ul>
          </Section>
          <Section SectionTitle="Actions History">
            <AssigneesRender items={reportData.ActionsHistory || []} />
          </Section>
        </div>
      </div>
    </div>
  )
}

export default IncidentInfo;



const AssigneesRender = ({ items }) => (
  <Steps
    direction="vertical"
    size="small" 
    status="process" 
    current={items.length}
  >
    {
      items.map((item, i) => (
        <Steps.Step 
          key={i}
          style={{paddingBottom: 15}}
          title={
            <div style={{display: "flex", gap: 10}}>
              <div style={{ width: 28 }}>
                <Avatar style={{marginRight: 8}} src={`/sites/newsalic/_layouts/15/userphoto.aspx?size=s&username=${item?.ByUser?.Mail}`} />
              </div>
              <div style={{ width: "100%" }}>
                {item?.Action} by <b>{item?.ByUser?.DisplayName}</b>
                , at {moment(item?.CreatedAt).format('MM/DD/YYYY hh:mm A')}
              </div>
            </div>
          }
        />
      ))
    }
  </Steps>
)