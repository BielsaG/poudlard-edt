import { get } from './api'

export const getTimeslots = () => get('/timeslots')

export const getClassTimeslots = (classId) => get(`/timeslots?classId=${classId}&_embed=subject`)
