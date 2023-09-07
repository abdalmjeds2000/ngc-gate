import axios from "axios";
import { apiUrl } from "../../../App";

export default async function GetSummaryByDepartment(params, signal) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/Tracking/SummaryByDepartment?Manager=${params}`,
        signal: signal
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}