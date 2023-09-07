import axios from "axios";
import { apiUrl } from "../../../App";

export default async function AddItServiceRequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: `${apiUrl}/tracking/Add`,
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}