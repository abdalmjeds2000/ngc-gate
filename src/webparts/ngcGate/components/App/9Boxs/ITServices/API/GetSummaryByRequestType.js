import axios from "axios";
import { apiUrl } from "../../../App";

export default async function GetSummaryByRequestType(params, signal) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/Tracking/SummaryByRequestType?Email=${params}`,
        signal: signal
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}