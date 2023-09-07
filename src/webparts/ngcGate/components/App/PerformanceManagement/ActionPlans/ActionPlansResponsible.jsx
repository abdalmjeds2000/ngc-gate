import { Button, Form, Input, Space, Typography, message } from 'antd';
import React, { useContext } from 'react'
import { RedoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import pnp from 'sp-pnp-js';
import { AppCtx } from '../../App';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import moment from 'moment';
import TimelineCards from '../../Global/TimelineCards/TimelineCards';
import emptyIcon from '../../../../assets/empty.jpg';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';




const ActionPlansResponsible = () => {
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const listName = 'KPIs Action Plans';


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await pnp.sp.web.lists.getByTitle(listName).items
        .filter(`Responsible/EMail eq '${user_data.Data.Mail}'`)
        .select('Author/Title,Author/EMail,Responsible/Title,Responsible/EMail,*').expand('Author,Responsible')
        .orderBy('Created', false).get();
      setData(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => { 
    if (Object.keys(user_data).length === 0) return;
    fetchData(); 
  }, [user_data]);

  const handleSave = async (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.Id === item.Id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row, IsDone: true });
    if (JSON.stringify(item) === JSON.stringify(row)) return;
    try {
      setLoading(true);
      const payload = { ActionPlan: row.ActionPlan, IsDone: true, ResposibleCount: 1 };
      await pnp.sp.web.lists.getByTitle(listName).items.getById(item.Id).update(payload);
      message.success('Item Updated Successfully');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    setData(newData);
  };

  const ControlPanel = (
    <Space size={5}>
      <Button size='small' loading={loading} icon={<RedoOutlined />} onClick={fetchData}>Refresh</Button>
    </Space>
  );

  document.title = '.:: SALIC Gate - Action Plans Responsible ::.';

  //prepare data for timeline
  const timelineData = data.map(item => {
    const descForm = (
      <Form layout='vertical' disabled={item.IsDone || loading} onFinish={values => handleSave({ ...item, ...values })}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Form.Item name='Issue' label="Issue" initialValue={item?.Issue} style={{ flex: 1, minWidth: 200, margin: 0 }}>
            <Input.TextArea rows={4} placeholder='write here' disabled />
          </Form.Item>
          <Form.Item name='ActionPlan' label="Action Plan" rules={[{required: true, message: ''}]} initialValue={item?.ActionPlan} style={{ flex: 1, minWidth: 200, margin: 0 }}>
            <Input.TextArea rows={4} placeholder='write here' />
          </Form.Item>
        </div>
        {!item.IsDone && <Form.Item style={{ margin: '10px 0 0 0', textAlign: 'right'}}>
          <Button type='primary' htmlType='submit'>Save & Close</Button>
        </Form.Item>}
      </Form>
    );
    return {
      id: item?.Id,
      // label: item?.Responsible?.Title,
      label: item?.Author?.Title,
      describtion: moment(item?.Created).format('MM/DD/YYYY hh:mm A'),
      cardTitle: item?.Title,
      cardDescribtion: descForm,
      status: item?.IsDone ? 'closed' : 'pending',
    }
  });


  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/hc-services`)}>Human Capital Services</a>
        <p>Action Plans - Responsible</p>
      </HistoryNavigation>

      <div className="table-page-container">
        <div className='content'>
          <div className="header">
            <h1>Action Plans - Responsible</h1>
            <div>{ControlPanel}</div>
          </div>

          <div className='form'>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
              {loading ? <AntdLoader /> : <TimelineCards items={timelineData} />}

              {
                !loading && data.length === 0 &&
                (
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <img src={emptyIcon} alt='empty-image' />
                    <h1 style={{margin: '0'}}>NOTHING!</h1>
                    <p style={{margin: '0 0 25px 0'}}>You don't have any action plans assigned to you</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ActionPlansResponsible