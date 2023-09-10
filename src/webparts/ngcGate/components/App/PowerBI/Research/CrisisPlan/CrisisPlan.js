import React from 'react'
import { useNavigate } from 'react-router-dom';
import ProtectRoutePowerBI from '../../../../Routers/ProtectRoutes/ProtectRoutePowerBI';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';


function CrisisPlan() {
  const navigate = useNavigate();
  
  return (
    <ProtectRoutePowerBI>
      <HistoryNavigation>
        <a onClick={() => navigate(`/power-bi-dashboards`)}>Power BI Interactive Dashboards</a>
        <a onClick={() => navigate(`/power-bi-dashboards/research`)}>Research</a>
        <p>Crisis Plan</p>
      </HistoryNavigation>
      
      <div className='folder-explorer-container'>

        <div className='power-bi-iframe-container'>
          <iframe 
            title="Crisis Plan" 
            width="100%" 
            height="100%" 
            src="https://app.powerbi.com/reportEmbed?reportId=7fc5a5f0-a8ea-45f5-a3d7-c8fc0a2070b2&autoAuth=true&ctid=bea1b417-4237-40b8-b020-57fce9abdb43" 
            frameborder="0" 
            allowFullScreen="true"
          ></iframe>
        </div>
        
      </div>
    </ProtectRoutePowerBI>
  )
}

export default CrisisPlan