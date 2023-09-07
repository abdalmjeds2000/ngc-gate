import * as React from 'react';
import { createContext } from "react";
import { AppProps } from './AppProps';
import { BrowserRouter as Router } from 'react-router-dom';
import SidebarNav from './SidebarNav/SidebarNav';
import AppRoutes from '../Routers/AppRoutes';
import Header from '../App/Header/Header'
import pnp from 'sp-pnp-js';
import axios from 'axios';
import GetPerformance from './Home/First/NumbersAttendance/API/GetPerformance';
import { initialStat } from "./9Boxs/ITServices/IT/ITDashboard/pages/RequestsTable/ServicesRequests";
import { adminTableInitialStat } from "./9Boxs/AdminServices/Dashboard/components/LatestRequests";
import './index.css';

interface AppContext {
  [key: string]: any;
}
export const AppCtx = createContext<AppContext>(null);


const App: React.FunctionComponent<AppProps> = (props: any) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userData, setUserData]: any = React.useState({});
  const [notificationsCount, setNotificationsCount]: any = React.useState(0);
  const [notificationsData, setNotificationsData] = React.useState([]);
  const [mailCount, setMailCount] = React.useState('');
  const [latestAttendance, setLatestAttendance] = React.useState([]);
  const [communicationList, setCommunicationList] = React.useState([]);
  const [newsList, setNewsList] = React.useState([]);
  const [globeData, setGlobeData] = React.useState([]);
  const [isGlobeReady, setIsGlobeReady] = React.useState(false);
  const [mediaCenter, setMediaCenter] = React.useState({})
  const [oracleReports, setOracleReports] = React.useState({})
  const [notesList, setNotesList] = React.useState([])
  const [eSignRequests, setESignRequests] = React.useState([])
  const [eSignRequestsYouSignedIt, setESignRequestsYouSignedIt] = React.useState([])
  const [departmentsInfo, setDepartmentsInfo] = React.useState([]);
  const [maintenanceData, setMaintenanceData] = React.useState([]);
  const [performance, setPerformance] = React.useState({});
  const [allEvents, setAllEvents] = React.useState([]);
  const [contentRequestsData, setContentRequestsData] = React.useState([]);
  const [researchRequestsData, setResearchRequestsData] = React.useState([]);
  const [adminAssignedRequests, setAdminAssignedRequests] = React.useState([]);
  const [adminMyRequests, setAdminMyRequests] = React.useState([]);
  const [oracleFormData, setOracleFormData] = React.useState([]);
  const [salicDepartments, setSalicDepartments] = React.useState([]);
  const [myItRequestsData, setMyItRequestsData] = React.useState([]);
  const [itRequestsAssignedForMeData, setItRequestsAssignedForMeData] = React.useState([]);
  // IT SERVICE REQUEST PAGE DATA
  const [ITRequests, setITRequests] = React.useState(initialStat);
  const [adminDashboardRequests, setAdminDashboardRequests] = React.useState(adminTableInitialStat);

  const [showSearchResult, setShowSearchResult] = React.useState(false);
  const [researchArticlesData, setResearchArticlesData] = React.useState([]);
  const [researchNewsData, setResearchNewsData] = React.useState([]);
  const [researchPulseData, setResearchPulseData] = React.useState([]);
  const [researchCountriesData, setResearchCountriesData] = React.useState([]);
  const [knowledgeData, setKnowledgeData] = React.useState([]);
  const [gateNewsData, setGateNewsData] = React.useState([]);
  const [allResearchArticlesData, setAllResearchArticlesData] = React.useState([]);
  const [allPulseData, setAllPulseData] = React.useState({});
  const [allKnowledgeData, setAllKnowledgeData] = React.useState([]);
  const [allCountryData, setAllCountryData] = React.useState([]);
  const [salicAssetsData, setSalicAssetsData] = React.useState({});
  const [deliveryLettersData, setDeliveryLettersData] = React.useState({});
  const [myIncidentReports, setMyIncidentReports] = React.useState([]);
  const [assignedIncidentReports, setAssignedIncidentReports] = React.useState([]);
  const [incidentReportsForReview, setIncidentReportsForReview] = React.useState([]);
  const [showWelcomeMessage, setShowWelcomeMessage] = React.useState(true);
  const [powerBiAccessToken, setPowerBiAccessToken] = React.useState(null);

  

  React.useEffect(() => {
    if(userData.Data?.Mail !== null) {
      if(userData.Data?.Mail !== "stsadmin@salic.onmicrosoft.com") {
        let element = document.getElementById("spCommandBar");
        if(element) {
          element.style.display = "none";
        }
      }
    }
  }, [userData])


  // fetch notifications count func
  const fetchNotificationCount = (mail: string) => {
    axios({ method: 'GET', url: `https://salicapi.com/api/NotificationCenter/Summary?Email=${mail}` })
      .then((res) => { 
        const sumNotiTypes: any = Object.values(res?.data?.Data).reduce((partialSum: any, a: any) => partialSum + a, 0);
        setNotificationsCount(sumNotiTypes); 
      })
      .catch((error) => console.log(error))
  }
  // fetch mail count func
  const fetchMailCount = (graphId: any) => {
    axios({ method: 'GET', url: `https://salicapi.com/api/User/GetUnReadMessags?UserId=${graphId}` })
      .then((res) => { setMailCount(res.data.Data) })
      .catch((error) => { console.log(error) })
  }
  // fetch notifications & mail counts, for update button count in app header every 30s
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchNotificationCount(userData.Data?.Mail);
      fetchMailCount(userData.Data?.GraphId)
    }, 30000)
    return () => clearInterval(interval);
  }, [userData]);


  // Requests in first open
  React.useEffect(() => {
    // Get Current Login User
    pnp.sp.web.currentUser.get()
      .then(user => {
        return user
      })
      // Get Current User Data
      .then((user) => {
        axios({
          method: 'GET',
          // url: `https://salicapi.com/api/User/GetUserByEmail?Expand=manager&Email=${user.Email}`,
          // url: `https://salicapi.com/api/User/GetUserByEmail?Expand=manager&Email=abdulmohsen.alaiban@salic.com`,
          url: `https://salicapi.com/api/User/GetUserByEmail?Expand=manager&Email=Akmal.Eldahdouh@salic.com`,
        })
          .then((response) => {
            setUserData(response.data)
            console.log(response.data)
            console.log('CONTEXT =======> ', props)
            return response
          })
          // Get Performance KPI's
          .then(response => {
            GetPerformance(response.data?.Data?.PIN).then((res: any) => setPerformance(res?.data)).catch((err: any) => console.log(err))
            return response
          })
          // Disable Loader
          .then((response) => {setIsLoading(false); return response})
          // Get Latest Attendance
          .then((response) => {
            axios({
              method: 'POST', url: `https://salicapi.com/api/attendance/Get`,
              data: {
                Email: response.data?.Data.Mail,
                Month: new Date().getMonth() + 1,
                Year: new Date().getUTCFullYear(),
                status: -1
              }
            })
              .then((res) => setLatestAttendance(res.data?.Data))
              .catch((error) => { console.log(error) })
            return response
          })
          // (NEW) Get Notifications Count
          .then((response) => {
            fetchNotificationCount(response.data.Data?.Mail);
            return response
          })
          // Get Mail Count
          .then((response) => {
            fetchMailCount(response.data.Data?.GraphId);
            return response
          })
          // Get Departments Information for Daily Attendance
          .then((response) => {
            axios({
              method: 'GET',
              url: `https://salicapi.com/api/leave/GetEmployeeByPINALL?UserId=${response.data?.Data?.GraphId}&PIN=${response.data?.Data?.PIN}`,
            })
            .then((res) => setDepartmentsInfo(res.data.Data || []))
            .catch((error) => { console.log(error) })
            return response
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    // Get Globe Data 
      axios({
        method: 'GET',
        url: 'https://vasturiano.github.io/react-globe.gl/example/datasets/ne_110m_admin_0_countries.geojson'
      })
      .then(res => setGlobeData(res.data?.features))
      .catch((error) => { console.log(error) })

    // Get All Notes
    pnp.sp.web.lists.getByTitle('Sticky Notes').items.orderBy("CreateAt", false).top(10).get()
    .then((res: any) => setNotesList(res)).catch((err: any) => { console.log(err) });
    // Get Gate Departments
    axios({method: "GET", url: "https://salicapi.com/api/user/departments"})
    .then(response => setSalicDepartments(response.data.Data))
    .catch(null)
    
  }, []);


  // auto logout after 15min on no action on gate
  React.useEffect(() => {
    let idleTime = 0;
    const idleInterval = setInterval(timerIncrement, 30000); // 1/2 minute
    function timerIncrement() {
      idleTime = idleTime + 1;
      // console.log("idleTime", idleTime);
      if (idleTime > 30) { // 15 min
        document.location = `https://salic.sharepoint.com/sites/portal/_layouts/closeConnection.aspx?loginasanotheruser=true&Source=${window.location.href}`;
      }
    }
    const onMouseMove = () => {
      idleTime = 0;
    }
    const onKeyPress = () => {
      idleTime = 0;
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keypress", onKeyPress);
    
    return () => {
      clearInterval(idleInterval);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keypress", onKeyPress);
    }
  }, []);



  // get access token with powerbi permission
  React.useEffect(() => {
    props.context.aadTokenProviderFactory.getTokenProvider().then((tokenProvider: any) => {
      tokenProvider.getToken('https://analysis.windows.net/powerbi/api').then((token: any) => {
        // console.log("token", token);
        setPowerBiAccessToken(token);
      })
      .catch((err: any) => {
        console.log(err);
      });
    })
    .catch((err: any) => {
      console.log(err);
    });
  }, []);

  // Context Provider
  const AppContextProviderSample: AppContext = {
    user_data: userData,
    defualt_route: props.spWebUrl,
    notifications_count: notificationsCount, fetchNotificationCount,
    notifications_data: notificationsData, setNotificationsData,
    mail_count: mailCount,
    latest_attendance: latestAttendance,
    communicationList: communicationList, setCommunicationList,
    news_list: newsList, setNewsList,
    globe_data: globeData,
    isGlobeReady, setIsGlobeReady,
    media_center: mediaCenter, setMediaCenter,
    notes_list: notesList, setNotesList,
    eSign_requests: eSignRequests, setESignRequests,
    eSign_requests_you_signed_it: eSignRequestsYouSignedIt, setESignRequestsYouSignedIt,
    departments_info: departmentsInfo,
    maintenance_data: maintenanceData, setMaintenanceData,
    performance: performance, setPerformance,
    all_events: allEvents, setAllEvents,
    content_requests_data: contentRequestsData, setContentRequestsData,
    research_requests_data: researchRequestsData, setResearchRequestsData,
    admin_assigned_requests: adminAssignedRequests,  setAdminAssignedRequests,
    admin_my_requests: adminMyRequests, setAdminMyRequests,
    oracle_form_data: oracleFormData, setOracleFormData,
    salic_departments: salicDepartments,
    my_it_requests_data: myItRequestsData,  setMyItRequestsData,
    it_requests_assigned_for_me_data: itRequestsAssignedForMeData, setItRequestsAssignedForMeData,
    ITRequests: ITRequests, setITRequests,
    sp_context: props.context,
    sp_site: props.context._pageContext._site.absoluteUrl,
    showSearchResult, setShowSearchResult,
    oracleReports, setOracleReports,
    researchArticlesData, setResearchArticlesData,
    researchNewsData, setResearchNewsData,
    researchPulseData, setResearchPulseData,
    researchCountriesData, setResearchCountriesData,
    knowledgeData, setKnowledgeData,
    gateNewsData, setGateNewsData,
    allResearchArticlesData, setAllResearchArticlesData,
    allPulseData, setAllPulseData,
    allKnowledgeData, setAllKnowledgeData,
    allCountryData, setAllCountryData,
    salicAssetsData, setSalicAssetsData,
    deliveryLettersData, setDeliveryLettersData,
    myIncidentReports, setMyIncidentReports,
    assignedIncidentReports, setAssignedIncidentReports,
    incidentReportsForReview, setIncidentReportsForReview,
    showWelcomeMessage, setShowWelcomeMessage,
    powerBiToken: powerBiAccessToken,
    adminDashboardRequests, setAdminDashboardRequests
  };



  // change favicon
  let link: any = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = 'https://salicapi.com/File/9244ecd5-d273-4ee9-bffe-2a8fcb140860.png';

  return (
    <AppCtx.Provider value={AppContextProviderSample}>
      <div style={{display: isLoading ? 'none' : '', background: 'linear-gradient(0deg,var(--third-color),#fff)'}}>
        <Router /* basename={props.spWebUrl} */>
          <div className="app-container">
            <SidebarNav spWebUrl={props.spWebUrl} />
            <div className="content-container">
              <Header />
              <AppRoutes {...props} />
            </div>
          </div>
        </Router>
      </div>
      <div className="loader" style={{height: !isLoading ? 0 : null}}>
        <img src={require('../../assets/images/logo.png')} alt="salic logo" style={{ maxWidth: '250px', textAlign: 'center' }} />
        <div></div>
      </div>
    </AppCtx.Provider>
  )
}
export default App;