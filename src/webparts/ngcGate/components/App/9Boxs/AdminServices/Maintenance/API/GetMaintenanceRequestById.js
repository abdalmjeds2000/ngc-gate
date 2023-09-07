import axios from "axios"

export default async function GetMaintenanceRequestById(email, id) {
  try {
    let request = await axios(
      {
        method: 'GET',
        url: `https://salicapi.com/api/Maintenance/Get?Email=${email}&Id=${id}`,
      }
    )
    let response = request;
    return response

  } catch(err) {
    console.log(err.response)
    return(err.response)
  }
}