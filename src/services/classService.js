import { get } from './api'

// Toutes les classes (1re à 6e année)
export const getClasses = () => get('/classes')

// Une classe par son id
export const getClassById = (id) => get(`/classes/${id}`)
