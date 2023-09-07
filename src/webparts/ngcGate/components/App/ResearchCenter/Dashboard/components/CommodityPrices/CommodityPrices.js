import React, { useEffect, useState } from 'react';
import './CommodityPrices.css';
import GetCommodityPrices from '../../API/GetCommodityPrices';
import { Col, Tabs, Typography } from 'antd';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';
import PowerBiEmbed from '../../../../Global/PowerBiEmbed/PowerBiEmbed';

function CommodityPrices() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const FetchData = async () => {
    const response = await GetCommodityPrices();
    if(Object.keys(response).length > 1) {
      setData(response);
    }
    setLoading(false);
  }

  useEffect(() => {
    FetchData();
  }, []);


  const renderTabs = (
    data?.map((link, i) => (
      <Tabs.TabPane tab={link.Title} key={i}>
        <iframe 
          title={link.Title} 
          width="100%" 
          height="100%" 
          src={link.Link}
          frameborder="0" 
          allowFullScreen="true"
          style={{minHeight: 'calc(100vh - 85px)', marginBottom: 25}}
        />
        {/* <PowerBiEmbed
          reportId={link.ReportId}
          groupId={link.WorkspaceId}
          iframeClassName='research-center-dashboard-iframe'
        /> */}
      </Tabs.TabPane>
    ))
  );

  return (
    <div className='commodity-prices-container'>
      <Typography.Title level={3} style={{lineHeight: 2.5}}>Business Intelligence Dashboards</Typography.Title>
      <Col xs={0} sm={0} md={0} lg={24} style={{padding: 0}}>
        <div className='desktop-tabs'>
          <Tabs defaultActiveKey="0" tabPosition='left' size='large'>
            {loading ? <AntdLoader /> : renderTabs}
          </Tabs>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={0} style={{padding: 0}}>
        <div className='mobile-tabs'>
          <Tabs defaultActiveKey="0" tabPosition='top' size='small'>
            {
              data?.map((link, i) => (
                <Tabs.TabPane tab={link.Title} key={i}>
                  {loading ? <AntdLoader /> : renderTabs}
                </Tabs.TabPane>
              ))
            }
          </Tabs>
        </div>
      </Col>
    </div>
  ) 
}

export default CommodityPrices