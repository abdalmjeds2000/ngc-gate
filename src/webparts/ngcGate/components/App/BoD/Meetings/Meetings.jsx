import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Button, Col, DatePicker, Form, Input, Row, Segmented, Space, Tag, message } from 'antd';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../../App';
import { CheckOutlined, ClockCircleOutlined, FormOutlined, FundProjectionScreenOutlined, RedoOutlined } from '@ant-design/icons';
import MeetingsBoxs from './Components/MeetingsBoxs';
import pnp from 'sp-pnp-js';
import useIsAdmin from '../../Hooks/useIsAdmin';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import Tabs from '../../Global/CustomTabs/Tabs';
import ActionsHistory from '../ActionsHistory';
import PowerBIEmbed from '../../Global/PowerBiEmbed/PowerBiEmbed';
import useCheckIsBoDFormAdmin from '../../Hooks/useCheckIsBoDFormAdmin';


const uniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
};


const initialMeeting = {
  id: uniqueId(),
  title: '',
  date: null,
  points: [{id: uniqueId(), value: ''}]
};


const onFailedValidate = () => message.error('Please fill all required fields');

const Meetings = ({ meetingType, listName, formKey }) => {
  // initial quarter and year, if link have params like ?quarter=Q1&year=2021 then use it, else use current quarter and year
  const initialQuarter = new URLSearchParams(window.location.search).get('quarter') || `Q${moment().quarter()}`;
  const initialYear = new URLSearchParams(window.location.search).get('year') || `${new Date().getFullYear()}`;
  
  const navigate = useNavigate();
  const { defualt_route } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [meetings, setMeetings] = useState([initialMeeting]);
  const [loading, setLoading] = useState(false);
  // const [quarter, setQuarter] = useState('Q1');
  // const [year, setYear] = React.useState(`${new Date().getFullYear()}`);
  const [quarter, setQuarter] = useState(initialQuarter);
  const [year, setYear] = React.useState(initialYear);
  const [link, setLink] = React.useState(null);
  const approvalsListName = 'BoD Forms Approvals';
  const [states, setStates] = React.useState({ isCanEdit: false, isPending: false, isApproved: false });
  const [isFormAdmin] = useCheckIsBoDFormAdmin(formKey);

  const fetchLink = async () => {
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Pages Info').items.filter(`PageKey eq '${formKey}'`).get();
      setLink(response[0]);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchMeetings = async () => {
    setLoading(true);
    const meetings = await pnp.sp.web.lists.getByTitle(listName).items.filter(`Quarter eq '${quarter}' and Year eq '${year}'`).get();
    if(meetings.length > 0) {
      /* group by MeetingTitle */
      form.setFieldsValue({
        MainTitle: meetings[0].MainTitle,
        Date: moment(meetings[0].Date),
      });
      const meetingsData = [];
      meetings.forEach((meeting) => {
        const index = meetingsData.findIndex((item) => item.title === meeting.MeetingTitle);
        if(index === -1) {
          meetingsData.push({
            id: uniqueId(),
            title: meeting.MeetingTitle,
            date: (meeting.MeetingDate) ? moment(meeting.MeetingDate) : null,
            points: [{id: meeting.Id, value: meeting.comment, isExist: true}]
          });
        } else {
          meetingsData[index].points.push({id: meeting.Id, value: meeting.comment, isExist: true});
        }
      });
      setMeetings(meetingsData);
    } else {
      setMeetings([initialMeeting]);
      form.resetFields();
    }
    setLoading(false);
  }
  const fetchPermission = async () => {
    const permission = await pnp.sp.web.lists.getByTitle(listName).effectiveBasePermissions.get();
    const _isCanEdit = (
      (permission?.Low === "4294967295" && permission?.High === "2147483647") || // Full Control
      (permission?.Low === "1012866047" && permission?.High === "432") || // Design
      (permission?.Low === "1011030767" && permission?.High === "432") || // Edit
      (permission?.Low === "1011028719" && permission?.High === "432") // Contribute
    );
    setStates(prev => ({ ...prev, isCanEdit: _isCanEdit }));
  }
  useEffect(() => { fetchLink(); }, []);
  useEffect(() => { fetchMeetings(); }, [quarter, year]);
  useEffect(() => { fetchPermission(); }, [quarter, year]);


  const handleSubmit = async (form_data) => {
    setLoading(true);
    let error;
    meetings.forEach((meeting) => {
      if(meeting.title === '' || !meeting.date) error = true;
      meeting.points.forEach((point) => {
        if(point.value === '') error = true;
      });
    });
    if(error) {
      setLoading(false);
      onFailedValidate();
      return;
    }

    const meetingsData = [];
    meetings.forEach((meeting) => {
      meeting.points.forEach((point) => {
        meetingsData.push({
          Title: `${formKey} :: ${quarter}/${year}`,
          Id: point.id,
          isExist: point.isExist,
          MeetingTitle: meeting.title,
          MeetingDate: (meeting.date) ? meeting.date.format('MM/DD/YYYY') : null,
          comment: point.value,
          Quarter: quarter,
          Year: year,
          MainTitle: form_data.MainTitle,
          Date: form_data.Date.format('MM/DD/YYYY'),
        });
      });
    });
    console.log('meetingsData ==> ', meetingsData);
    for(let i = 0; i < meetingsData.length; i++) {
      if(meetingsData[i].isExist) {
        delete meetingsData[i].isExist;
        await pnp.sp.web.lists.getByTitle(listName).items.getById(meetingsData[i].Id).update(meetingsData[i]);
      } else {
        delete meetingsData[i].Id;
        delete meetingsData[i].isExist;
        await pnp.sp.web.lists.getByTitle(listName).items.add(meetingsData[i]);
      }
    }
    setLoading(false);
    fetchMeetings().then(() => message.success('Meetings saved successfully'));
  }

    /* check if thir is approval request pending */
    const fetchIsPending = async () => {
      try {
        const items = await pnp.sp.web.lists.getByTitle(approvalsListName).items.filter(`FormKey eq '${formKey}' and Quarter eq '${quarter}' and Year eq '${year}' and Status eq 'Pending'`).get();
        setStates(prev => ({ ...prev, isPending: items?.length > 0 }));
      } catch (error) {
        console.log(error);
      }
    }
    React.useEffect(() => { fetchIsPending(); }, [quarter, year]);
  
    /* check if thir is approved */
    const fetchIsApproved = async () => {
      try {
        const items = await pnp.sp.web.lists.getByTitle(approvalsListName).items.filter(`FormKey eq '${formKey}' and Quarter eq '${quarter}' and Year eq '${year}' and Status eq 'Approved'`).get();
        setStates(prev => ({ ...prev, isApproved: items?.length > 0 }));
      } catch (error) {
        console.log(error);
      }
    }
    React.useEffect(() => { fetchIsApproved(); }, [quarter, year]);


  const handleRefresh = () => {
    fetchMeetings();
    fetchPermission();
    fetchIsPending();
    fetchIsApproved();
  }

  const handleSendForApproval = async () => {
    setLoading(true);
    const payload = {
      Title: `Approval Request :: ${quarter} ${year}`,
      FormKey: formKey,
      Quarter: quarter,
      Year: year,
    }
    try {
      await pnp.sp.web.lists.getByTitle(approvalsListName).items.add(payload);
      message.success('Sent for Approval Successfully');
      handleRefresh();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  const ControlPanel = (
    <Space size={5}>
      {states.isPending && <Tag color='#e99b4d'><ClockCircleOutlined /> Waiting for Approval</Tag>}
      {states.isApproved && <Tag color='#277c62' ><CheckOutlined /> Approved</Tag>}
      <Button size='small' loading={loading} icon={<RedoOutlined />} onClick={handleRefresh}>Refresh</Button>
      {(!loading && meetings?.length > 0 && JSON.stringify([initialMeeting]) !== JSON.stringify(meetings) && !states.isPending && !states.isApproved) && (
        <Button type='primary' size='small' loading={loading} icon={<CheckOutlined />} className='ant-btn-success' onClick={handleSendForApproval}>
          Send for Approval
        </Button>)}
      <ActionsHistory formKey={formKey} quarter={quarter} year={year} />
    </Space>
  );
  const content = (
    <div className="table-page-container" style={{top: 0, marginBottom: 25, padding: 0, minHeight: 'fit-content'}}>
      <div className='content'>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
            <DatePicker
              value={moment(year)} 
              onChange={(d, s) => setYear(s)} 
              picker="year" size='large' allowClear={false} disabled={loading}
              style={{ height: 50, border: 0, backgroundColor: '#eee', width: 100 }} />
            <Segmented
              options={[{ value: 'Q1', label: 'Quarter 1' }, { value: 'Q2', label: 'Quarter 2' }, { value: 'Q3', label: 'Quarter 3' }, { value: 'Q4', label: 'Quarter 4' }]}
              size='large' disabled={loading}
              value={quarter} onChange={setQuarter} 
              style={{ background: '#eee', padding: 7, overflow: 'hidden' }} />
          </div>
        </div>

        <div className="header" style={{borderRadius: 0}}>
          <h1>{meetingType}</h1>
          <div>{ControlPanel}</div>
        </div>

        <div className='form' style={{overflow: 'hidden'}}>
          <Form 
            form={form} 
            disabled={loading || !states.isCanEdit || states.isPending || states.isApproved} 
            layout='vertical' name="FormPage" 
            onFinish={handleSubmit} onFinishFailed={onFailedValidate}>
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item name='MainTitle' label='Main Title' rules={[{ required: true, message: '' }]}>
                  <Input size='large' placeholder='Enter Main Title' />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='Date' label='Date' rules={[{ required: true, message: '' }]}>
                  <DatePicker size='large' format='MM/DD/YYYY' style={{ width: '100%' }} placeholder='Pick a Date' />
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={8}>
                <Form.Item name='Year' label='Year' size='large' style={{ width: '100%' }} rules={[{ required: true, message: '' }]}>
                  <DatePicker picker="year" />
                </Form.Item>
              </Col> */}
            </Row>
            <MeetingsBoxs meetings={meetings} setMeetings={setMeetings} listName={listName} />
            {(states.isCanEdit && !states.isPending && !states.isApproved) && 
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button type="primary" size='large' disabled={loading} htmlType='submit' icon={<CheckOutlined />}>
                  Submit
                </Button>
              </div>}
          </Form>
        </div>
      </div>
    </div>
  );

  const tabsItems = [
    {
      key: 'data', 
      icon: <FormOutlined />, 
      title: meetingType, 
      content: content
    },{
      key: "preview", 
      icon: <FundProjectionScreenOutlined />, 
      title: "Preview", 
      content: (
        <iframe
          name="reportFrame"
          src={link?.PreviewLink}
          width="100%"
          style={{ border: 0, minHeight: "calc(100vh - 215px)" }}
        />
        // link ? <PowerBIEmbed
        //   reportId={link?.ReportId}
        //   groupId={link?.WorkspaceId}
        //   iframeClassName='bod-preview-iframe'
        // /> : null
      ),
    },
  ];

  document.title = `.:: SALIC Gate | ${meetingType} ::.`;
  
  if(!isFormAdmin) return <AntdLoader />;
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>{meetingType}</p>
      </HistoryNavigation>

      <div className='standard-page'>
        <Tabs items={tabsItems} />
      </div>
    </>
  )
}

export default Meetings