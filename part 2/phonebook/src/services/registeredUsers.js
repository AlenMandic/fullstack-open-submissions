import axios from "axios";
const baseUrl = 'http://localhost:3001/persons';

function getAll() {
    const request = axios.get(baseUrl);
    return request.then(response => response.data).catch(err => alert(err))
}

function createNewUser(userObject) {
    const request = axios.post(baseUrl, userObject)
    return request.then(response => response.data).catch(err => alert(err))
}

function deleteUser(ourUserId) {
    return axios.delete(`${baseUrl}/${ourUserId}`)
        .then(response => console.log(response))
        .catch(err => alert(err))
}

export default { getAll, createNewUser, deleteUser }