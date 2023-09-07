import axios from "axios";
import { apiUrl } from "../../../App";

export default async function GetSummaryByPriority(params, signal) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/Tracking/SummaryByPriority?Email=${params}`,
        signal: signal
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}