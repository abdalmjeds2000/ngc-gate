import React from 'react';
import axios from 'axios';
import { StatsCard, StatsCardDivided } from '../../../../../../../Global/StatsCard/StatsCard';

const Numbers = ({ paramsFilter }) => {
  const [state, setState] = React.useState({ data: [], loading: true });

  const getData = async (signal) => {
    setState({ data: state.data, loading: true });
    try {
      const joinedParams = Object.entries(paramsFilter).map(([key, value]) => `${key}=${value}`).join('&');
      const response = await axios.get(`https://salicapi.com/api/ChangeRequests/byStatus?${joinedParams}`, { signal });
      setState({ data: response.data, loading: false });
    } catch (error) {
      // message.error("Failed to load Numbers Stats");
    }
  }

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getData(signal);
    return () => {controller.abort();};
  }, [JSON.stringify(paramsFilter)]);


  const CR_PENDING_COUNT = state?.data?.find(item => item?.key === "PROCESSING_CR")?.Count || 0;
  const CR_CLOSED_COUNT = state?.data?.find(item => item?.key === "CLOSED_CR")?.Count || 0;
  const ER_PENDING_COUNT = state?.data?.find(item => item?.key === "PROCESSING_ER")?.Count || 0;
  const ER_CLOSED_COUNT = state?.data?.find(item => item?.key === "CLOSED_ER")?.Count || 0;
  const WAITING_APPROVAL_COUNT = state?.data?.find(item => item?.key === "APPROVAL")?.Count || 0;
  const TOTAL_COUNT = state?.data?.find(item => item?.key === "TOTAL")?.Count || 0;

  return (
    <div style={{ marginBottom: 25, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gridGap: "25px" }}>
      <StatsCardDivided
        label="Change Requests"
        values={[{label: "Pending", value: CR_PENDING_COUNT, color: "#FFC26F"}, {label: "Closed", value: CR_CLOSED_COUNT, color: "#3a9bcc"}]}
        color="#3a9bcc"
      />
      <StatsCardDivided
        label="Enhancement Requests"
        values={[{label: "Pending", value: ER_PENDING_COUNT, color: "#FFC26F"}, {label: "Closed", value: ER_CLOSED_COUNT, color: "#3a9bcc"}]}
        color="#3a9bcc"
      />
      <StatsCard
        label="Waiting Approval"
        value={WAITING_APPROVAL_COUNT}
        color="#3a9bcc"
      />
      <StatsCard
        label="Total"
        value={TOTAL_COUNT}
        color="#3a9bcc"
      />
    </div>
  )
}

export default Numbers