import React from 'react'
import { useNavigate } from 'react-router-dom';
import ProtectRoutePowerBI from '../../../../Routers/ProtectRoutes/ProtectRoutePowerBI';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';


function DemandForecast() {
  const navigate = useNavigate();  


  return (
    <ProtectRoutePowerBI>
      <HistoryNavigation>
        <a onClick={() => navigate(`/power-bi-dashboards`)}>Power BI Interactive Dashboards</a>
        <a onClick={() => navigate(`/power-bi-dashboards/research`)}>Research</a>
        <p>Demand Forecast</p>
      </HistoryNavigation>
      
      <div className='folder-explorer-container'>

        <div className='power-bi-iframe-container'>
          <iframe 
            title="Demand Forecast" 
            width="100%" 
            height="100%" 
            src="https://app.powerbi.com/reportEmbed?reportId=25a41fc2-8a3d-4f86-a6b3-44cfbe9eb59f&autoAuth=true&ctid=bea1b417-4237-40b8-b020-57fce9abdb43" 
            frameborder="0" 
            allowFullScreen="true"
          ></iframe>
        </div>
        
      </div>
    </ProtectRoutePowerBI>
  )
}

export default DemandForecast