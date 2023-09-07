import React from "react";
import HistoryNavigation from "../../Global/HistoryNavigation/HistoryNavigation";

function CorporateCommunication() {
  const editStyle = () => {
    var iframe = document.getElementById("spIframe");
    var elmnt = iframe.contentWindow.document.getElementsByClassName(
      "od-ItemsScopeList-content"
    )[0];
    elmnt.style.backgroundColor = "#fff";
  };

  return (
    <>
      <HistoryNavigation>
        <p>Organization Documents - Corporate Communication</p>
      </HistoryNavigation>
      <div className="folder-explorer-container">
        <iframe
          src="https://salic.sharepoint.com/sites/newsalic/KnowledgeBase/Forms/SALIC%20Document.aspx"
          width="100%"
          id="spIframe"
          onLoad={editStyle}
        ></iframe>
      </div>
    </>
  );
}

export default CorporateCommunication;
