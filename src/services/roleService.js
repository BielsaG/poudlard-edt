import { get } from './api'

// Tous les rôles (admin, staff, user)
export const getRoles = () => get('/roles')
