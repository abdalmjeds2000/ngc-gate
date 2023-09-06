import React from 'react';
import useIsAdmin from '../../App/Hooks/useIsAdmin';


const ProtectRouteIT = (props) => {
  const [isItAdmin] = useIsAdmin('IT_Admin');

  if(isItAdmin) {
    return props.children
  }
  return <></>
}

export default ProtectRouteIT