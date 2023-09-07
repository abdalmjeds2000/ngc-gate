import React, { useEffect } from 'react'
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';


function Investment() {
  
  
  
  const editStyle = () => {
    var iframe = document.getElementById("spIframe");
    var elmnt = iframe.contentWindow.document.getElementsByClassName("od-ItemsScopeList-content")[0];
    elmnt.style.backgroundColor = "#fff";
  }

  return (
    <>
      <HistoryNavigation>
        <p>Organization Documents - Investment</p>
      </HistoryNavigation>

      <div className='folder-explorer-container'>  
        <iframe 
          src='https://salic.sharepoint.com/sites/newsalic/KnowledgeBase/Forms/SALIC%20Document.aspx?id=%2Fsites%2Fnewsalic%2FKnowledgeBase%2FInvestment&viewid=0cd60ccf%2D3d6a%2D47a0%2D89b0%2D88d7c90281c0' 
          width='100%' 
          id='spIframe'
          onLoad={editStyle}
        >
        </iframe>
      </div>
    </>
  )
}

export default Investment