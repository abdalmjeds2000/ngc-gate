import React from 'react';
import useIsAdmin from '../../App/Hooks/useIsAdmin';



const ProtectRouteAttendance = (props) => {
  const [isAdmin] = useIsAdmin('Attendance_Admin');

  if(isAdmin) {
    return props.children
  }
  return <></>
}

export default ProtectRouteAttendance