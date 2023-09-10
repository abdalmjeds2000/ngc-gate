import * as React from 'react';
import { RoutersProps } from './RoutersProps';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Home,
  PageNotFound,
  Communication,
  AdminServices,
  HRSelf,
  ITServices,
  NewITRequest,
  RegisterNewAssets,
  AllAssets,
  ManageAsset,
  MyItServiceRequests,
  ITRequestsAssignedForMe,
  PreviewITServiceRequest,
  CancelledRequests,
  ServiceRequestsDashboard,
  NotificationCenter,
  IssuingVISA,
  BusinessGate,
  Maintenance,
  ShipmentRequest,
  OfficeSupply,
  Transportation,
  AssignedRequests,
  MyRequests,
  Visitor,
  Attendance,
  CommunityNews,
  NewsDetails,
  FolderExplorerPage,
  EInvoicing,
  Performance,
  MeetingCenter,
  NewMeeting,
  MyMeetings,
  RoomsCalender,
  ESignatureTool,
  Investment,
  Finance,
  CorporateServices,
  Legal,
  RiskStrategy,
  CorporateCommunication,
  PowerBIInteractiveDashboards,
  HumanCapital,
  HRDashboard,
  EmployeeAnalyticsDashboard,
  Research,
  CountryOutlook,
  DelegationVisit,
  CrisisPlan,
  DemandForecast,
  DomesticPrices,
  InternationalPrices,
  DailyDashboard,
  ContentRequests,
  NewContentRequest,
  AllContentRequests,
  MyContentRequests,
  PreviewContentRequest,
  ManageNewsContent,
  ManageEvents,
  SPSearch,
  IncidentsCenter,
  NewIncidentReport,
  MyReports,
  AssignedReports,
  RequestsForReview,
  PreviewIncidentReport,
  ManageNews,
  MyTeam,
  AdminDashboard,
  PreviewReport,
} from './ImportFiles';



const AppRoutes: React.FunctionComponent<RoutersProps> = (props) => {

  return (
    <Routes>
      <Route path={"/home"} element={<Home />} />
      <Route path={""} element={<Navigate replace to={"/home"}/>} />
      
      <Route path={"/communication"} element={<Communication />} />
      <Route path={"/dms"} element={<FolderExplorerPage />} />
      

      <Route path={"/attendance"} element={<Attendance />} />

      <Route path={"/community-news"}>
        <Route index element={<CommunityNews />} />
        <Route path={"/community-news/:id"} element={<NewsDetails />} />
      </Route>

      <Route path={"/admin-services"}>
        <Route index element={<AdminServices />} />
        <Route path={"/admin-services/issuing-VISA"}>
          <Route index element={<IssuingVISA />} />
          <Route path={"/admin-services/issuing-VISA/:id"} element={<IssuingVISA />} />
        </Route>
        <Route path={"/admin-services/shipment"}>
          <Route index element={<ShipmentRequest />} />
          <Route path={"/admin-services/shipment/:id"} element={<ShipmentRequest />} />
        </Route>
        <Route path={"/admin-services/maintenance"}>
          <Route index element={<Maintenance />} />
          <Route path={"/admin-services/maintenance/:id"} element={<Maintenance />} />
        </Route>
        <Route path={"/admin-services/visitor"}>
          <Route index element={<Visitor />} />
          <Route path={"/admin-services/visitor/:id"} element={<Visitor />} />
        </Route>
        <Route path={"/admin-services/transportation"}>
          <Route index element={<Transportation />} />
          <Route path={"/admin-services/transportation/:id"} element={<Transportation />} />
        </Route>
        <Route path={"/admin-services/business-gate"}>
          <Route index element={<BusinessGate />} />
          <Route path={"/admin-services/business-gate/:id"} element={<BusinessGate />} />
        </Route>
        <Route path={"/admin-services/office-supply"}>
          <Route index element={<OfficeSupply />} />
          <Route path={"/admin-services/office-supply/:id"} element={<OfficeSupply />} />
        </Route>
        <Route path={"/admin-services/assigned-requests"} element={<AssignedRequests />} />
        <Route path={"/admin-services/my-requests"} element={<MyRequests />} />
        <Route path={"/admin-services/dashboard"} element={<AdminDashboard />} />
      </Route>
      
      <Route path={"/services-requests"}>
        <Route index element={<ITServices />} />
        <Route path={"/services-requests/services-request"} element={<NewITRequest />} />
        <Route path={"/services-requests/my-requests"} element={<MyItServiceRequests />} />
        <Route path={"/services-requests/requests-assigned-for-me"}>
          <Route index element={<ITRequestsAssignedForMe />} />
          <Route path={"/services-requests/requests-assigned-for-me/:query"} element={<ITRequestsAssignedForMe />} />
        </Route>
        
        <Route path={"/services-requests/service-requests-dashboard"} element={<ServiceRequestsDashboard />} />
        <Route path={"/services-requests/cancelled"} element={<CancelledRequests />} />
        <Route path={"/services-requests/:id"} element={<PreviewITServiceRequest />} />
      </Route>
      <Route path={"/asset"}>
        <Route path={"/asset/new-asset"} element={<RegisterNewAssets />} />
        <Route path={"/asset/all"} element={<AllAssets />} />
        <Route path={"/asset/manage"} element={<Navigate replace to={"/asset/all"}/>} />
        <Route path={"/asset/manage/:id"} element={<ManageAsset />} />
      </Route>
      <Route path={"/e-invoicing"}>
        <Route index element={<EInvoicing />} />
      </Route>
      
      <Route path={"/hc-services"} element={<HRSelf />} />
      <Route path={"/notification-center"} element={<NotificationCenter />} />
      <Route path={"/book-meeting-room"}>
        <Route index element={<MeetingCenter />} />
        <Route path={"/book-meeting-room/new-meeting"} element={<NewMeeting />} />
        <Route path={"/book-meeting-room/my-meetings"} element={<MyMeetings />} />
        <Route path={"/book-meeting-room/rooms-calender"} element={<RoomsCalender />} />
      </Route>
      <Route path={"/eSignature-document"} element={<ESignatureTool />} />
      
      <Route path={"/org-doc-investment"} element={<Investment />} />
      <Route path={"/org-doc-finance"} element={<Finance />} />
      <Route path={"/org-doc-corporate-services"} element={<CorporateServices />} />
      <Route path={"/org-doc-legal"} element={<Legal />} />
      <Route path={"/org-doc-risk-strategy"} element={<RiskStrategy />} />
      <Route path={"/org-doc-corporate-communication"} element={<CorporateCommunication />} />


      <Route path={"/power-bi-dashboards"}>
        <Route index element={<PowerBIInteractiveDashboards />} />

        <Route path={"/power-bi-dashboards/human-capital"}>
          <Route index element={<HumanCapital />} />
          <Route path={"/power-bi-dashboards/human-capital/hr-dashboard"} element={<HRDashboard />} />
          <Route path={"/power-bi-dashboards/human-capital/employee-analytics-dashboard"} element={<EmployeeAnalyticsDashboard />} />
        </Route>
        <Route path={"/power-bi-dashboards/research"}>
          <Route index element={<Research />} />
          <Route path={"/power-bi-dashboards/research/country-outlook"} element={<CountryOutlook />} />
          <Route path={"/power-bi-dashboards/research/delegation-visit"} element={<DelegationVisit />} />
          <Route path={"/power-bi-dashboards/research/crisis-plan"} element={<CrisisPlan />} />
          <Route path={"/power-bi-dashboards/research/demand-forecast"} element={<DemandForecast />} />
          <Route path={"/power-bi-dashboards/research/domestic-prices"} element={<DomesticPrices />} />
          <Route path={"/power-bi-dashboards/research/international-prices"} element={<InternationalPrices />} />
          <Route path={"/power-bi-dashboards/research/daily-dashboard"} element={<DailyDashboard />} />
        </Route>
        <Route path={"/power-bi-dashboards/preview/:id"} element={<PreviewReport />} />
      </Route>

      <Route path={"/content-requests"}>
        <Route index element={<ContentRequests />} />
        <Route path={"/content-requests/new-request"} element={<NewContentRequest />} />
        <Route path={"/content-requests/all-content-requests"} element={<AllContentRequests />} />
        <Route path={"/content-requests/my-content-requests"} element={<MyContentRequests />} />
        <Route path={"/content-requests/:id"} element={<PreviewContentRequest />} />
      </Route>

      <Route path={"/manage-news-content"} element={<ManageNewsContent />} />

      <Route path={"/manage-media-center"} element={<ManageNews />} />
      <Route path={"/manage-events"} element={<ManageEvents />} />
      <Route path={"/sp-search"} element={<SPSearch />} />

      <Route path={"/performance-managment"}>
        <Route index element={<Performance />} />
      </Route>

      <Route path={"/incidents-center"}>
        <Route index element={<IncidentsCenter />} />
        <Route path={"/incidents-center/new-report"} element={<NewIncidentReport />} />
        <Route path={"/incidents-center/my-reports"} element={<MyReports />} />
        <Route path={"/incidents-center/assigned-reports"} element={<AssignedReports />} />
        <Route path={"/incidents-center/request-for-review"} element={<RequestsForReview />} />
        <Route path={"/incidents-center/report/:id"} element={<PreviewIncidentReport />} />
      </Route>

      <Route path={"/my-team"} element={<MyTeam />} />


      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
export default AppRoutes