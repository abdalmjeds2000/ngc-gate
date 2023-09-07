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
  AlMiraMagazine,
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
  NGCProfile,
  AlmiraVersions,
  AnnualReports,
  NGCPresentation,
  AdminDashboard,
  Feedback,
  PreviewReport,
} from './ImportFiles';



const AppRoutes: React.FunctionComponent<RoutersProps> = (props) => {
  const defualtRoute: string = props.spWebUrl;

  return (
    <Routes>
      <Route path={`${defualtRoute}/home`} element={<Home />} />
      <Route path={`${defualtRoute}`} element={<Navigate replace to={`${defualtRoute}/home`}/>} />
      
      <Route path={`${defualtRoute}/communication`} element={<Communication />} />
      <Route path={`${defualtRoute}/dms`} element={<FolderExplorerPage />} />
      

      <Route path={`${defualtRoute}/ngc-profile`}>
        <Route index element={<NGCProfile />} />
        <Route path={`${defualtRoute}/ngc-profile/annual-reports`} element={<AnnualReports />} />
        <Route path={`${defualtRoute}/ngc-profile/ngc-presentation`} element={<NGCPresentation />} />
      
        <Route path={`${defualtRoute}/ngc-profile/almira-versions`}>
          <Route index element={<AlmiraVersions />} />
          <Route path={`${defualtRoute}/ngc-profile/almira-versions/almira-magazine`} element={<AlMiraMagazine />} />
        </Route>
      </Route>

      <Route path={`${defualtRoute}/attendance`} element={<Attendance />} />

      <Route path={`${defualtRoute}/community-news`}>
        <Route index element={<CommunityNews />} />
        <Route path={`${defualtRoute}/community-news/:id`} element={<NewsDetails />} />
      </Route>

      <Route path={`${defualtRoute}/admin-services`}>
        <Route index element={<AdminServices />} />
        <Route path={`${defualtRoute}/admin-services/issuing-VISA`}>
          <Route index element={<IssuingVISA />} />
          <Route path={`${defualtRoute}/admin-services/issuing-VISA/:id`} element={<IssuingVISA />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/shipment`}>
          <Route index element={<ShipmentRequest />} />
          <Route path={`${defualtRoute}/admin-services/shipment/:id`} element={<ShipmentRequest />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/maintenance`}>
          <Route index element={<Maintenance />} />
          <Route path={`${defualtRoute}/admin-services/maintenance/:id`} element={<Maintenance />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/visitor`}>
          <Route index element={<Visitor />} />
          <Route path={`${defualtRoute}/admin-services/visitor/:id`} element={<Visitor />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/transportation`}>
          <Route index element={<Transportation />} />
          <Route path={`${defualtRoute}/admin-services/transportation/:id`} element={<Transportation />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/business-gate`}>
          <Route index element={<BusinessGate />} />
          <Route path={`${defualtRoute}/admin-services/business-gate/:id`} element={<BusinessGate />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/office-supply`}>
          <Route index element={<OfficeSupply />} />
          <Route path={`${defualtRoute}/admin-services/office-supply/:id`} element={<OfficeSupply />} />
        </Route>
        <Route path={`${defualtRoute}/admin-services/assigned-requests`} element={<AssignedRequests />} />
        <Route path={`${defualtRoute}/admin-services/my-requests`} element={<MyRequests />} />
        <Route path={`${defualtRoute}/admin-services/dashboard`} element={<AdminDashboard />} />
      </Route>
      
      <Route path={`${defualtRoute}/services-requests`}>
        <Route index element={<ITServices />} />
        <Route path={`${defualtRoute}/services-requests/services-request`} element={<NewITRequest />} />
        <Route path={`${defualtRoute}/services-requests/my-requests`} element={<MyItServiceRequests />} />
        <Route path={`${defualtRoute}/services-requests/requests-assigned-for-me`}>
          <Route index element={<ITRequestsAssignedForMe />} />
          <Route path={`${defualtRoute}/services-requests/requests-assigned-for-me/:query`} element={<ITRequestsAssignedForMe />} />
        </Route>
        
        <Route path={`${defualtRoute}/services-requests/service-requests-dashboard`} element={<ServiceRequestsDashboard />} />
        <Route path={`${defualtRoute}/services-requests/cancelled`} element={<CancelledRequests />} />
        <Route path={`${defualtRoute}/services-requests/:id`} element={<PreviewITServiceRequest />} />
      </Route>
      <Route path={`${defualtRoute}/asset`}>
        <Route path={`${defualtRoute}/asset/new-asset`} element={<RegisterNewAssets />} />
        <Route path={`${defualtRoute}/asset/all`} element={<AllAssets />} />
        <Route path={`${defualtRoute}/asset/manage`} element={<Navigate replace to={`${defualtRoute}/asset/all`}/>} />
        <Route path={`${defualtRoute}/asset/manage/:id`} element={<ManageAsset />} />
      </Route>
      <Route path={`${defualtRoute}/e-invoicing`}>
        <Route index element={<EInvoicing />} />
      </Route>
      
      <Route path={`${defualtRoute}/hc-services`} element={<HRSelf />} />
      <Route path={`${defualtRoute}/notification-center`} element={<NotificationCenter />} />
      <Route path={`${defualtRoute}/book-meeting-room`}>
        <Route index element={<MeetingCenter />} />
        <Route path={`${defualtRoute}/book-meeting-room/new-meeting`} element={<NewMeeting />} />
        <Route path={`${defualtRoute}/book-meeting-room/my-meetings`} element={<MyMeetings />} />
        <Route path={`${defualtRoute}/book-meeting-room/rooms-calender`} element={<RoomsCalender />} />
      </Route>
      <Route path={`${defualtRoute}/eSignature-document`} element={<ESignatureTool />} />
      
      <Route path={`${defualtRoute}/org-doc-investment`} element={<Investment />} />
      <Route path={`${defualtRoute}/org-doc-finance`} element={<Finance />} />
      <Route path={`${defualtRoute}/org-doc-corporate-services`} element={<CorporateServices />} />
      <Route path={`${defualtRoute}/org-doc-legal`} element={<Legal />} />
      <Route path={`${defualtRoute}/org-doc-risk-strategy`} element={<RiskStrategy />} />
      <Route path={`${defualtRoute}/org-doc-corporate-communication`} element={<CorporateCommunication />} />


      <Route path={`${defualtRoute}/power-bi-dashboards`}>
        <Route index element={<PowerBIInteractiveDashboards />} />

        <Route path={`${defualtRoute}/power-bi-dashboards/human-capital`}>
          <Route index element={<HumanCapital />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/human-capital/hr-dashboard`} element={<HRDashboard />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/human-capital/employee-analytics-dashboard`} element={<EmployeeAnalyticsDashboard />} />
        </Route>
        <Route path={`${defualtRoute}/power-bi-dashboards/research`}>
          <Route index element={<Research />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/country-outlook`} element={<CountryOutlook />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/delegation-visit`} element={<DelegationVisit />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/crisis-plan`} element={<CrisisPlan />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/demand-forecast`} element={<DemandForecast />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/domestic-prices`} element={<DomesticPrices />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/international-prices`} element={<InternationalPrices />} />
          <Route path={`${defualtRoute}/power-bi-dashboards/research/daily-dashboard`} element={<DailyDashboard />} />
        </Route>
        <Route path={`${defualtRoute}/power-bi-dashboards/preview/:id`} element={<PreviewReport />} />
      </Route>

      <Route path={`${defualtRoute}/content-requests`}>
        <Route index element={<ContentRequests />} />
        <Route path={`${defualtRoute}/content-requests/new-request`} element={<NewContentRequest />} />
        <Route path={`${defualtRoute}/content-requests/all-content-requests`} element={<AllContentRequests />} />
        <Route path={`${defualtRoute}/content-requests/my-content-requests`} element={<MyContentRequests />} />
        <Route path={`${defualtRoute}/content-requests/:id`} element={<PreviewContentRequest />} />
      </Route>

      <Route path={`${defualtRoute}/manage-news-content`} element={<ManageNewsContent />} />

      <Route path={`${defualtRoute}/manage-media-center`} element={<ManageNews />} />
      <Route path={`${defualtRoute}/manage-events`} element={<ManageEvents />} />
      <Route path={`${defualtRoute}/sp-search`} element={<SPSearch />} />

      <Route path={`${defualtRoute}/performance-managment`}>
        <Route index element={<Performance />} />
      </Route>

      <Route path={`${defualtRoute}/incidents-center`}>
        <Route index element={<IncidentsCenter />} />
        <Route path={`${defualtRoute}/incidents-center/new-report`} element={<NewIncidentReport />} />
        <Route path={`${defualtRoute}/incidents-center/my-reports`} element={<MyReports />} />
        <Route path={`${defualtRoute}/incidents-center/assigned-reports`} element={<AssignedReports />} />
        <Route path={`${defualtRoute}/incidents-center/request-for-review`} element={<RequestsForReview />} />
        <Route path={`${defualtRoute}/incidents-center/report/:id`} element={<PreviewIncidentReport />} />
      </Route>

      <Route path={`${defualtRoute}/my-team`} element={<MyTeam />} />

      <Route path={`${defualtRoute}/feedback`} element={<Feedback />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
export default AppRoutes