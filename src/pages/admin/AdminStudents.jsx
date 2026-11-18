import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { List } from '../../components'
import { getClasses } from '../../services/classService.js'
import { getHouses } from '../../services/houseService.js'
import { getStudents, createStudent, updateWizard, deleteWizard } from '../../services/wizardService.js'

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [houses, setHouses] = useState([])
  const [classes, setClasses] = useState([])
  const [editingStudent, setEditingStudent] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadStudents() {
    return Promise.all([getStudents(), getHouses(), getClasses()])
  }

  useEffect(() => {
    loadStudents()
      .then(([studentList, houseList, classList]) => {
        setStudents(studentList)
        setHouses(houseList)
        setClasses(classList)
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false))
  }, [])

  function openForm(student = null) {
    setEditingStudent(student)
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const student = {
      firstName: form.get('firstName').trim(),
      lastName: form.get('lastName').trim(),
      email: form.get('email').trim(),
      houseId: form.get('houseId'),
      classId: form.get('classId'),
    }
    const password = form.get('password')

    try {
      if (editingStudent) {
        await updateWizard(editingStudent.id, password ? { ...student, password } : student)
      } else {
        await createStudent({ ...student, password })
      }
      const [studentList, houseList, classList] = await loadStudents()
      setStudents(studentList)
      setHouses(houseList)
      setClasses(classList)
      setShowForm(false)
      setEditingStudent(null)
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  async function handleDelete(student) {
    if (!window.confirm(`Supprimer ${student.firstName} ${student.lastName} ?`)) return

    try {
      await deleteWizard(student.id)
      const [studentList, houseList, classList] = await loadStudents()
      setStudents(studentList)
      setHouses(houseList)
      setClasses(classList)
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  const houseNames = new Map(houses.map((house) => [house.id, house.name]))
  const classNames = new Map(classes.map((classe) => [classe.id, classe.name]))
  const query = search.trim().toLowerCase()
  const filteredStudents = students.filter((student) => {
    const house = houseNames.get(student.houseId) || ''
    const classe = classNames.get(student.classId) || ''
    const text = `${student.firstName} ${student.lastName} ${student.email} ${house} ${classe}`.toLowerCase()
    return text.includes(query)
  })

  return (
    <section>
      <div className="admin-heading">
        <h2>Élèves</h2>
        <button className="admin-add-button" type="button" onClick={() => openForm()}>
          <FontAwesomeIcon icon={faPlus} />
          Ajouter
        </button>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}

      {showForm && (
        <form className="admin-form" key={editingStudent?.id ?? 'new'} onSubmit={handleSubmit}>
          <h3>{editingStudent ? 'Modifier un élève' : 'Ajouter un élève'}</h3>
          <label className="admin-field">
            Prénom
            <input name="firstName" defaultValue={editingStudent?.firstName ?? ''} required />
          </label>
          <label className="admin-field">
            Nom
            <input name="lastName" defaultValue={editingStudent?.lastName ?? ''} required />
          </label>
          <label className="admin-field">
            Adresse e-mail
            <input name="email" type="email" defaultValue={editingStudent?.email ?? ''} required />
          </label>
          <label className="admin-field">
            Mot de passe
            <input name="password" type="password" required={!editingStudent} />
          </label>
          <label className="admin-field">
            Maison
            <select name="houseId" defaultValue={editingStudent?.houseId ?? ''} required>
              <option value="">Choisir une maison</option>
              {houses.map((house) => <option key={house.id} value={house.id}>{house.name}</option>)}
            </select>
          </label>
          <label className="admin-field">
            Classe
            <select name="classId" defaultValue={editingStudent?.classId ?? ''} required>
              <option value="">Choisir une classe</option>
              {classes.map((classe) => <option key={classe.id} value={classe.id}>{classe.name}</option>)}
            </select>
          </label>
          <div className="admin-form-actions">
            <button className="admin-add-button" type="submit">Enregistrer</button>
            <button className="admin-cancel-button" type="button" onClick={() => setShowForm(false)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <List
          columns={['Nom', 'Adresse e-mail', 'Maison', 'Classe']}
          search={search}
          onSearchChange={setSearch}
          placeholder="Rechercher parmi les élèves..."
          isEmpty={filteredStudents.length === 0}
          emptyMessage={students.length === 0 ? 'Aucun élève.' : 'Aucun résultat.'}
        >
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.firstName} {student.lastName}</td>
              <td>{student.email}</td>
              <td>{houseNames.get(student.houseId) ?? ''}</td>
              <td>{classNames.get(student.classId) ?? ''}</td>
              <td className="data-list-actions-cell">
                <div className="data-list-actions admin-actions">
                  <button className="admin-icon-button" type="button" aria-label={`Modifier ${student.firstName} ${student.lastName}`} onClick={() => openForm(student)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="admin-icon-button" type="button" aria-label={`Supprimer ${student.firstName} ${student.lastName}`} onClick={() => handleDelete(student)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </List>
      )}
    </section>
  )
}
