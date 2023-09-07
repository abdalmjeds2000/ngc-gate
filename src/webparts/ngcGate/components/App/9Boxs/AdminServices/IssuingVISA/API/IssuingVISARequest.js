import axios from "axios"
import { apiUrl } from "../../../../App";

export default async function IssuingVISARequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: `${apiUrl}/VISA/Add`,
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    console.log(err.response)
    return(err.response)
  }
}