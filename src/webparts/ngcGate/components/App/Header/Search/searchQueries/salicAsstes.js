import axios from 'axios';
import { apiUrl } from '../../../App';

export default async function salicAsstes() {
  try {
    const response = await axios.get(`${apiUrl}/Asset/Get?draw=13&order=CreatedAt+desc&start=0&length=20&search[value]=&search[regex]=false&email=abdulmohsen.alaiban@salic.com&Name=&CategoryType=&Brand=&Model=&DeliveredTo=&Available=All&Type=&Tag=&SN=&_=1669266638774`)
    return response.data;
  } catch(err) {
    console.log(err)
  }
}

