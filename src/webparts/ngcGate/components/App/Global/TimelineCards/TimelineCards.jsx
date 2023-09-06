import React from 'react';
import './TimelineCards.css';
import { Timeline, Typography } from 'antd';

const TimelineCards = ({ items }) => {

  if(!items || !items?.length) return null;

  return (
    <div>
      <Timeline mode="left" className='custom-antd-timeline-cards'>
        {
          items?.map((item, indx) => {
            const label = <div className='label-container'>
              <Typography.Text className='label-title'>{item.label}</Typography.Text>
              <Typography.Text className='label-desc' type='secondary'>{item.describtion}</Typography.Text>
            </div>
            return (
              <Timeline.Item key={indx} label={label}>
                <div className={`card-container ${item.status === 'closed' ? 'closed' : 'pending'}`}>
                  <Typography.Text className='card-title'>{item.cardTitle}</Typography.Text>
                  <div>{item.cardDescribtion}</div>
                </div>
              </Timeline.Item>
            )
          })
        }
        
      </Timeline>
    </div>
  )
}

export default TimelineCards