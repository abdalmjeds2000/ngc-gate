import { RadialBar } from '@ant-design/plots';
import { Tooltip } from 'antd';
import React from 'react';
import { roundedNum } from '../roundedNum';


const AttendanceChart = ({ data, totalBalance, total, width, height }) => {
  const configRadialBar = {
    data,
    width: width,
    height: height,
    xField: 'name',
    yField: 'value',
    radius: 1,
    innerRadius: 0.5,
    colorField: 'name',
    tooltip: {
      formatter: (label) => {
        if(label.name === "Leave Balance") {
          return { name: `Total balance is ${roundedNum(totalBalance)} days till end of the year, ${roundedNum(totalBalance-15) > 0 ? roundedNum(totalBalance-15) : 0} days of them must consumed this year`, value: `` };
        }
        return label
      },
    },
    color: ({ name }) => {
      if (name === 'Consumed This Year') {
        return '#D59F29'; 
      } else if (name === 'Available Balance This Year') {
        return '#FEF2E3';
      } else if (name === 'Leave Balance') {
        return '#50220E';
      }
      return '#E98EAD';
    },
    isStack: true,
    maxAngle: 270,
    animation: {appear: {animation: 'none'}},
  };
  
  return (
    <div className='attendance-chart-container'>
      <Tooltip placement="top" title="Current Balance">
        <a className='mid-total' href='https://hen.fa.em2.oraclecloud.com/fscmUI/faces/deeplink?objType=ABSENCE_BALANCE&action=NONE' target='_blank'>{total}</a>
      </Tooltip>
      <RadialBar {...configRadialBar} style={{width: '100%'}} />
    </div>
  )
}

export default AttendanceChart