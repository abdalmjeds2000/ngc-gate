import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import SimpleUserPanel from "../Global/SimpleUserPanel/SimpleUserPanel";
import { CalendarOutlined, CloseOutlined, LockOutlined, MenuOutlined, SettingOutlined, TeamOutlined, WarningOutlined, WindowsOutlined } from "@ant-design/icons";
import { svgIcons } from './icons';
import { AppCtx } from "../App";
import { MdOpenInNew } from "react-icons/md";
import useIsAdmin from "../Hooks/useIsAdmin";
import "./SidebarNav.css";




const activeStyle = {
  borderLeft: "4px solid var(--second-color)",
  backgroundColor: "#00000010",
  padding: "6px 12px 6px 8px",
  fontSize: "0.9rem",
};

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}
const capitalize = (s) => s[0]?.toUpperCase() + s.slice(1);



const SidebarNav = ({spWebUrl}) => {
  const { sp_site } = useContext(AppCtx);
  const navigate = useNavigate();
  const [isNavBarLarge, setIsNavBarLarge] = useState(false);
  const [isCommAdmin] = useIsAdmin('Communication_Admin');
  const [isItAdmin] = useIsAdmin('IT_Admin');
  // const [isPowerBIAdmin] = useIsAdmin('HR_Power_BI');
  
  // read window size
  const [windowSize, setWindowSize] = useState(getWindowSize());
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);


  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState(location.pathname);
  useEffect(() => {
    setActiveRoute(location.pathname);
    // change site title based on current location pathname
    const title = location.pathname.split("/");
    document.title = `.:: NGC Gate | ${capitalize(
      title[title.length - 1]
    ).replace("-", " ")} ::.`;
  }, [location.pathname]);

  
  const antdIconStyle = {
    minWidth: "35px",
    fontSize: isNavBarLarge ? "2.2rem" : "1.7rem",
    justifyContent: "center"
  };







  const listItems = [
    { to: "/home", icon: svgIcons.home, text: "Home", link: false },
    {
      to: "/community-news",
      icon: svgIcons.news,
      text: "NGC News",
      link: false,
    },{
      icon: svgIcons.NGCWebsite,
      text: "NGC Website",
      link: true,
      to: "https://ngcenergy.com.sa/",
    },{
      icon: svgIcons.OracleERP,
      text: "Oracle ERP",
      link: true,
      to: "https://hen.fa.em2.oraclecloud.com/fscmUI/adfAuthentication?level=FORM&success_url=%2FfscmUI%2FadfAuthentication",
    },{
      to: "/power-bi-dashboards",
      icon: svgIcons.PowerBi,
      // text: "Power Bi",
      text: "Dashboard",
      link: false,
    },{
      to: "/manage-news-content",
      icon: svgIcons.ManageNewsContent,
      text: "Manage News Content",
      link: false,
    },{
      to: "/incidents-center",
      icon: <WarningOutlined style={{ ...antdIconStyle }} />,
      text: "Incidents Center",
      link: false,
    },{
      to: "/manage-events",
      icon: (<CalendarOutlined style={{ ...antdIconStyle }} />),
      text: "Manage Events",
      link: false,
    },{
      to: "/communication",
      icon: (<TeamOutlined style={{ ...antdIconStyle }} />),
      text: "Communication",
      link: false,
    }
  ];

  const settingsItems = [
    { to: "https://myaccount.microsoft.com", icon: (<WindowsOutlined style={{ ...antdIconStyle }} />), text: "Microsoft Account", link: true },
    { to: `${sp_site}/_layouts/15/settings.aspx`, icon: (<SettingOutlined style={{ ...antdIconStyle }} />), text: "Site Setting", link: true },
    { to: "https://account.activedirectory.windowsazure.com/ChangePassword.aspx", icon: (<LockOutlined style={{ ...antdIconStyle }} />), text: "Change Password", link: true },
  ];




  /* is not admin ? filter sidebar items : return all items */
  let protectedListItems = listItems;
  if(!isCommAdmin) {
    protectedListItems = protectedListItems.filter(item => !["/manage-events", "/manage-news-content"].includes(item.to))
  }
  // if(!isPowerBIAdmin) {
  //   protectedListItems = protectedListItems.filter(item => !["/power-bi-dashboards"].includes(item.to))
  // }



  return (
    <>
      {activeRoute !== `${spWebUrl}/home` && (<SimpleUserPanel />)}
      <nav
        className={ isNavBarLarge ? "nav-container nav-container-large" : "nav-container nav-container-small" }
        style={
          windowSize.innerWidth < 800 && !isNavBarLarge ? { padding: 0 } : {}
        }
      >
        <div className="nav-open" onClick={() => setIsNavBarLarge(!isNavBarLarge)} >
          {isNavBarLarge ? <CloseOutlined /> : <MenuOutlined />}
        </div>

        <ul style={ windowSize.innerWidth < 800 && !isNavBarLarge ? { display: "none" } : {} } >
          {protectedListItems
            .map((item, i) => {
              return (
                <li key={i}>
                  <Tooltip placement="right" title={item?.link ? <>{item?.text} <MdOpenInNew /></> : item?.text}>
                    <a
                      style={activeRoute.includes(item?.to) && item?.to !== "" ? activeStyle : { opacity: "0.3" } }
                      className={ !isNavBarLarge ? "centered-icons-mobile" : "centered-icons-disktop" }
                      onClick={() => {
                        isNavBarLarge ? setIsNavBarLarge(false) : null;
                        if (item?.link) {
                          window.open(item?.to, "_blank");
                        } else {
                          if(item?.to && item?.to !== "") {
                            setActiveRoute(item?.to);
                            navigate(item?.to);
                          }
                        }
                      }}
                    >
                      {item?.icon}
                      {isNavBarLarge && item?.text}
                    </a>
                  </Tooltip>
                </li>
              );
            })}


          <div className="settings-nav-items">
            {settingsItems
              .map((item, i) => {
                return (
                  <li key={i}>
                    <Tooltip placement="right" title={<>{item?.text} <MdOpenInNew /></>}>
                      <a
                        style={ activeRoute.includes(item?.to) ? activeStyle : { opacity: "0.3" } }
                        className={ !isNavBarLarge ? "centered-icons-mobile" : "centered-icons-disktop" }
                        onClick={() => {
                          setIsNavBarLarge(false)
                          window.open(item?.to, "_blank");
                        }}
                      >
                        {item?.icon}
                        {isNavBarLarge && item?.text}
                      </a>
                    </Tooltip>
                  </li>
                )
              })}
          </div>





          <li className="signout-btn">
            <Tooltip placement="right" title="Sign Out">
              <a
                style={{ opacity: "0.3" }}
                className={ !isNavBarLarge ? "centered-icons-mobile" : "centered-icons-disktop" }
                onClick={() => {
                  window.location.href = `${sp_site}/_layouts/closeConnection.aspx?loginasanotheruser=true&Source=${sp_site}`;
                }}
              >
                {svgIcons.SignOut}
                {isNavBarLarge && "Sign Out"}
              </a>
            </Tooltip>
          </li>

          
        </ul>
      </nav>
    </>
  );
};

export default SidebarNav;
