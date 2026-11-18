import { del, get, patch, post } from './api'

export const getClasses = () => get('/classes')

export const getClassById = (id) => get(`/classes/${id}`)

export const createClass = (classe) => post('/classes', classe)
export const updateClass = (id, classe) =>
  patch(`/classes/${encodeURIComponent(id)}`, classe)
export const deleteClass = (id) => del(`/classes/${encodeURIComponent(id)}`)
