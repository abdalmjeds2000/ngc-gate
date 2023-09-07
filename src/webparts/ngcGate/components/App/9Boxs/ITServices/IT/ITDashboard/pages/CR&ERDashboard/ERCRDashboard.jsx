import React from 'react';
import Numbers from './dashboard-items/Numbers';
import { ByClassification, ByPriority, DepartmentStats, RequestsList } from './dashboard-items/Charts';
import "./styles.css";

const ERCRDashboard = ({ params }) => {

  return (
    <>
      <div>
        <Numbers paramsFilter={params} />
      </div>
      <div className="er-cr-dashboard-container">
        <DepartmentStats className="grid-child-1" paramsFilter={params} />
        <ByClassification className="grid-child-2" paramsFilter={params} />
        <ByPriority className="grid-child-3" paramsFilter={params} />
        <RequestsList className="grid-child-4" paramsFilter={params} />
      </div>
    </>
  )
}

export default ERCRDashboard;
