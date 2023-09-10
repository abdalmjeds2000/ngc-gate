import React from 'react';
import { PictureOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Timeline } from 'react-twitter-widgets';


const SocialMedia = () => {
  let navigate = useNavigate();

  return (
    <div className='division-3'>
      <div className="organization-documents-container" style={{marginBottom: 25}}>
        <div className="header">
          <h3>NGC Content</h3>
        </div>
        <div className="boxs">
          <a onClick={_ => navigate('/content-requests')} className="oranization-documents">
            <div>
              <PictureOutlined style={{fontSize: '1.5rem'}} />
            </div>
            <p>New Content Request</p>
          </a>
        </div>
      </div>

      <div className="twitter-wid">
        <div className="header">
          <h3>Social Media</h3>
        </div>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: 'KSA_SALIC'
          }}
          options={{
            height: '850'
          }}
        />
      </div>

    </div>
  )
}

export default SocialMedia