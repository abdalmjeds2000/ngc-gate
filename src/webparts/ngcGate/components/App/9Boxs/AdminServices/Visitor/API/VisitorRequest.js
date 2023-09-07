import axios from "axios"

export default async function VisitorRequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: 'https://salicapi.com/api/Visitor/Add',
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