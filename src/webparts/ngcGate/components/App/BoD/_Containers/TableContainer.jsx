import { CheckOutlined, ClockCircleOutlined, FundProjectionScreenOutlined, RedoOutlined, TableOutlined } from '@ant-design/icons';
import { Button, DatePicker, Segmented, Space, Table, Tag, message } from 'antd';
import React from 'react';
import pnp from 'sp-pnp-js';
import moment from 'moment';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import Tabs from '../../Global/CustomTabs/Tabs';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../App';
import ActionsHistory from '../ActionsHistory';
import { roundedNum } from '../../Global/roundedNum';
import PowerBIEmbed from '../../Global/PowerBiEmbed/PowerBiEmbed';


const BoDTablePage = ({
  PageTitle, formKey, dataListName, 
  createItemComponent: CreateItem, tableColumns, editableTableComponents,
  data, setData, loading, setLoading, states, setStates
}) => {
  const initialQuarter = new URLSearchParams(window.location.search).get('quarter') || `Q${moment().quarter()}`;
  const initialYear = new URLSearchParams(window.location.search).get('year') || `${new Date().getFullYear()}`;

  const navigate = useNavigate();
  const { defualt_route } = React.useContext(AppCtx);
  const [quarter, setQuarter] = React.useState(initialQuarter);
  const [year, setYear] = React.useState(initialYear);
  const [link, setLink] = React.useState(null);
  const approvalsListName = 'BoD Forms Approvals';

  const fetchLink = async () => {
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Pages Info').items.filter(`PageKey eq '${formKey}'`).get();
      setLink(response[0]);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await pnp.sp.web.lists.getByTitle(dataListName).items.filter(`Quarter eq '${quarter}' and Year eq '${year}'`).get();
      if(formKey === 'strategy') {
        response.forEach(item => {
          item.Progress = roundedNum(item.Progress * 100);
          item.PreviousQuarter = roundedNum(item.PreviousQuarter * 100);
        });
      }
      if(formKey === 'investment_pipeline') {
        response.forEach(item => {
          item.Progress = roundedNum(item.Progress * 100);
        });
      }
      if(formKey === 'investment_live_transactions') {
        response.forEach(item => {
          item.Progress = roundedNum(item.Progress * 100);
        });
      }
      setData(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchPermission = async () => {
    const permission = await pnp.sp.web.lists.getByTitle(dataListName).effectiveBasePermissions.get();
    const _isCanEdit = (
      (permission?.Low === "4294967295" && permission?.High === "2147483647") || // Full Control
      (permission?.Low === "1012866047" && permission?.High === "432") || // Design
      (permission?.Low === "1011030767" && permission?.High === "432") || // Edit
      (permission?.Low === "1011028719" && permission?.High === "432") // Contribute
    );
    setStates(prev => ({ ...prev, isCanEdit: _isCanEdit }));
  }
  React.useEffect(() => { fetchLink(); }, []);
  React.useEffect(() => { fetchData(); }, [quarter, year]);
  React.useEffect(() => { fetchPermission(); }, [quarter, year]);



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
    fetchData();
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
      {(!loading && data?.length > 0 && !states.isPending && !states.isApproved) && (
        <Button type='primary' size='small' loading={loading} icon={<CheckOutlined />} className='ant-btn-success' onClick={handleSendForApproval}>
          Send for Approval
        </Button>)}
      <ActionsHistory formKey={formKey} quarter={quarter} year={year} states={states} />
      {(states.isCanEdit && !states.isPending && !states.isApproved) && (
          <CreateItem
            onFinish={newvalue => setData(prev => [...prev, newvalue])} 
            quarter={quarter} 
            year={year}
          />
        )}
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
          <h1>{PageTitle}</h1>
          <div>{ControlPanel}</div>
        </div>

        <div className='form' style={{padding: '10px 0', minHeight: 'unset'}}>
          <Table
            columns={tableColumns}
            dataSource={data}
            pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true, style: {padding: '25px 0'} }} 
            loading={loading}
            components={(states.isCanEdit && !states.isPending && !states.isApproved) ? editableTableComponents : {}}
            size="large" bordered
            rowClassName={() => 'editable-row'}
          />
        </div>
      </div>
    </div>
  );

  const tabsItems = [
    {
      key: 'data', 
      icon: <TableOutlined />, 
      title: PageTitle, 
      content: content
    },{
      key: 'preview', 
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



  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>{PageTitle}</p>
      </HistoryNavigation>
      
      <div className='standard-page'>
        <Tabs items={tabsItems} />
      </div>
    </>
  )
}

export default BoDTablePage