import axios from "axios";

const instance = axios.create({
  baseURL: 'https://hack1thon.herokuapp.com'
})

const handleFetch = async({method, url, body = null, headers = null}) => {
  const res = await instance({
    method: method,
    url: url,
    headers: headers,
    data: body
  });
  return res.data;
};

export default handleFetch;