import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicesSection.css';
import { Typography } from 'antd';
import { MdOpenInNew } from 'react-icons/md';

const ServicesSection = ({ title, items, headerIcon, extraHeader }) => {
  const navigate = useNavigate();


  return (
    <div className='services-page-container' style={{ marginBottom: items?.length > 0 ? 70 : 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 7 }}>
        <div className="header">
          {headerIcon}
          <h2>{title}</h2>
        </div>
        <div>
          {extraHeader}
        </div>
      </div>

      <div className='services-body-container'>
        <div className="services-boxs-container">
          {items.map((service, i) => {
            // if service is hidden, don't render it
            if (service?.hidden) return null;
            return ( 
              <a
                key={i}
                className="box"
                onClick={() => {
                  service.isLink
                  ? window.open(service.to, "_blank")
                  : navigate(service.to)
                }}
              >
                <div className='img-container' style={{ backgroundColor: service.bgColor }}>
                  {service.icon}
                </div>
                <div>
                  <h3>{service.text} {service.isLink ? <span className='open-in-new'><MdOpenInNew /></span> : ''}</h3>
                  { service.description ? <Typography.Text type='secondary'>{service.description}</Typography.Text> : null }
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ServicesSection