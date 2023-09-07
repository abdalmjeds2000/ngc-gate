import axios from "axios";
import { apiUrl } from "../../../App";

export default async function GetSummaryByStatus(params, signal) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/Tracking/SummaryByStatus?Email=${params}`,
        signal: signal
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}