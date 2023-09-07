import axios from "axios";

export default async function GetSummaryByDepartment(params, signal) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://salicapi.com/api/Tracking/SummaryByDepartment?Manager=${params}`,
        signal: signal
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}