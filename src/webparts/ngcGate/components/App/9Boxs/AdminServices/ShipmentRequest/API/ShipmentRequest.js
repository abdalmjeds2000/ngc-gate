import axios from "axios"
import { apiUrl } from "../../../../App";

export default async function ShipmentRequest(data) {
  try {
    let request = await axios(
      {
        method: 'POST',
        url: `${apiUrl}/Shipment/Add`,
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