import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ProtectRoutePowerBI from '../../Routers/ProtectRoutes/ProtectRoutePowerBI';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../App';
import pnp from 'sp-pnp-js';
import AntdLoader from '../Global/AntdLoader/AntdLoader';
import { Alert } from 'antd';
import PowerBIEmbed from '../Global/PowerBiEmbed/PowerBiEmbed';

const PreviewReport = () => {
  const { id } = useParams();
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();
  const [item, setItem] = useState({});

  const fetchItem = async () => {
    try {
      const response = await pnp.sp.web.lists.getByTitle('Power BI Interactive Dashboards').items.getById(id).get();
      setItem(response);
    } catch (error) {
      console.log(error);
    }
  }

  document.title = `.:: NGC Gate - ${item?.Title} ::.`;

  React.useEffect(() => { fetchItem(); }, []);

  return (
    <ProtectRoutePowerBI>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/power-bi-dashboards`)}>Power BI Interactive Dashboards</a>
        <p>{item?.Title}</p>
      </HistoryNavigation>

      <div className='standard-page'>
        {
          Object.keys(item).length === 0 
            ? <AntdLoader /> 
          
          : !item?.ReportId || !item?.WorkspaceId
            ? <Alert message='Report not found' type='error' banner />
          
          : <PowerBIEmbed
              reportId={item?.ReportId}
              groupId={item?.WorkspaceId}
              iframeClassName='bod-preview-iframe'
            />
        }
      </div>
    </ProtectRoutePowerBI>
  )
}

export default PreviewReport