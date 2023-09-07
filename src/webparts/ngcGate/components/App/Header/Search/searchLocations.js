import newsSearch from './searchQueries/newsSearch';
import news from './searchQueries/news';
import ngcAsstesSearch from './searchQueries/ngcAsstesSearch';
import ngcAsstes from './searchQueries/ngcAsstes';
import deliveryLettersSearch from './searchQueries/deliveryLettersSearch';
import deliveryLetters from './searchQueries/deliveryLetters';
import manageNewsSearch from './searchQueries/manageNewsSearch';
import manageNews from './searchQueries/manageNews';
import contentRequestsSearch from './searchQueries/contentRequestsSearch';
import contentRequests from './searchQueries/contentRequests';

var fakePromise = new Promise(function(resolve) {setTimeout(resolve, 0)});

export var searchLocations = [

  /* START DMS Routes */
  {
    route: "/dms",
    path: [
      'path:"https://salic.sharepoint.com/sites/newsalic/KSA"',
    ],
    fetchData: null,
  },
  /* END DMS Routes */
  
  {
    route: "/community-news",
    path: [],
    fetchData: (query) => newsSearch(query),
    fetchOriginalData: () => news()
  },{
    route: "/manage-news-content",
    path: [],
    fetchData: (query) => manageNewsSearch(query),
    fetchOriginalData: () => manageNews()
  },{
    route: "/services-requests/service-requests-dashboard#service-requests",
    path: [],
    fetchData: (query) => fakePromise.then(() => query),
    fetchOriginalData: () => fakePromise
  },{
    route: "/admin-services/dashboard",
    path: [],
    fetchData: (query) => fakePromise.then(() => query),
    fetchOriginalData: () => fakePromise
  },

  {
    route: "/content-requests/my-content-requests",
    path: [],
    fetchData: (query) => contentRequestsSearch(query),
    fetchOriginalData: () => contentRequests()
  }, {
    route: "/content-requests/all-content-requests",
    path: [],
    fetchData: (query) => contentRequestsSearch(query),
    fetchOriginalData: () => contentRequests()
  },

  {
    route: "/asset/all#2",
    path: [],
    fetchData: (query) => ngcAsstesSearch(query),
    fetchOriginalData: () => ngcAsstes()
  },{
    route: "/asset/all#3",
    path: [],
    fetchData: (query) => deliveryLettersSearch(query),
    fetchOriginalData: () => deliveryLetters()
  },{
    route: "/services-requests/my-requests",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/services-requests/requests-assigned-for-me",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/hc-services",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/admin-services",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/services-requests",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/e-invoicing",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/content-requests",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/book-meeting-room",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/oracle-reports",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/power-bi-dashboards",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/power-bi-dashboards/human-capital",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/power-bi-dashboards/research",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/incidents-center",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },


  {
    route: "/eSignature-document",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/eSignature-document#1",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/eSignature-document#2",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },



  {
    route: "/incidents-center/my-reports",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/incidents-center/assigned-reports",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },{
    route: "/incidents-center/request-for-review",
    path: [],
    fetchData: () => fakePromise,
    fetchOriginalData: () => fakePromise
  },
];