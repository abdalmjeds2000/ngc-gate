import React from 'react';
import Numbers from './dashboard-items/Numbers';
import { ByPriority, ByType, CreatedToClosed, DepartmentStats } from './dashboard-items/Charts';
import './styles.css';


const ITDashboard = ({ params }) => {
  
  return (
    <>
      <div>
        <Numbers paramsFilter={params} />
      </div>
      <div className="it-dashboard-container">
        <DepartmentStats className="grid-child-1" paramsFilter={params} />
        <ByType className="grid-child-2" paramsFilter={params} />
        <ByPriority className="grid-child-3" paramsFilter={params} />
        <CreatedToClosed className="grid-child-4" />
      </div>
    </>
  )
}


export default ITDashboard;
