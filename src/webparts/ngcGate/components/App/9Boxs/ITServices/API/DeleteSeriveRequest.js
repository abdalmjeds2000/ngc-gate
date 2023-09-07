import axios from "axios";
import { apiUrl } from "../../../App";

export default async function DeleteSeriveRequest(id, message) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: `${apiUrl}/tracking/DeleteServiceRequest/${id}`,
        data: { message: message }
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}