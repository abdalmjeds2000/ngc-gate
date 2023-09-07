import axios from "axios";
import { apiUrl } from "../../../App";

export default async function GetITRequest(email, id) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/Tracking/GetById?Email=${email}&Id=${id}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}