import React from 'react'
import { Avatar, Button, Image, Modal, Steps, Tag, Typography } from 'antd'
import { LoadingOutlined, UnorderedListOutlined } from '@ant-design/icons'
import pnp from 'sp-pnp-js';
import moment from 'moment';
import AntdLoader from '../Global/AntdLoader/AntdLoader';
import { AppCtx } from '../App';

const UserImage = ({ email }) => {
  const { sp_site } = React.useContext(AppCtx);
  return (
    <Avatar
      src={
        <Image
          src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${email}`}
          preview={{src: `${sp_site}/_layouts/15/userphoto.aspx?size=L&username=${email}`,}}
        />
      }
    />
  )
}


const ActionsHistory = ({ formKey, quarter, year, states }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [actions, setActions] = React.useState([]);

  const fetchActionsHistory = async () => {
    setLoading(true);
    try {
      /* expand Author */
      const _actions = await pnp.sp.web.lists.getByTitle('BoD Forms Approvals')
        .items.filter(`FormKey eq '${formKey}' and Quarter eq '${quarter}' and Year eq '${year}'`)
        .select('Author/Title,Author/EMail,ActionBy/Title,ActionBy/EMail,*').expand('Author,ActionBy').get();
        setActions(_actions);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }
  React.useEffect(() => { fetchActionsHistory(); }, [quarter, year, states]);

  const stepsItems = actions?.map((action, index) => {
    
    const title = (
      <div>

        <UserImage email={action?.Author?.EMail} /> Request by {action?.Author?.Title}<span style={{fontSize: '0.9rem', color: '#bbb'}}>, at {moment(action?.Created).format('MM/DD/YYYY h:mm A')}</span>
        {
          <div style={{paddingLeft: 50, lineHeight: 1.3}}>
            {
              action.Status !== 'Pending' ? (
                <>{action?.ActionBy?.Title} <span style={{ color: action.Status === 'Approved' ? '#277c62' : '#ff272b' }}>{action?.Status}</span><span style={{fontSize: '0.9rem', color: '#bbb'}}>, at {moment(action?.Modified).format('MM/DD/YYYY h:mm A')}</span></>
              ) : <span style={{ color: '#e99b4d' }}><LoadingOutlined /> Pending</span>
            }
          </div>
        }
      </div>
    );
    const description = action.Status !== 'Pending' ? <Typography.Text type="secondary"> 
      <div style={{paddingLeft: 50, lineHeight: 1}}>{action.Comments}</div>
    </Typography.Text> : null;
    return ({
      key: index,
      status: 'finish',
      title, 
      description, 
    })
  }
  );
  if(actions?.length === 0) return null;
  return (
    <>
      <Button type='primary' size='small' icon={<UnorderedListOutlined />} onClick={() => setOpenModal(true)}>
        History
      </Button>

      <Modal
        title={`Actions History :: ${quarter}/${year}`}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        destroyOnClose
        footer={null}
      >
        {loading && <AntdLoader />}
        <Steps progressDot direction="vertical" items={stepsItems} />
      </Modal>
    </>
  )
}

export default ActionsHistory