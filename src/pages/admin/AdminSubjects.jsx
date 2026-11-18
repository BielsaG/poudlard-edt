import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { List } from '../../components'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../../services/subjectService.js'
import { getTeachers } from '../../services/wizardService.js'

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [editingSubject, setEditingSubject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadSubjects() {
    return Promise.all([getSubjects(), getTeachers()])
  }

  useEffect(() => {
    loadSubjects()
      .then(([subjectList, teacherList]) => {
        setSubjects(subjectList)
        setTeachers(teacherList)
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false))
  }, [])

  function openForm(subject = null) {
    setEditingSubject(subject)
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const subject = {
      name: form.get('name').trim(),
      room: form.get('room').trim(),
      description: form.get('description').trim(),
      teacherId: form.get('teacherId'),
    }

    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, subject)
      } else {
        await createSubject(subject)
      }
      const [subjectList, teacherList] = await loadSubjects()
      setSubjects(subjectList)
      setTeachers(teacherList)
      setShowForm(false)
      setEditingSubject(null)
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  async function handleDelete(subject) {
    if (!window.confirm(`Supprimer la matière « ${subject.name} » ?`)) return

    try {
      await deleteSubject(subject.id)
      const [subjectList, teacherList] = await loadSubjects()
      setSubjects(subjectList)
      setTeachers(teacherList)
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  const query = search.trim().toLowerCase()
  const filteredSubjects = subjects.filter((subject) => {
    const teacher = subject.teacher
      ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
      : ''
    const text = `${subject.name} ${subject.room} ${teacher}`.toLowerCase()
    return text.includes(query)
  })

  return (
    <section>
      <div className="admin-heading">
        <h2>Matières</h2>
        <button className="admin-add-button" type="button" onClick={() => openForm()}>
          <FontAwesomeIcon icon={faPlus} />
          Ajouter
        </button>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}

      {showForm && (
        <form className="admin-form" key={editingSubject?.id ?? 'new'} onSubmit={handleSubmit}>
          <h3>{editingSubject ? 'Modifier une matière' : 'Ajouter une matière'}</h3>
          <label className="admin-field">
            Nom
            <input name="name" defaultValue={editingSubject?.name ?? ''} required />
          </label>
          <label className="admin-field">
            Salle
            <input name="room" defaultValue={editingSubject?.room ?? ''} required />
          </label>
          <label className="admin-field">
            Professeur
            <select name="teacherId" defaultValue={editingSubject?.teacherId ?? ''} required>
              <option value="">Choisir un professeur</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            Description
            <textarea name="description" defaultValue={editingSubject?.description ?? ''} required />
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
          columns={['Matière', 'Salle', 'Professeur']}
          search={search}
          onSearchChange={setSearch}
          placeholder="Rechercher dans les matières..."
          isEmpty={filteredSubjects.length === 0}
          emptyMessage={subjects.length === 0 ? 'Aucune matière.' : 'Aucun résultat.'}
        >
          {filteredSubjects.map((subject) => (
            <tr key={subject.id}>
              <td>{subject.name}</td>
              <td>{subject.room}</td>
              <td>
                {subject.teacher
                  ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                  : 'Aucun professeur'}
              </td>
              <td className="data-list-actions-cell">
                <div className="data-list-actions admin-actions">
                  <button className="admin-icon-button" type="button" aria-label={`Modifier ${subject.name}`} onClick={() => openForm(subject)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="admin-icon-button" type="button" aria-label={`Supprimer ${subject.name}`} onClick={() => handleDelete(subject)}>
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
