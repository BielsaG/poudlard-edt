import { get } from './api'

// Toutes les maisons
export const getHouses = () => get('/houses')

// Une maison par son id
export const getHouseById = (id) => get(`/houses/${id}`)
