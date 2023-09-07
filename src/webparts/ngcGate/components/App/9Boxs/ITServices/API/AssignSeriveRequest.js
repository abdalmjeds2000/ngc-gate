import axios from "axios";
import { apiUrl } from "../../../App";

export default async function RejectSeriveRequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: `${apiUrl}/tracking/Assign`,
        data: data
      }
    )
    let response = request;
    return response

  } catch(err) {
    console.log(err.response)
    return null
  }
}