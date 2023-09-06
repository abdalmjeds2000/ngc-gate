import * as React from 'react';
import "./StatsCardV2.css"
import { Progress, RingProgress } from '@ant-design/plots';
import { Tooltip } from 'antd';

type Props = {
  pretitle: string|React.ReactNode;
  title: string|React.ReactNode;
  description: string|React.ReactNode;
  perc: number;
  progress: number;
  tooltip?: any;
}

const StatsCardV2 = ({ pretitle, title, description, perc, progress, tooltip }: Props) => {

  const progConfig = {
    height: 45,
    width: 45,
    autoFit: false,
    // percent: 0.77,
    color: ['#3a9bcc', '#EEEEEE'],
    innerRadius: 0.75,
    statistic: {
      content: {
        style: {
          fontSize: '12px',
        },
        formatter: (v: any) => `${Math.floor(v.percent*100)}%`,
      }
    },
  };

  const config = {
    height: 8,
    autoFit: true,
    barWidthRatio: 0.15,
    percent: perc,
    color: [perc > 0.75 ? '#C44633' : perc > 0.35 ? '#FFC26F' : '#23BB99', '#E8EDF3'],
  };
  
  return (
    <div id="stats-card-v2" >
      <Tooltip title={tooltip}>
        <div style={{position: "relative"}}>
          <span style={{display:"block",textAlign:"right", fontSize:12, position: "absolute", right: 0, top: -8}}>
            {Math.floor(perc*100)}%
          </span>
          <Progress {...config} />
        </div>
      </Tooltip>
      
      <div className='card'>
        <div className='meta'>
          <div className='info'>
            <span className='pretitle' title={`${pretitle}`}>{pretitle}</span>
            <span className='title' title={`${title}`}>{title}</span>
            <span className='subtitle' title={`${description}`}>{description}</span>
          </div>
        </div>
        <div className='progress'>
          <RingProgress {...progConfig} percent={progress} />
        </div>
      </div>
    </div>
  )
}

export default StatsCardV2