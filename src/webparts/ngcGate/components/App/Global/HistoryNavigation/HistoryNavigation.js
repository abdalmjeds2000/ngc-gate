import React from 'react';
import './HistoryNavigation.css';
import { useNavigate } from 'react-router-dom';
import ClockComponent from './ClockComponent';

const HistoryNavigation = (props) => {
  let navigate = useNavigate();

  return (
    <div className='history-navigation'>
      <div className="links">
        <a onClick={() => navigate("/home")}>NGC Gate</a>
        {props.children}
      </div>
      <ClockComponent EnableHijri={false} />
    </div>
  )
}

export default HistoryNavigation