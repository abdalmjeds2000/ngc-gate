import React from 'react'
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';


function Legal() {

  const editStyle = () => {
    var iframe = document.getElementById("spIframe");
    var elmnt = iframe.contentWindow.document.getElementsByClassName("od-ItemsScopeList-content")[0];
    elmnt.style.backgroundColor = "#fff";
  }

  return (
    <>
      <HistoryNavigation>
        <p>Organization Documents - Legal</p>
      </HistoryNavigation>

      <div className='folder-explorer-container'>  
        <iframe 
          src='https://nationalgrain.sharepoint.com/sites/Portal/Organization%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FPortal%2FOrganization%20Documents%2FLegal&viewid=10b77fc5%2D2494%2D4f16%2Dbc95%2D83d8a16a2c16' 
          width='100%' 
          id='spIframe'
          onLoad={editStyle} 
        >
        </iframe>
      </div>
    </>
  )
}

export default Legal