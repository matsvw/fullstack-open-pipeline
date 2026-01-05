import axios from 'axios'
import { tokenStore } from '../helpers/tokenStore'
const baseUrl = '/api/users'

const getAll = async (expand = false) => {
  const response = await axios.get(`${baseUrl}?expand=${expand}`)
  return response.data
}

const getOne = async (id, expand = false) => {
  const response = await axios.get(`${baseUrl}/${id}?expand=${expand}`)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: tokenStore.getToken() },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, getOne, create }
