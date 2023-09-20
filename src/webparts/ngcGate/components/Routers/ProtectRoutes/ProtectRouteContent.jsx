import React from 'react';
import useIsAdmin from '../../App/Hooks/useIsAdmin';



const ProtectRouteContent = (props) => {
  const [isAdmin] = useIsAdmin('Content_Admin');

  if(isAdmin) {
    return props.children
  }
  return <></>
}

export default ProtectRouteContent