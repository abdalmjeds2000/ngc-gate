import React, { useState } from "react";
import './ESignatureTool.css';
import HistoryNavigation from "../../Global/HistoryNavigation/HistoryNavigation";
import ESignRequests from './eSignRequests/ESignRequests';
import YouSignedIt from './YouSignedIt/YouSignedIt';


function ESignatureTool() {
  const [activeId, setActiveId] = useState(1);
  const subMenuItems = [
    { id: 1, text: "eSign Requests" },
    { id: 2, text: "eSign Documents You Signed it" },
  ];

  return (
    <>
      <HistoryNavigation>
        <p>eSign</p>
      </HistoryNavigation>
      <div className='eSign-page-container'>
        <div className="header">
          <div className="icon">
            <svg id="Iconly_Light_Edit" data-name="Iconly/Light/Edit" xmlns="http://www.w3.org/2000/svg" width="22.603" height="22.364" viewBox="0 0 22.603 22.364">
              <g id="Edit" transform="translate(0.751 0.75)">
                <path id="Stroke_1" data-name="Stroke 1" d="M8.5,1.25H0A.75.75,0,0,1-.75.5.75.75,0,0,1,0-.25H8.5a.75.75,0,0,1,0,1.5Z" transform="translate(12.599 20.364)" fill="#fff"/>
                <path id="Stroke_3" data-name="Stroke 3" d="M13.347-.75a3.976,3.976,0,0,1,2.413.9L17.613,1.6a3.942,3.942,0,0,1,1.466,2.208,3.1,3.1,0,0,1-.623,2.606L7.4,20.514a2.711,2.711,0,0,1-2.115,1.045l-4.261.055a.75.75,0,0,1-.74-.58L-.679,16.88a2.72,2.72,0,0,1,.509-2.3L10.883.478A3.089,3.089,0,0,1,13.347-.75ZM1.611,20.106l3.659-.047a1.219,1.219,0,0,0,.952-.47l11.052-14.1a1.874,1.874,0,0,0-.587-2.708L14.834,1.327A2.478,2.478,0,0,0,13.347.75a1.577,1.577,0,0,0-1.284.654L1.011,15.5A1.226,1.226,0,0,0,.782,16.54Z" transform="translate(0 0)" fill="#fff"/>
                <path id="Stroke_5" data-name="Stroke 5" d="M6.391,5.761a.747.747,0,0,1-.462-.16L-.463.59A.75.75,0,0,1-.59-.463.75.75,0,0,1,.463-.59L6.855,4.42a.75.75,0,0,1-.463,1.34Z" transform="translate(9.403 3.581)" fill="#fff"/>
              </g>
            </svg>
          </div>
          <h2>E Signature Document</h2>
        </div>



        <div className="content">
          <div className="buttons">
            <ul>
              {subMenuItems.map((val, i) => (
                <a href={`#${val.id}`}>
                  <li key={i} onClick={() => {setActiveId(val.id); }} className={activeId === val.id ? "active" : ""}>
                    {val.text}
                  </li>
                </a>
              ))}
            </ul>
          </div>
          <div className='eSign-tables'>
            <div style={{ display: activeId === 1 ? "block" : "none" }}>
              <ESignRequests />
            </div>
            <div style={{ display: activeId === 2 ? "block" : "none" }}>
              <YouSignedIt />
            </div>
          </div>
        </div>



      </div>
    </>
  )
}

export default ESignatureTool