import axios from "axios";
import { apiUrl } from "../../../App";

export default async function GetITRequests(email) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/tracking/Get?draw=3&order=Id desc&start=0&length=20&search[value]=&search[regex]=false&email=${email}&query=&_=1668265007659`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}