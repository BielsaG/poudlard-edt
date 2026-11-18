import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { List } from '../../components'
import { getClasses, createClass, updateClass, deleteClass } from '../../services/classService.js'
import { getSubjects } from '../../services/subjectService.js'

export default function AdminClasses() {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [editingClass, setEditingClass] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadClasses() {
    return Promise.all([getClasses(), getSubjects()])
  }

  useEffect(() => {
    loadClasses()
      .then(([classList, subjectList]) => {
        setClasses(classList)
        setSubjects(subjectList)
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false))
  }, [])

  function openForm(classe = null) {
    setEditingClass(classe)
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const classe = {
      name: form.get('name').trim(),
      level: Number(form.get('level')),
      subjectIds: form.getAll('subjectIds'),
    }

    try {
      if (editingClass) {
        await updateClass(editingClass.id, classe)
      } else {
        await createClass(classe)
      }
      const [classList, subjectList] = await loadClasses()
      setClasses(classList)
      setSubjects(subjectList)
      setShowForm(false)
      setEditingClass(null)
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  async function handleDelete(classe) {
    if (!window.confirm(`Supprimer la classe « ${classe.name} » ?`)) return

    try {
      await deleteClass(classe.id)
      const [classList, subjectList] = await loadClasses()
      setClasses(classList)
      setSubjects(subjectList)
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  const subjectNames = new Map(subjects.map((subject) => [subject.id, subject.name]))

  function getClassSubjects(classe) {
    const subjectIds = classe.subjectIds || []
    return subjectIds.map((id) => subjectNames.get(id)).filter(Boolean)
  }

  const query = search.trim().toLowerCase()
  const filteredClasses = classes.filter((classe) => {
    const classSubjects = getClassSubjects(classe).join(' ')
    const text = `${classe.name} ${classe.level} ${classSubjects}`.toLowerCase()
    return text.includes(query)
  })

  return (
    <section>
      <div className="admin-heading">
        <h2>Classes</h2>
        <button className="admin-add-button" type="button" onClick={() => openForm()}>
          <FontAwesomeIcon icon={faPlus} />
          Ajouter
        </button>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}

      {showForm && (
        <form className="admin-form" key={editingClass?.id ?? 'new'} onSubmit={handleSubmit}>
          <h3>{editingClass ? 'Modifier une classe' : 'Ajouter une classe'}</h3>
          <label className="admin-field">
            Nom
            <input name="name" defaultValue={editingClass?.name ?? ''} required />
          </label>
          <label className="admin-field">
            Niveau
            <input name="level" type="number" min="1" max="6" defaultValue={editingClass?.level ?? ''} required />
          </label>
          <label className="admin-field">
            Matières enseignées
            <select name="subjectIds" multiple defaultValue={editingClass?.subjectIds ?? []}>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
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
          columns={['Classe', 'Niveau', 'Matières']}
          search={search}
          onSearchChange={setSearch}
          placeholder="Rechercher dans les classes..."
          isEmpty={filteredClasses.length === 0}
          emptyMessage={classes.length === 0 ? 'Aucune classe.' : 'Aucun résultat.'}
        >
          {filteredClasses.map((classe) => (
            <tr key={classe.id}>
              <td className="admin-nowrap">{classe.name}</td>
              <td className="admin-nowrap">Niveau {classe.level}</td>
              <td>{getClassSubjects(classe).join(', ') || 'Aucune matière'}</td>
              <td className="data-list-actions-cell">
                <div className="data-list-actions admin-actions">
                  <button className="admin-icon-button" type="button" aria-label={`Modifier ${classe.name}`} onClick={() => openForm(classe)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="admin-icon-button" type="button" aria-label={`Supprimer ${classe.name}`} onClick={() => handleDelete(classe)}>
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
