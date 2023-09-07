import axios from "axios";
import { apiUrl } from "../../../App";

export default async function UpdateITRequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: `${apiUrl}/tracking/UpdateServiceRequest`,
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}