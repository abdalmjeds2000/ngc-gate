import React from 'react';
import useIsAdmin from '../../App/Hooks/useIsAdmin';



const ProtectRouteCommunication = (props) => {
  const [isAdmin] = useIsAdmin('Communication_Admin');

  if(isAdmin) {
    return props.children
  }
  return <></>
}

export default ProtectRouteCommunication