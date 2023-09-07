import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import pnp from 'sp-pnp-js';
import { Button, Card, Form, Input, Popconfirm, Tag, Typography, message } from 'antd';
import { AppCtx } from '../../App';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';


const cardStyles = { overflow: 'hidden', height: '100%' };
const cardTitleStyle = {fontSize: '1.2rem', paddingLeft: 10};

const AchievementsChallengesInvitation = () => {
  const [form] = Form.useForm();
  const { inviteId } = useParams();
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const invitations_listName = 'Achievements & Challenges - Invitations';
  const data_listName = 'Achievements & Challenges Data';
  const [loading, setLoading] = React.useState(false);
  const [invitation, setInvitation] = React.useState(null);

  const fetchPoints = async (invitationId) => {
    const points = await pnp.sp.web.lists.getByTitle(data_listName).items
      .filter(`InvitationIdId eq ${invitationId}`).get();
    const achievements = points.filter(row => row.PointType === 'Achievement');
    const challenges = points.filter(row => row.PointType === 'Challenge');
    if(achievements.length === 0) achievements.push({ PointValue: '' });
    if(challenges.length === 0) challenges.push({ PointValue: '' });
    form.setFieldsValue({ achievements, challenges });
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const invitation = await pnp.sp.web.lists.getByTitle(invitations_listName).items.getById(inviteId)
        .select('SectorAdmin/Title,SectorAdmin/EMail,*').expand('SectorAdmin').get();
      setInvitation(invitation);
      const currentUserMail = user_data?.Data?.Mail;
      const validateUser = invitation?.SectorAdmin?.EMail?.toLowerCase() === currentUserMail?.toLowerCase();
      if(!validateUser) {
        message.error('Sorry, you are not authorized to view this page');
        navigate(`${defualt_route}/hc-services`);
      }
      await fetchPoints(invitation.Id);
    } catch (error) {
      message.error('Something went wrong, please try again later');
      navigate(`${defualt_route}/hc-services`);
    }
    setLoading(false);
  }
  
  useEffect(() => {
    if(Object.keys(user_data).length === 0) return;
    fetchData(); 
  }, [user_data]);

  const handleDelete = async (row) => {
    if (row.Id) {
      await pnp.sp.web.lists.getByTitle(data_listName).items.getById(row.Id).delete();
      message.success('Deleted successfully');
    }
  }

  const onFinish = async (values) => {
    setLoading(true);
    const achievements = values.achievements.map(row => ({ ...row, PointType: 'Achievement' }));
    const challenges = values.challenges.map(row => ({ ...row, PointType: 'Challenge' }));
    const data = [...achievements, ...challenges];
    if (achievements?.length === 0 && challenges?.length === 0) {
      message.error('Please fill at least one achievement and one challenge');
      setLoading(false);
      return;
    }

    // loop over data, if row has id then update, else create new row in list
    for (let row of data) {
      if (row.Id) {
        await pnp.sp.web.lists.getByTitle(data_listName).items.getById(row.Id).update({ PointValue: row.PointValue });
      } else {
        const payload = { PointValue: row.PointValue, PointType: row.PointType, InvitationIdId: inviteId };
        await pnp.sp.web.lists.getByTitle(data_listName).items.add(payload);
      }
    }
    await fetchPoints(invitation.Id);
    message.success('Saved successfully');
    setLoading(false);
  }

  document.title = '.:: SALIC Gate :: Achievements & Challenges Invitation ::.';

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/hc-services`)}>Human Capital Services</a>
        <a onClick={() => navigate(`${defualt_route}/performance-managment/achievements-challenges`)}>Achievements & Challenges</a>
        <p>Invitation #{inviteId || '??'}</p>
      </HistoryNavigation>

      <div className="table-page-container">
        <div className='content'>
          <div className="header">
            <h1><b>{invitation?.Title}</b> Sector</h1>
            <div>
              {invitation?.Status === 'Closed' && <Tag color='#ec1f47'><CloseOutlined /> Closed</Tag>}
            </div>
          </div>

          <div className='form'>
            <div style={{ margin: '10px 0 25px 0' }}>
              <Typography.Text style={{ display: 'block', fontSize: '1.2rem', fontWeight: 500 }}>
                Please fill You sector achievement & challenge and save it.
              </Typography.Text>
            </div>

            <div>
              <Form
                form={form} onFinish={onFinish} onFinishFailed={() => message.error('Please fill all required fields')}
                name='achievements_challenges_data'
                layout='vertical'
                disabled={invitation?.Status === 'Closed' || loading}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 25 }}>
                  <div style={{ flex: 1, minWidth: 320 }}>
                    <Card title={<span style={cardTitleStyle}>Achievements</span>} style={cardStyles}>
                      <Form.List name="achievements">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }, indx) => (
                              <div style={{ marginBottom: 10 }}>
                                <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                  <div style={{ padding: 4, width: 25, minWidth: 25, height: 25, lineHeight: 1.2, background: '#eee', color: '#777', marginRight: 6, textAlign: 'center', borderRadius: 99 }}>{indx+1}</div>
                                  <Form.Item {...restField}
                                    name={[name, 'PointValue']} style={{ margin: 0, width: '100%' }}
                                    rules={[ { required: true, message: '' } ]}
                                  >
                                    <Input.TextArea size='large' rows={2} placeholder="achievement item" style={{ width: '100%'}} />
                                  </Form.Item>
                                  {/* hidden id field  */}
                                  <Form.Item name={[name, 'Id']} style={{ display: 'none' }}>
                                    <Input />
                                  </Form.Item>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <Popconfirm 
                                    title="Sure to delete?" 
                                    onConfirm={() => {
                                      const record = form.getFieldValue(['achievements', name]);
                                      handleDelete(record);
                                      remove(name); 
                                    }}>
                                    <Button type='primary' danger size='small'>
                                      Delete
                                    </Button>
                                  </Popconfirm>
                                </div>
                              </div>
                            ))}
                            {fields.length < 30 && <div style={{ textAlign: 'center' }}>
                              <Button type="dashed" onClick={add} >
                                <PlusOutlined />
                              </Button>
                            </div>}
                          </>
                        )}
                      </Form.List>
                    </Card>
                  </div>
                  <div style={{ flex: 1, minWidth: 320 }}>
                    <Card title={<span style={cardTitleStyle}>Challenges</span>} style={cardStyles}>
                      <Form.List name="challenges">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }, indx) => (
                              <div style={{ marginBottom: 10 }}>
                                <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                  <div style={{ padding: 4, width: 25, minWidth: 25, height: 25, lineHeight: 1.2, background: '#eee', color: '#777', marginRight: 6, textAlign: 'center', borderRadius: 99 }}>{indx+1}</div>
                                  <Form.Item {...restField}
                                    name={[name, 'PointValue']} style={{ margin: 0, width: '100%' }}
                                    rules={[ { required: true, message: '' } ]}
                                  >
                                    <Input.TextArea size='large' rows={2} placeholder="challenge item" style={{ width: '100%'}} />
                                  </Form.Item>
                                  {/* hidden id field  */}
                                  <Form.Item name={[name, 'Id']} style={{ display: 'none' }}>
                                    <Input />
                                  </Form.Item>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <Popconfirm 
                                    title="Sure to delete?" 
                                    onConfirm={() => {
                                      const record = form.getFieldValue(['challenges', name]);
                                      handleDelete(record);
                                      remove(name); 
                                    }}>
                                    <Button type='primary' danger size='small'>
                                      Delete
                                    </Button>
                                  </Popconfirm>
                                </div>
                              </div>
                            ))}
                            {fields.length < 30 && <div style={{ textAlign: 'center' }}>
                              <Button type="dashed" onClick={add} >
                                <PlusOutlined />
                              </Button>
                            </div>}
                          </>
                        )}
                      </Form.List>
                    </Card>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 20 }}>
                  <Button type='primary' size='large' htmlType='submit' loading={loading}>Save Changes</Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AchievementsChallengesInvitation