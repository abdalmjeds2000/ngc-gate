import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import pnp from 'sp-pnp-js';
import { Button, Col, Empty, Row, Tag, Typography, message } from 'antd';
import { AppCtx } from '../../App';
import AntdLoader from '../../Global/AntdLoader/AntdLoader';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { CheckSquareOutlined, ClockCircleOutlined, LoadingOutlined, RedoOutlined, TeamOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import moment from 'moment';


const AchievementsChallenges = () => {
  const { user_data, defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const invitations_listName = 'Achievements & Challenges - Invitations';
  const [loading, setLoading] = React.useState(false);
  const [invitations, setInvitations] = React.useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const invitations = await pnp.sp.web.lists.getByTitle(invitations_listName).items
        .select('Author/Title,Author/EMail,SectorAdmin/Title,SectorAdmin/EMail,*').expand('Author,SectorAdmin')
        .filter(`SectorAdmin/EMail eq '${user_data?.Data?.Mail}'`)
        .orderBy('Created', false).get();
      setInvitations(invitations);
    } catch (error) {
      message.error('Something went wrong, please try again later');
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { 
    if(Object.keys(user_data)?.length === 0) return;
    fetchData();
  }, [user_data]);


  document.title = '.:: SALIC Gate :: Achievements & Challenges ::.';

  const TitleBlock = ({label, title, size, style}) => (
    <div style={style}>
      {label ? <Typography.Text type='secondary' style={{ display: 'block' }}>{label}</Typography.Text> : null}
      {title ? <Typography.Text style={{ fontSize: size === "large" ? '1.2rem' : '1rem', display: 'block', fontWeight: size === "large" ? 500 : 400 }}>{title}</Typography.Text> : null}
    </div>
  );

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/hc-services`)}>Human Capital Services</a>
        <p>Achievements & Challenges</p>
      </HistoryNavigation>


      <div className="table-page-container">
        <div className='content'>
          <div className="header">
            <h1><span style={{fontWeight: 500}}>{user_data?.Data?.DisplayName}</span>'s Achievements & Challenges Invitations</h1>
            <div>
              <Button size='small' loading={loading} icon={<RedoOutlined />} onClick={fetchData}>Refresh</Button>
            </div>
          </div>

          <div className='form'>
            <div style={{ marginTop: 15, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gridGap: 25 }}>
              { 
                !loading && invitations.length > 0 ?
                  invitations?.map((item, index) => {
                    return (
                      <Link key={index} className='_achiev-chall_card-container' to={`${defualt_route}/performance-managment/achievements-challenges/${item?.Id}`}>
                        <TitleBlock /* label={<><TeamOutlined /> Sector</>} */ title={item?.Title} size="large" style={{ marginBottom: 10 }} />
                        <Row gutter={[2, 6]} style={{ marginBottom: 7 }}>
                          <Col span={12}>
                            <TitleBlock label={<><UserOutlined /> Sector Manager</>} title={item?.SectorAdmin?.Title || ' - '}  />
                          </Col>
                          <Col span={12}>
                            <TitleBlock label={<><UserSwitchOutlined /> Invited By</>} title={item?.Author?.Title || ' - '} />
                          </Col>
                        </Row>
                        <Row gutter={[2, 6]}>
                          <Col span={24}>
                            <TitleBlock label={<><ClockCircleOutlined /> Invited At</>} title={moment(item?.Created).format('MM/DD/YYYY h:mm A')} />
                          </Col>
                        </Row>
                        <span style={{ position: 'absolute', top: 17, right: 10 }}>
                          {item?.Status === 'Pending' ? <Tag color="#e99b4d">{<>{item?.Status === 'Pending' ? <LoadingOutlined /> : <CheckSquareOutlined />} {item?.Status}</>}</Tag> : <Tag color="#66b4ea">{item?.Status}</Tag>}
                        </span>
                      </Link>
                    )
                  })
                : null
              }
            </div>
            {invitations.length === 0 && !loading && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            {invitations.length === 0 && loading && <AntdLoader />}
          </div>
        </div>
      </div>
    </>
  )
}

export default AchievementsChallenges
