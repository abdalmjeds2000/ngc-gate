import React, { useContext } from 'react';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';
import { AppCtx } from '../../App';
import { useNavigate } from 'react-router-dom';


function SalicInNumbers() {
  const { defualt_route } = useContext(AppCtx);
  const navigate = useNavigate();

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/hc-services`)}>Human Capital Services</a>
        <p>SALIC In Numbers</p>
      </HistoryNavigation>
      <div className='folder-explorer-container'>  
        <iframe
          name='SALIC In Numbers'
          src="https://salic.sharepoint.com/sites/Portal/Lists/SALIC%20In%20Number/AllItems.aspx?viewid=191edcef%2D36ff%2D46a6%2Da453%2D6e93e4be2b7d"
          width='100%'
          height='100%'
          id='salic_in_numbers_iframe'
        >
        </iframe>
      </div>
    </>
  )
}

export default SalicInNumbers