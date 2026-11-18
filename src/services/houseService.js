import { get } from './api'

export const getHouses = () => get('/houses')

export const getHouseById = (id) => get(`/houses/${id}`)
