import axios from "axios";
import { apiUrl } from "../../../App";

export default async function AssignAdminRequest(type, data) {
  try {
    let request = await axios(
      {
        method: "POST",
        url: `${apiUrl}/${type}/Assign`,
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