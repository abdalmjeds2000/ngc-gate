import React, { useContext, useState } from 'react';
import './Attendance.css';
import Statistics from './Statistics/Statistics'
import DailyAttendance from './DailyAttendance/DailyAttendance'
import DailyAttendanceHR from './DailyAttendanceHR/DailyAttendanceHR'
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../App'
import AntdLoader from '../Global/AntdLoader/AntdLoader';
import useIsAdmin from '../Hooks/useIsAdmin';


function Attendance() {
  const { user_data, departments_info } = useContext(AppCtx);
  const [activeId, setActiveId] = useState(1);
  const [isAdminUser] = useIsAdmin("Attendance_Admin");



  const items = [
    { id: 1, text: "Statistics" },
    { id: 2, text: "Daily Attendance" },
  ];
  const adminItems = [
    { id: 3, text: "Daily Attendance HR" },
  ];




  if(Object.keys(user_data).length === 0) {
    return <AntdLoader />
  }
  return (
    <>
      <HistoryNavigation>
        <p>Attendance</p>
      </HistoryNavigation>


      <div className='attendance-page-container'>
        <div className="header">
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="35" viewBox="0 0 52.789 52.789">
              <g id="Group_78" data-name="Group 78" transform="translate(17 -2)">
                <g id="Group_36" data-name="Group 36" transform="translate(-17 2)">
                  <path id="Path_4755" data-name="Path 4755" d="M15.957,9.173h-.891a5.081,5.081,0,0,0,1.01-3.046V5.108a5.108,5.108,0,0,0-10.216,0V6.127a5.081,5.081,0,0,0,1.01,3.046H5.98A5.987,5.987,0,0,0,0,15.153V28.04a3.583,3.583,0,0,0,3.579,3.579h1.27V49.21a3.578,3.578,0,0,0,6.128,2.51A3.576,3.576,0,0,0,17.1,49.21V46.016a1.031,1.031,0,1,0-2.062,0V49.21a1.516,1.516,0,0,1-3.033,0V31.479a1.031,1.031,0,1,0-2.062,0V49.21a1.518,1.518,0,0,1-3.035,0V25.293h8.13v10.87a1.031,1.031,0,1,0,2.062,0V31.619h1.254a3.583,3.583,0,0,0,3.579-3.579V15.153a5.987,5.987,0,0,0-5.98-5.98ZM7.923,6.127V5.108a3.046,3.046,0,0,1,6.092,0V6.127a3.046,3.046,0,0,1-6.092,0ZM19.875,28.04a1.519,1.519,0,0,1-1.517,1.517H17.1V16.7a1.031,1.031,0,0,0-2.062,0v6.529H6.911V16.7a1.031,1.031,0,0,0-2.062,0V29.557H3.579A1.519,1.519,0,0,1,2.062,28.04V15.153A3.922,3.922,0,0,1,5.98,11.235h9.977a3.922,3.922,0,0,1,3.918,3.918V28.04Z" fill="#fff"/>
                  <path id="Path_4756" data-name="Path 4756" d="M146.921,390.06a1.031,1.031,0,1,0,.729.3A1.038,1.038,0,0,0,146.921,390.06Z" transform="translate(-130.848 -349.844)" fill="#fff"/>
                  <path id="Path_4757" data-name="Path 4757" d="M243.509,246.006H237.8a1.031,1.031,0,0,0,0,2.062h5.713a1.031,1.031,0,0,0,0-2.062Z" transform="translate(-212.354 -220.642)" fill="#fff"/>
                  <path id="Path_4758" data-name="Path 4758" d="M243.509,429.477H237.8a1.031,1.031,0,0,0,0,2.062h5.713a1.031,1.031,0,1,0,0-2.062Z" transform="translate(-212.354 -385.197)" fill="#fff"/>
                  <path id="Path_4759" data-name="Path 4759" d="M243.509,62.535H237.8a1.031,1.031,0,0,0,0,2.062h5.713a1.031,1.031,0,0,0,0-2.062Z" transform="translate(-212.354 -56.087)" fill="#fff"/>
                  <path id="Path_4760" data-name="Path 4760" d="M343.146,14.663a1.031,1.031,0,0,0,1.458,0L354,5.27a1.031,1.031,0,0,0,0-1.458l-3.5-3.5a1.031,1.031,0,0,0-1.458,0l-5.165,5.165-2.445-2.445a1.031,1.031,0,0,0-1.458,0l-3.5,3.5a1.031,1.031,0,0,0,0,1.458ZM340.7,5.219l2.445,2.445a1.031,1.031,0,0,0,1.458,0L349.769,2.5l2.041,2.041-7.935,7.935L338.66,7.261Z" transform="translate(-301.511 -0.009)" fill="#fff"/>
                  <path id="Path_4761" data-name="Path 4761" d="M350.5,183.783a1.031,1.031,0,0,0-1.458,0l-5.165,5.165-2.445-2.445a1.031,1.031,0,0,0-1.458,0l-3.5,3.5a1.031,1.031,0,0,0,0,1.458l6.673,6.673a1.031,1.031,0,0,0,1.458,0L354,188.741a1.031,1.031,0,0,0,0-1.458Zm-6.623,12.164-5.215-5.215,2.041-2.041,2.445,2.445a1.031,1.031,0,0,0,1.458,0l5.165-5.165,2.041,2.041Z" transform="translate(-301.511 -164.564)" fill="#fff"/>
                  <path id="Path_4762" data-name="Path 4762" d="M364,374.43l2.218-2.218a1.031,1.031,0,0,0,0-1.458l-3.5-3.5a1.031,1.031,0,0,0-1.458,0l-2.218,2.218-2.218-2.218a1.031,1.031,0,0,0-1.458,0l-3.5,3.5a1.031,1.031,0,0,0,0,1.458l2.218,2.218-2.218,2.218a1.031,1.031,0,0,0,0,1.458l3.5,3.5a1.031,1.031,0,0,0,1.458,0l2.218-2.218,2.218,2.218a1.031,1.031,0,0,0,1.458,0l3.5-3.5a1.031,1.031,0,0,0,0-1.458Zm-2.011,4.988-2.218-2.218a1.031,1.031,0,0,0-1.458,0l-2.218,2.218-2.041-2.041,2.218-2.218a1.031,1.031,0,0,0,0-1.458l-2.218-2.218,2.041-2.041,2.218,2.218a1.031,1.031,0,0,0,1.458,0l2.218-2.218,2.041,2.041-2.218,2.218a1.031,1.031,0,0,0,0,1.458l2.218,2.218Z" transform="translate(-315.316 -329.118)" fill="#fff"/>
                </g>
              </g>
            </svg>
          </div>
          <h2>Attendance</h2>
        </div>

        <div style={{position: 'relative'}}>
          <div className="buttons">
            <ul>
              {items.concat(isAdminUser ? adminItems : []).map((val, i) => (
                <li key={i} onClick={() => {setActiveId(val.id); }} className={activeId === val.id ? "active" : ""}>
                  {val.text}
                </li>
              ))}
            </ul>
          </div>
          <div className='attendance-sections-container'>
            <div style={{display: activeId !== 1 ? 'none' : ''}}>
              <Statistics />
            </div>
            <div style={{display: activeId !== 2 ? 'none' : ''}}>
              {
                departments_info?.length > 0
                ? <DailyAttendance />
                : <AntdLoader />
              }
            </div>
            {isAdminUser ? <div style={{display: activeId !== 3 ? 'none' : ''}}>
              {
                departments_info?.length > 0
                ? <DailyAttendanceHR />
                : <AntdLoader />
              }
            </div> : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default Attendance