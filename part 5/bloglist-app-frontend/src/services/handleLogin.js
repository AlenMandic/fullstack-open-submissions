import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/login'

// send username and password to auth route. If successful login, this should return to us the json web token which we can use and user data.
const login = async credentials => {
  try {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  } catch(err) {
    console.log(err)
  }
}

export default { login }