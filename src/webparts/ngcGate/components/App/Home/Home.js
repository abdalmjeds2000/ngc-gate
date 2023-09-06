import React, { useState, useEffect, useContext } from "react";
import { AppCtx } from '../App';
import Header from "../Header/Header";
import UserPanel from '../Global/UserPanel/UserPanel.js';
import HistoryNavigation from "../Global/HistoryNavigation/HistoryNavigation";
import PersonInfo from "../Home/First/PersonInfo/PersonInfo";
import PersonInfoMobile from "../Home/First/PersonInfoMobile/PersonInfoMobile";
import NumbersAttendance from './First/NumbersAttendance/NumbersAttendance';
import ThreeDivisions from './Second/ThreeDivisions';
import TranslateConverterNotes from './Third/TranslateConverterNotes';
import ClockComponent from "../Global/HistoryNavigation/ClockComponent";
import './Home.css';


function getScrollY() {
  const isScroll = typeof window !== "undefined" && window.scrollY > 0 ? true : false;
  return isScroll;
}


function Home() {
  const { user_data, notifications_count, mail_count, sp_site } = useContext(AppCtx);
  const [scrollSize, setScrollSize] = useState(getScrollY());


  useEffect(() => {
    window.scrollTo({top: 0, left: 0});
    function handleScrollY() {setScrollSize(getScrollY())}
    window.addEventListener('scroll', handleScrollY);    
  }, []);


  return (
    <>
      <div className="home-container">
        <Header style={{width: '100%', position: 'fixed', zIndex: '4'}}>
          {
            !scrollSize
            ? <div style={{position: 'fixed', right: '25px'}}>
                <ClockComponent EnableHijri={true} />
              </div>
            : <UserPanel 
                mobile={user_data.Data?.Mobile}
                mailTo='https://outlook.office.com/owa/'
                mailCount={mail_count}
                notificationsCount={notifications_count}
                userName={user_data.Data?.DisplayName}
                userImage={`${sp_site}/_layouts/15/userphoto.aspx?size=M&username=${user_data.Data?.Mail}`}
              />
          }
          
        </Header>
        <div style={{display: !scrollSize ? 'none' : ''}}>
          <HistoryNavigation>
            <p>Home Page</p>
          </HistoryNavigation>
        </div>

        <div className="container" style={{margin: '50px auto' /* THIS IS FOR HEADER IN TOP */}}>
          <PersonInfo />
          <PersonInfoMobile />
          <div className="home-division">
            <div className="home-info">
              <NumbersAttendance />
            </div>
          </div>
          <ThreeDivisions />
          <TranslateConverterNotes />
        </div>
      </div>
    </>
  )
}

export default Home