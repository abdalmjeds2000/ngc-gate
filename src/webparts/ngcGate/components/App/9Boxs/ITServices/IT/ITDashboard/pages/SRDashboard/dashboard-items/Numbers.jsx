import React from 'react';
import { StatsCard } from '../../../../../../../Global/StatsCard/StatsCard';
import axios from 'axios';
import { apiUrl } from '../../../../../../../App';

const Numbers = ({ paramsFilter }) => {
  const [state, setState] = React.useState({ data: [], loading: true });

  const getData = async (signal) => {
    setState({ data: state.data, loading: true });
    try {
      const joinedParams = Object.entries(paramsFilter).map(([key, value]) => `${key}=${value}`).join('&');
      const response = await axios.get(`${apiUrl}/dashboards/serviceRequestsByStatus?${joinedParams}`, { signal });
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


  return (
    <div style={{ marginBottom: 25, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gridGap: "25px" }}>
      {
        state?.data?.map(item => {
          // const color = item?.key === "SUBMITTED" ? "#C44633" : item?.key === "PROCESSING" ? "#FFC26F" : item?.key === "CLOSED" ? "var(--second-color)" : item?.key === "APPROVAL" ? "#23BB99" : "#bfc9d1";
          return (
            <StatsCard
              label={item?.Title}
              value={item?.Count}
              // color={color}
              color="var(--second-color)"
              // perc={10}
            />
          )
        })
      }
    </div>
  )
}

export default Numbers