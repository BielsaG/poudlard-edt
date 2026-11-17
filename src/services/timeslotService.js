import { get } from './api'

// Créneaux d'une classe, avec leur matière
export const getClassTimeslots = (classId) => get(`/timeslots?classId=${classId}&_embed=subject`)
