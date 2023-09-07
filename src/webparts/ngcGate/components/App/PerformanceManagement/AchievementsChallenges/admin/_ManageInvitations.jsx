import React from 'react';
import { Button, Card, Col, Dropdown, Empty, Form, Input, Modal, Popconfirm, Row, Tag, Typography, message } from 'antd';
import pnp from 'sp-pnp-js';
import moment from 'moment';
import { CheckCircleOutlined, CheckSquareOutlined, ClockCircleOutlined, CloseOutlined, DeleteOutlined, EyeOutlined, LoadingOutlined, MoreOutlined, PlusOutlined, RedoOutlined, SendOutlined, TeamOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import AntdLoader from '../../../Global/AntdLoader/AntdLoader';


const ManageInvitations = ({ listName }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const data_listName = 'Achievements & Challenges Data';

  const getData = async () => {
    setLoading(true);
    const data = await pnp.sp.web.lists.getByTitle(listName)
      .items
      .select('Author/Title,Author/EMail,Author/Id,SectorAdmin/Title,SectorAdmin/EMail,SectorAdmin/Id,*')
      .expand('Author,SectorAdmin')
      .orderBy('Created', false).get();
    setData(data);
    setLoading(false);
  }
  React.useEffect(() => { getData(); }, []);

  const deletePoints = async (invitationId) => {
    // delete all points for this invitation
    const points = await pnp.sp.web.lists.getByTitle(data_listName).items.select('Id').filter(`InvitationId eq ${invitationId}`).get();
    for (const point of points) {
      await pnp.sp.web.lists.getByTitle(data_listName).items.getById(point.Id).delete();
    }
  }
  const handleDelete = async (id) => {
    try {
      // delete invitation
      await pnp.sp.web.lists.getByTitle(listName).items.getById(id).delete();
      await deletePoints(id);
      message.success('Item Deleted Successfully');
    } catch (error) {
      console.log(error);
    }
    const newData = data?.filter((item) => item?.Id !== id);
    setData(newData);
  };
  const handleResend = async (id) => {
    await handleUpdate(id, { Status: 'Pending', InviteCount: 1 });
  };
  const handleUpdate = async (id, payload) => {
    try {
      const item = data?.find((item) => item?.Id === id);
      const newPayload = { InviteCount: item?.InviteCount + 1, ...payload };
      await pnp.sp.web.lists.getByTitle(listName).items.getById(id).update(newPayload);
      message.success('Item Updated Successfully');
      const newData = data?.map((item) => {
        if (item.Id === id) {
          return { ...item, ...newPayload };
        }
        return item;
      });
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const TitleBlock = ({label, title, size, style}) => (
    <div style={style}>
      {label ? <Typography.Text type='secondary' style={{ display: 'block' }}>{label}</Typography.Text> : null}
      {title ? <Typography.Text style={{ fontSize: size === "large" ? '1.2rem' : '1rem', display: 'block', fontWeight: size === "large" ? 500 : 400 }}>{title}</Typography.Text> : null}
    </div>
  );

  return (
    <div className="table-page-container" style={{top: 0, marginBottom: 25, padding: 0, minHeight: 'fit-content'}}>
      <div className='content'>
        <div className="header" style={{borderRadius: 0}}>
          <h1>Invitations</h1>
          <div>
            <Button size='small' loading={loading} icon={<RedoOutlined />} onClick={getData}>Refresh</Button>
          </div>
        </div>

        <div className='form' style={{padding: '10px 0', minHeight: 'unset'}}>
          <div style={{ marginTop: 15, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gridGap: 25 }}>
            {
              data?.map((item, index) => {
                return (
                  <div key={item.Id} className='_achiev-chall_card-container'>
                    <span style={{ position: 'absolute', right: 15, top: 15 }}>
                      <ActionsDropdown item={item} handleDelete={handleDelete} handleResend={handleResend} handleUpdate={handleUpdate} listName={data_listName} />
                    </span>
                    <TitleBlock /* label={<><TeamOutlined /> Sector</>} */ title={item?.Title} size="large" style={{ marginBottom: 10 }} />
                    <Row gutter={[2, 6]} style={{ marginBottom: 7 }}>
                      <Col span={12}>
                        <TitleBlock label={<><UserOutlined /> Sector Manager</>} title={item?.SectorAdmin?.Title || ' - '}  />
                      </Col>
                      <Col span={12}>
                        <TitleBlock label={<><UserSwitchOutlined /> Invited By</>} title={item?.Author?.Title} />
                      </Col>
                    </Row>
                    <Row gutter={[2, 6]}>
                      <Col span={24}>
                        <TitleBlock label={<><ClockCircleOutlined /> Invited At</>} title={moment(item?.Created).format('MM/DD/YYYY h:mm A')} />
                      </Col>
                    </Row>
                    <span style={{ position: 'absolute', bottom: 20, right: 8 }}>
                      {item?.Status === 'Pending' ? <Tag color="#e99b4d">{<>{item?.Status === 'Pending' ? <LoadingOutlined /> : <CheckSquareOutlined />} {item?.Status}</>}</Tag> : <Tag color="#66b4ea">{item?.Status}</Tag>}
                    </span>
                  </div>
                )
              })
            }
          </div>
          {data.length === 0 && !loading && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          {data.length === 0 && loading && <AntdLoader />}
        </div>
      </div>
    </div>
  )
}

export default ManageInvitations;







const PreviewInviteeResponse = ({ invitation, open, setPreviewVisible, invitationId, listName }) => {
  const [form] = Form.useForm();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  
  const fetchData = async () => {
    try {
      const points = await pnp.sp.web.lists.getByTitle(listName).items
        .filter(`InvitationIdId eq ${invitationId}`).get();
        const achievements = points.filter(row => row.PointType === 'Achievement');
        const challenges = points.filter(row => row.PointType === 'Challenge');
        if(achievements.length === 0) achievements.push({ PointValue: '' });
        if(challenges.length === 0) challenges.push({ PointValue: '' });
        form.setFieldsValue({ achievements, challenges });
      setData(points);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);



  const handleDelete = async (row) => {
    if (row.Id) {
      await pnp.sp.web.lists.getByTitle(listName).items.getById(row.Id).delete();
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
      return;
    }

    // loop over data, if row has id then update, else create new row in list
    for (let row of data) {
      if (row.Id) {
        await pnp.sp.web.lists.getByTitle(listName).items.getById(row.Id).update({ PointValue: row.PointValue });
      } else {
        const payload = { PointValue: row.PointValue, PointType: row.PointType, InvitationIdId: invitationId };
        await pnp.sp.web.lists.getByTitle(listName).items.add(payload);
      }
    }
    await fetchData(invitationId);
    message.success('Saved successfully');
    setLoading(false);
  }

  const cardStyles = { overflow: 'hidden', height: '100%' };
  const cardTitleStyle = {fontSize: '1.2rem', paddingLeft: 10};
  const onCancel = () => setPreviewVisible(false);
  return (
    <Modal
      title={<span>{invitation?.Title} - Response</span>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form} onFinish={onFinish} onFinishFailed={() => message.error('Please fill all required fields')}
        name='achievements_challenges_data'
        layout='vertical'
        disabled={loading}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>
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
                        <Button type="dashed" onClick={add}><PlusOutlined /></Button>
                      </div>}
                    </>
                )}
              </Form.List>
            </Card>
          </div>
          <div>
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
                      <Button type="dashed" onClick={add}><PlusOutlined /></Button>
                    </div>}
                  </>
                )}
              </Form.List>
            </Card>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button type='primary' htmlType='submit' size='large' loading={loading}>Save</Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

const ActionsDropdown = ({ item, handleDelete, handleResend, handleUpdate, listName }) => {
  const [open, setPreviewVisible] = React.useState(false);


  const onClick = ({ key }) => {
    switch (key) {
      case 'preview':
        setPreviewVisible(true);
        break;
      case 'close':
        handleUpdate(item.Id, { Status: "Closed", InviteCount: -1 });
        break;
      case 'resend':
        handleResend(item.Id);
        break;
      case 'delete':
        handleDelete(item.Id);
        break;
      default:
        break;
    }
  };

  const items = [
    {
      key: 'preview',
      label: 'Preview',
      icon: <EyeOutlined />
    },
    {
      key: 'close',
      label: 'Close',
      disabled: item?.Status === 'Closed',
      icon: <CheckCircleOutlined />
    },
    {
      key: 'resend',
      label: 'Resend',
      icon: <SendOutlined />
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Delete',
      danger: true,
      icon: <DeleteOutlined />
    },
  ];
  return (
    <>
      <Dropdown menu={{ items, onClick }} trigger={['click']} placement="bottomRight">
        <Button shape='circle'><MoreOutlined /></Button>
      </Dropdown>
      <PreviewInviteeResponse invitation={item} invitationId={item?.Id} listName={listName} open={open} setPreviewVisible={setPreviewVisible} />
    </>
  )
}