import axios from "axios"
import { apiUrl } from "../../../../App";

export default async function VisitorRequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: `${apiUrl}/Visitor/Add`,
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