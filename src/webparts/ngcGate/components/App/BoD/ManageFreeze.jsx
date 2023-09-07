import React, { useContext } from 'react';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../App';
import pnp from 'sp-pnp-js';
import { Button, Descriptions, Form, Space, Switch, message } from 'antd';
import { FileTextOutlined, LoadingOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import UserColumnInTable from '../Global/UserColumnInTable/UserColumnInTable';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import useIsAdmin from '../Hooks/useIsAdmin';
import AntdLoader from '../Global/AntdLoader/AntdLoader';


function ManageFreeze() {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [pages, setPages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isBoDAdmin] = useIsAdmin("BoD Admins");

  const fetchPages = async () => {
    try {
      const response = await pnp.sp.web.lists.getByTitle('BoD Pages Info').items
        .expand("Users,Manager")
        .select("*, Users/Id, Users/Title, Users/EMail, Users/Name, Manager/Title, Manager/EMail, Manager/Id")
        .get();
      const pagesWithoutFinance = response.filter(page => !['finance_master', 'key_financial_metrics'].includes(page?.PageKey));
      setPages(pagesWithoutFinance);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => { fetchPages(); }, []);

  // when change the status of the page, we need to get users from page info users field and add them to form group, or delete them from the group
  const handleGroupsPermissions = async (checked, id, pageKey, groupName) => {
    setLoading(true);
    // add or remove users from group
    try {
      const formUsers = pages?.find(page => page.PageKey === pageKey)?.Users || [];
      const groupUsers = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
      if (checked) {
        // add users to group
        const usersToAdd = formUsers?.filter(user => !groupUsers?.map(user => user?.Email?.toLowerCase()).includes(user?.EMail?.toLowerCase()));
        await Promise.all(usersToAdd.map(user => pnp.sp.web.siteGroups.getByName(groupName).users.add(user.Name)));
      } else {
        let usersToRemove = formUsers?.filter(user => groupUsers?.map(user => user?.Email?.toLowerCase()).includes(user?.EMail?.toLowerCase()));
        await Promise.all(usersToRemove.map(user => pnp.sp.web.siteGroups.getByName(groupName).users.removeById(user.Id)));
      }
    } catch (error) {
      message.error('Something went wrong, please try again later');
      return;
    }
    // update page flag in list to be active or inactive
    try {
      await pnp.sp.web.lists.getByTitle('BoD Pages Info').items.getById(id).update({IsActive: checked});
      const newPages = pages.map(page => page.Id === id ? {...page, IsActive: checked} : page);
      setPages(newPages);
    } catch (error) {
      message.error('Something went wrong, please try again later');
    } finally {
      message.success('Page status updated successfully');
      setLoading(false);
    }
  }

  document.title = '.:: SALIC Gate :: BoD Freeze/Unfreeze ::.';

  if(!isBoDAdmin) return <AntdLoader />;
  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(defualt_route + '/bod')}>BoD</a>
        <p>BoD Manage Freeze</p>
      </HistoryNavigation>

      <div className="table-page-container freeze-page">
        <div className='content'>
          <div className="header">
            <h1>{loading && <LoadingOutlined />} Manage freeze/unfreeze on BoD Pages</h1>
          </div>

          <div className='form'>
            {
              pages?.map((page, index) => (
                  <Descriptions key={index} bordered size='small' column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1, }} style={{ marginBottom: 25 }}>
                    <Descriptions.Item label={<><FileTextOutlined /> Form Name</>} span={24}>
                      <span style={{fontWeight: 600, fontSize: '1rem'}}>{page?.Title}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<><UserOutlined /> Manager</>}>
                      {/* <UserColumnInTable Mail={page?.Manager?.EMail} DisplayName={page?.Manager?.Title} /> */}
                      <EditableManager page={page} onFinish={fetchPages} />
                    </Descriptions.Item>
                    <Descriptions.Item label={<><SwapOutlined /> Turn on/off</>} span={24}>
                      <SwitchComponent checked={page?.IsActive} handleChange={checked => handleGroupsPermissions(checked, page?.Id, page.PageKey, page.UsersGroupName)} />
                    </Descriptions.Item>
                  </Descriptions>
                )
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageFreeze


/* switch component */
const SwitchComponent = ({ checked, handleChange }) => {
  const [loading, setLoading] = React.useState(false);

  const onChange = async (checked) => {
    setLoading(true);
    try {
      await handleChange(checked);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
    

  return (
    <Switch
      checkedChildren='Active'
      unCheckedChildren='InActive'
      onChange={onChange}
      loading={loading}
      defaultChecked={checked} />
  )
}


const EditableManager = ({ page, onFinish }) => {
  const [form] = Form.useForm();
  const [updateMode, setUpdateMode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState({});
  const { sp_context } = useContext(AppCtx);

  const handleUpdate = async () => {
    if(!user || Object.keys(user).length === 0) {
      message.error('Please select a manager');
      return;
    }
    setLoading(true);
    try {
      await pnp.sp.web.lists.getByTitle('BoD Pages Info').items.getById(page?.Id).validateUpdateListItem([
        {
          FieldName: 'Manager',
          FieldValue: JSON.stringify([{ "Key": user?.loginName }]),
        }
      ]);
      message.success('Manager updated successfully');
      if(onFinish) onFinish();
    } catch (error) {
      console.log(error);
    }
    setUpdateMode(false);
    setLoading(false);
  }
  console.log(user);
  return (
    <div className='editable-manager'>
      {
        updateMode ? (
          <Form form={form} onFinish={handleUpdate} onFinishFailed={() => message.error('Please fill all required fields')}>
            <Space size={4}>
            <PeoplePicker
              context={sp_context}
              personSelectionLimit={1}
              defaultSelectedUsers={[page?.Manager?.EMail]}
              showtooltip={true}
              required={true}
              onChange={items => setUser(items[0])}
              principalTypes={[PrincipalType.User]}
              resolveDelay={500} />
              <Button type='primary' loading={loading} onClick={handleUpdate}>Update</Button>
              <Button type='default' onClick={() => setUpdateMode(false)}>Cancel</Button>
            </Space>
          </Form> 
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 2}}>
            <UserColumnInTable Mail={page?.Manager?.EMail} DisplayName={page?.Manager?.Title} />
            <Button type='link' onClick={() => setUpdateMode(true)}>Change</Button>
          </div>
        )
      }
    </div>
  )
}