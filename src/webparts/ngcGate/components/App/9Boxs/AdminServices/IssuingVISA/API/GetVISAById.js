import axios from "axios"
import { apiUrl } from "../../../../App";

export default async function GetVISAById(email, id) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/VISA/Get?Email=${email}&Id=${id}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    console.log(err.response)
    return(err.response)
  }
}