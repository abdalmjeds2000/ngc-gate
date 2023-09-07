import React, { useContext } from 'react';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { TableOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import CreateForm from './_CreateForm';
import ManageInvitations from './_ManageInvitations';
import Tabs from '../../../Global/CustomTabs/Tabs';

const AchievementsChallengesAdmin = () => {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const invitations_listName = 'Achievements & Challenges - Invitations';


  const tabsItems = [
    {
      key: 'manage_invitations', 
      icon: <TableOutlined />, 
      title: 'Manage Invitations', 
      content: <ManageInvitations listName={invitations_listName} />
    },{
      key: 'create_invitation',
      icon: <UsergroupAddOutlined />,
      title: 'Create Invitation',
      content: <CreateForm listName={invitations_listName} />
    }
  ];


  document.title = '.:: SALIC Gate :: Achievements & Challenges ::.';

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/hc-services`)}>Human Capital Services</a>
        <p>Achievements & Challenges</p>
      </HistoryNavigation>

      <div className="standard-page">
        <Tabs items={tabsItems} />
      </div>
    </>
  )
}

export default AchievementsChallengesAdmin