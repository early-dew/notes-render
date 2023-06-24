import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/notes'
const baseUrl = 'https://notes-backend-4yg3.onrender.com/api/notes'


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data)
    .catch(error => {
      console.log('fail')
      throw error
    })
  // axios
  //   .put(`${baseUrl}/${id}`, newObject)
  //   .then(response => response.data)

  //   .catch(error => {
  //     console.log('fail')
  //   })
}

export default { getAll, create, update }