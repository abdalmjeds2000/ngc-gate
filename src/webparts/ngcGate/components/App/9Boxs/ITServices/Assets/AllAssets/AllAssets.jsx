import React, { useEffect } from 'react';
import { DatabaseOutlined, HomeOutlined, TableOutlined } from '@ant-design/icons';
import Tabs from '../../../../Global/CustomTabs/Tabs';
import HistoryNavigation from '../../../../Global/HistoryNavigation/HistoryNavigation';
import { useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NGCAssets from './components/NGCAssets';
import DeliveryLetters from './components/DeliveryLetters/DeliveryLetters';
import ProtectRouteIT from '../../../../../Routers/ProtectRoutes/ProtectRouteIT';


const AllAssets = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = '.:: NGC Gate | NGC\'s Assets ::.';
  }, []);
  
  return (
    <ProtectRouteIT>
      <HistoryNavigation>
        <a onClick={() => navigate(`/services-requests`)}>IT Service Center</a>
        <p>NGC's Assets</p>
      </HistoryNavigation>
      <div className='standard-page asset-managment-center-container'>
        <Tabs 
          loading={false}
          items={[
            {key: 1, icon: <HomeOutlined />, title: 'Dashboard', content: <Dashboard />},
            {key: 2, icon: <TableOutlined />, title: 'NGC Assets', content: <NGCAssets />},
            {key: 3, icon: <DatabaseOutlined />, title: 'Delivery Letters', content: <DeliveryLetters />},
          ]}
        />
      </div>
    </ProtectRouteIT>
  )
}

export default AllAssets;