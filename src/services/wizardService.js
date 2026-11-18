import { del, get, patch, post } from './api'
import { getRoles } from './roleService'

export const getWizards = () => get('/wizards')

export const getWizardById = (id) => get(`/wizards/${id}`)

export const createWizard = (wizard) =>
  post('/wizards', wizard)

export async function getWizardProfile(id) {
  const [wizard, roles, houses, classes] = await Promise.all([
    getWizardById(id),
    get('/roles'),
    get('/houses'),
    get('/classes'),
  ])

  return {
    id: wizard.id,
    prenom: wizard.firstName,
    nom: wizard.lastName,
    email: wizard.email,
    photo: wizard.avatar,
    roles: wizard.roleIds.map(
      (roleId) => roles.find((role) => role.id === roleId)?.label || roleId,
    ),
    maison: houses.find((house) => house.id === wizard.houseId)?.name || '',
    classe: classes.find((classe) => classe.id === wizard.classId)?.name || '',
    houseId: wizard.houseId || '',
    classId: wizard.classId || '',
    maisons: houses,
    classes,
    villeOrigine: wizard.villeOrigine || '',
    animal: wizard.animal || '',
    baguette: wizard.baguette || {},
  }
}

export async function getStudents() {
  const [wizards, roles] = await Promise.all([getWizards(), getRoles()])
  const studentRole = roles.find((role) => role.name === 'user')

  if (!studentRole) throw new Error('Le rôle élève est introuvable.')

  return wizards.filter((wizard) => wizard.roleIds.includes(studentRole.id))
}

export async function createStudent(student) {
  const roles = await getRoles()
  const studentRole = roles.find((role) => role.name === 'user')

  if (!studentRole) throw new Error('Le rôle élève est introuvable.')

  return post('/wizards', {
    ...student,
    avatar: '',
    headOfHouseId: null,
    roleIds: [studentRole.id],
  })
}

export const updateWizard = (id, wizard) =>
  patch(`/wizards/${encodeURIComponent(id)}`, wizard)
export const deleteWizard = (id) => del(`/wizards/${encodeURIComponent(id)}`)

// Le staff : les sorciers sans maison
export const getStaff = () => get('/wizards?houseId=null')

export async function getTeachers() {
  const [staff, subjects] = await Promise.all([getStaff(), get('/subjects')])

  return staff
    .map((wizard) => ({
      ...wizard,
      subject: subjects.find((s) => s.teacherId === wizard.id) ?? null,
    }))
    .filter((wizard) => wizard.subject)
}

// Annuaire du staff : chaque membre avec ses rôles et ses matières
export async function getStaffDirectory() {
  const [staff, roles, subjects] = await Promise.all([
    get('/wizards?houseId=null&_sort=lastName'),
    get('/roles'),
    get('/subjects'),
  ])

  return staff.map((wizard) => ({
    ...wizard,
    roles: roles.filter((r) => wizard.roleIds.includes(r.id)),
    subjects: subjects.filter((s) => s.teacherId === wizard.id),
  }))
}
