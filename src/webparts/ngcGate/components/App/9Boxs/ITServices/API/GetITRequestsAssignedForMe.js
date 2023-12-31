import axios from "axios";
import { apiUrl } from "../../../App";

export default async function GetITRequestsAssignedForMe(email) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/tracking/AssignedForMe?User=${email}&draw=1&order=Status desc&start=0&length=-1&search[value]=&search[regex]=false&query=&_=1667911493346`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}