import { get } from './api'

export const getWizardById = (id) => get(`/wizards/${id}`)

export const createWizard = (wizard) =>
  get('/wizards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wizard),
  })

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

export const updateWizard = (id, wizard) =>
  get(`/wizards/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wizard),
  })

export const deleteWizard = (id) =>
  get(`/wizards/${id}`, {
    method: 'DELETE',
  })

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
