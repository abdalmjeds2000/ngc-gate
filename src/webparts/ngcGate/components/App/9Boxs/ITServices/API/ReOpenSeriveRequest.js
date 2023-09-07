import axios from "axios";
import { apiUrl } from "../../../App";

export default async function ReOpenSeriveRequest(data) {
  try {
    let request = await axios(  
      {
        method: 'POST',
        url: `${apiUrl}/tracking/ReOpenServiceRequest`,
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}