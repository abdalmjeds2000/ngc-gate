import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../App';
import HistoryNavigation from '../Global/HistoryNavigation/HistoryNavigation';


function NGCPresentation() {
  const { defualt_route } = useContext(AppCtx);
  let navigate = useNavigate();

  return (
    <>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/ngc-profile`)}>NGC Profile</a>
        <p>NGC Presentation</p>
      </HistoryNavigation>
      <div className='folder-explorer-container'>  
        <iframe
          name='NGC Presentation'
          src='https://salic.sharepoint.com/sites/newsalic/KSA/Forms/Tiles.aspx?id=/sites/newsalic/KSA/KSA/Corporate Communication/01 Documents/Media Update&p=true&ga=1'
          width='100%'
          height='100%'
        >
        </iframe>
      </div>
    </>
  )
}

export default NGCPresentation