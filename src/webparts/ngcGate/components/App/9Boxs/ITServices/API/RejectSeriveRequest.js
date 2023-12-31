import axios from "axios";

export default async function RejectSeriveRequest(id) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `${apiUrl}/tracking/Reject/${id}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    return(err.response)
  }
}