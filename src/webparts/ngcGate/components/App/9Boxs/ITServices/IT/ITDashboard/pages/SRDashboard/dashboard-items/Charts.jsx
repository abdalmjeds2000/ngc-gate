import React from "react";
import axios from "axios";
import Card from "../../../../../../../Global/Card/Card";
import { Bar, DualAxes, Pie, Column } from "@ant-design/plots";
import { Segmented, Skeleton } from "antd";
import { colors } from '../../../index';
import { apiUrl } from "../../../../../../../App";


const sceletonLoader = (
  <div>
    <Skeleton.Button active block shape="default" /> <br /><br />
    <Skeleton.Button active block shape="default" /> <br /><br />
    <Skeleton.Button active block shape="default" /> <br /><br />
    <Skeleton.Button active block shape="default" /> <br /><br />
  </div>
);
const legendSettings = {
  position: 'bottom',
  // maxRow: 10,
  itemName: {
    style: {
      fontSize: 16,
    }
  }
}

export const ByPriority = ({ paramsFilter,className }) => {

  const [state, setState] = React.useState({ data: [], loading: true });
  const getData = async (signal) => {
    setState({ data: state.data, loading: true });
    try {
      const joinedParams = Object.entries(paramsFilter).map(([key, value]) => `${key}=${value}`).join('&');
      const response = await axios.get(`${apiUrl}/dashboards/serviceRequestsByPriority?${joinedParams}`, { signal });
      setState({ data: response.data?.Data, loading: false });
    } catch (error) {
      // message.error("Failed to load By Priority data");
    }
  }
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getData(signal);
    return () => {controller.abort();};
  }, [JSON.stringify(paramsFilter)]);

  const config = {
    data: state?.data,
    angleField: 'Count',
    colorField: 'Title',
    radius: 0.8,
    innerRadius: 0.7,
    appendPadding: 0,
    color: ({ Title }) => {
      if (Title === "Critical") {
        return "#D32A2A";
      } 
      return "#23cdb2";
    },
    statistic: {
      title: false,
    },
    legend: legendSettings,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
    animation: {
      appear: {
        animation: 'none',
      },
    },
  };
  
  return (
    <Card label="SR. By Priority" className={className}>
      {state.loading ? sceletonLoader : <Pie {...config} />}
    </Card>
  )
}
export const ByType = ({ paramsFilter,className }) => {
  const [state, setState] = React.useState({ data: [], loading: true });
  const getData = async (signal) => {
    setState({ data: state.data, loading: true });
    try {
      const joinedParams = Object.entries(paramsFilter).map(([key, value]) => `${key}=${value}`).join('&');
      const response = await axios.get(`${apiUrl}/dashboards/serviceRequestsByByRequestType?${joinedParams}`, { signal });
      const sortedData = response.data?.sort((a, b) => b?.Count - a?.Count);
      setState({ data: sortedData, loading: false });
    } catch (error) {
      // message.error("Failed to load By Type data");
    }
  }
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getData(signal);
    return () => {controller.abort();};

  }, [JSON.stringify(paramsFilter)]);

  const config = {
    data: state?.data,
    xField: 'Title',
    yField: 'Count',
    seriesField: 'Title',
    columnWidthRatio: 0.8,
    color: colors,
    legend: false,
    xAxis: {
      grid: {
        line: false
      },
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    label: {
      position: 'top',
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    animation: {
      appear: {
        animation: 'none',
      },
    },
  };
  
  return (
    <Card label="SR. By Request Type" className={className}>
      {/* {state.loading ? sceletonLoader : <Pie {...config} />} */}
      {state.loading ? sceletonLoader : <Column {...config} />}
    </Card>
  )
}

export const DepartmentStats = ({ paramsFilter, className }) => {
  const [state, setState] = React.useState({ data: [], loading: true });
  const getData = async (signal) => {
    setState({ data: state.data, loading: true });
    try {
      const joinedParams = Object.entries(paramsFilter).map(([key, value]) => `${key}=${value}`).join('&');
      const response = await axios.get(`${apiUrl}/dashboards/serviceRequestsByDepartment?${joinedParams}`, { signal });
      setState({ data: response.data, loading: false });
    } catch (error) {
      // message.error("Failed to load Department Stats");
    }
  }
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getData(signal);
    return () => {controller.abort();};
  }, [JSON.stringify(paramsFilter)]);

  const config = {
    data: state?.data,
    xField: 'count',
    yField: 'name',
    seriesField: 'name',
    color: colors,
    barWidthRatio: 0.8,
    label: {
      position: 'right',
      style: {
        fill: '#000',
        fontSize: 10,
      },
    },
    yAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
        autoEllipsis: true,
      },
    },
    xAxis: {
      grid: {
        line: false
      }
    },
    legend: false,
  };

  return (
    <Card label="SR. By Sector" className={className}>
      {state.loading ? sceletonLoader : <Bar {...config} />}
    </Card>
  )
}
export const CreatedToClosed = ({ className }) => {
  function mergeOpenClose(data, duration=-6) {
    if (!data || !data.opened || !data.closed) return [];

    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const last6Months = new Date(new Date().setMonth(new Date().getMonth() - 6));
    const thisYear = new Date(new Date().setMonth(0, 1));
    const lastYear = new Date(new Date().setMonth(new Date().getMonth() - 12));
    const all = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
    const durationMap = {
      "-1": lastMonth,
      "-6": last6Months,
      "1": thisYear,
      "-12": lastYear,
      "0": all
    }
    const lastDate = durationMap[duration];
    const arr1 = data.opened?.filter(item => new Date(item.key) >= lastDate).map(item => ({ openedCount: item.Count, closedCount: 0, key: new Date(item.key).toLocaleDateString(), originKey: item.key }));
    const arr2 = data.closed?.filter(item => new Date(item.key) >= lastDate).map(item => ({ openedCount: 0, closedCount: item.Count, key: new Date(item.key).toLocaleDateString(), originKey: item.key }));
    var allDates = [];
    arr1.forEach(function(item) {
      if (allDates.indexOf(item.key) === -1) {
        allDates.push(item.key);
      }
    });
    arr2.forEach(function(item) {
      if (allDates.indexOf(item.key) === -1) {
        allDates.push(item.key);
      }
    });

    const merged = [];
    for (const date of allDates) {
      const openCount = arr1.filter(x => x.key === date).reduce((total, item) => total + item.openedCount, 0);
      const closeCount = arr2.filter(x => x.key === date).reduce((total, item) => total + item.closedCount, 0);
      merged.push({
        date: date,
        Created: openCount,
        Closed: closeCount,
      });
    }
    return merged;
  }
  const [state, setState] = React.useState({ data: [], loading: true, duration: -6 });

  const getData = async (signal) => {
    try {
      const response = await axios.get(`${apiUrl}/dashboards/serviceRequestsTimeline`, { signal });
      // const data = mergeOpenClose(response.data, state.duration);
      setState({ data: response.data, loading: false });
    } catch (error) {
      // message.error("Failed to load Created To Closed data");
    }
  }
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getData(signal);
    return () => {controller.abort();};
  }, []);
  
  const chartData = mergeOpenClose(state.data, state.duration)?.sort((a, b) => new Date(a.date) - new Date(b.date));
  const config = {
    data: [chartData, chartData],
    xField: 'date',
    yField: ['Closed', 'Created'],
    legend: legendSettings,
    geometryOptions: [
      {
        geometry: 'column',
        columnWidthRatio: 0.7,
        color: '#50220E',
      },
      {
        geometry: 'line',
        color: '#D59F29',
      },
    ],
    xAxis: false,
    scrollbar: {
      type: 'horizontal',
    },
  };
  
  return (
    <Card
      label="Tickets Created vs Tickets Closed"
      className={className}
      extra={
        <Segmented
          options={[
            { label: 'Last Month', value: -1 },
            { label: 'Last 6 Months', value: -6 },
            { label: 'This Year', value: 1 },
            { label: 'Last Year', value: -12 },
            { label: 'All', value: 0 },
          ]}
          disabled={state.loading}
          defaultValue={state.duration}
          onChange={(value) => setState({ ...state, duration: value })}
        />
      }
    >
      {state.loading ? sceletonLoader : <DualAxes {...config} />}
    </Card>
  )
}