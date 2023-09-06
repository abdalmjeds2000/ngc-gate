import React from 'react';
import { AppCtx } from '../App';
import pnp from 'sp-pnp-js';


const useCheckIsBoDFormAdmin = (formKey) => {
  const { user_data } = React.useContext(AppCtx);
  const [admins, setAdmins] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  
  const fetchPageInfo = async () => {
    try {
      const response = await pnp.sp.web.lists.getByTitle("BoD Pages Info").items
        .filter(`PageKey eq '${formKey}'`)
        .expand("Users")
        .select("*, Users/Id, Users/Title, Users/EMail")
        .get();
      return response[0]?.Users || [];
    } catch (error) {
      return [];
    }
  };


  const checkIsAdmin = async () => {
    try {
      setLoading(true);
      const users = await fetchPageInfo();
        users.map(user => {
          if(user?.EMail?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase()) {
            setIsAdmin(true);
          }
        });
      setAdmins(users);
      return isAdmin;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      checkIsAdmin();
    }
  }, [user_data]);

  return [isAdmin, admins, loading];
};

export default useCheckIsBoDFormAdmin