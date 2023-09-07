import axios from "axios"
import { apiUrl } from "../../../../App";

export default async function GetPerformance(userId) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/Integration/gate_statisiics?PIN=${userId}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    console.log(err.response)
    return(err.response)
  }
}