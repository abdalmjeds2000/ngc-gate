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
          src="https://nationalgrain.sharepoint.com/sites/Portal/Organization%20Documents/Forms/AllItems.aspx"
          width="100%"
          id="spIframe"
          onLoad={editStyle}
        ></iframe>
      </div>
    </>
  );
}

export default CorporateCommunication;
