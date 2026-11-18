import { del, get, patch, post } from './api'

// Toutes les classes (1re à 6e année)
export const getClasses = () => get('/classes')

// Une classe par son id
export const getClassById = (id) => get(`/classes/${id}`)

export const createClass = (classe) => post('/classes', classe)
export const updateClass = (id, classe) =>
  patch(`/classes/${encodeURIComponent(id)}`, classe)
export const deleteClass = (id) => del(`/classes/${encodeURIComponent(id)}`)
