import axios from "axios"

export default async function BusinessGateRequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: 'https://salicapi.com/api/BusniessGate/Add',
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