import axios from "axios";
import { apiUrl } from "../../../App";

export default async function ApproveSeriveRequest(id) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/tracking/Accept/${id}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}