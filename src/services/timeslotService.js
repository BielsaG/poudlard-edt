import { get } from './api'

export const getClassTimeslots = (classId) => get(`/timeslots?classId=${classId}&_embed=subject`)
