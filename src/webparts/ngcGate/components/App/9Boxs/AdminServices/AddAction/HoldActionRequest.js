import axios from "axios";
import { apiUrl } from "../../../App";

export default async function HoldActionRequest(type, data) {
  try {
    let request = await axios(
      {
        method: "POST",
        url: `${apiUrl}/${type}/Hold`,
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