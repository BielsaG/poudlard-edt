import { get } from './api'

// Tous les sorciers (élèves + staff)
export const getWizards = () => get('/wizards')

// Un sorcier par son id
export const getWizardById = (id) => get(`/wizards/${id}`)

// Le staff : les sorciers sans maison
export const getStaff = () => get('/wizards?houseId=null')

// Professeurs avec leur matière
// (json-server ne sait pas relier subjects.teacherId à wizards : on le fait ici)
export async function getTeachers() {
  const [staff, subjects] = await Promise.all([getStaff(), get('/subjects')])

  return staff
    .map((wizard) => ({
      ...wizard,
      subject: subjects.find((s) => s.teacherId === wizard.id) ?? null,
    }))
    .filter((wizard) => wizard.subject) // on garde ceux qui enseignent une matière
}
