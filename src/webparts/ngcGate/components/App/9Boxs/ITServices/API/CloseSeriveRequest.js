import axios from "axios";
import { apiUrl } from "../../../App";

export default async function CloseSeriveRequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: `${apiUrl}/tracking/CloseServiceRequest`,
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}