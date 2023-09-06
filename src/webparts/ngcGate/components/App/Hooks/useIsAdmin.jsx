import React from 'react';
import { AppCtx } from '../App';
import pnp from 'sp-pnp-js';


const useIsAdmin = (groupname) => {
  const { user_data } = React.useContext(AppCtx);
  const [admins, setAdmins] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  
  const fetchAdmins = async (gName) => {
    const groupName = gName;
    try {
      const users = await pnp.sp.web.siteGroups.getByName(groupName).users.get();
      setAdmins(users);
      return users;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const checkIsAdmin = async (gName) => {
    try {
      setLoading(true);
      const users = await fetchAdmins(gName);
      users.map(user => {
        if(user?.Email?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
          setIsAdmin(true);
        }
      });
      setLoading(false);
      return isAdmin;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  React.useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      checkIsAdmin(groupname);
    }
  }, [user_data]);

  return [isAdmin, checkIsAdmin, admins, fetchAdmins, loading];
};

export default useIsAdmin