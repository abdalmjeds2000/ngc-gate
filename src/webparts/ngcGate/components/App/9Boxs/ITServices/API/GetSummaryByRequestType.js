import axios from "axios";

export default async function GetSummaryByRequestType(params, signal) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://salicapi.com/api/Tracking/SummaryByRequestType?Email=${params}`,
        signal: signal
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}