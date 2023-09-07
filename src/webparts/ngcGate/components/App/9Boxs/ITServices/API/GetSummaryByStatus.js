import axios from "axios";

export default async function GetSummaryByStatus(params, signal) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://salicapi.com/api/Tracking/SummaryByStatus?Email=${params}`,
        signal: signal
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}