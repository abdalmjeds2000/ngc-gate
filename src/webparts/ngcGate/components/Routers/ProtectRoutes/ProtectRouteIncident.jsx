import React from 'react';
import useIsAdmin from '../../App/Hooks/useIsAdmin';



const ProtectRouteIncident = (props) => {
  const [isAdmin] = useIsAdmin('Incident_Admin');

  if(isAdmin) {
    return props.children
  }
  return <></>
}

export default ProtectRouteIncident