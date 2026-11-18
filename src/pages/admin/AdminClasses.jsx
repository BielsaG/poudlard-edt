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
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2>Classes</h2>
        <button
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-[0.35rem] border border-brass bg-brass px-[0.85rem] py-[0.55rem] font-[inherit] font-bold text-parchment-light hover:border-brass-dark hover:bg-stone-light hover:text-castle"
          type="button"
          onClick={() => openForm()}
        >
          <FontAwesomeIcon icon={faPlus} />
          Ajouter
        </button>
      </div>

      {error && <p className="m-0 mb-4 text-error" role="alert">{error}</p>}

      {showForm && (
        <form
          className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4 rounded-[0.45rem] border border-stone bg-parchment p-4 [&>h3]:col-span-full [&_input]:w-full [&_input]:min-h-10 [&_input]:rounded-[0.3rem] [&_input]:border [&_input]:border-stone [&_input]:bg-parchment-light [&_input]:p-2 [&_input]:text-castle [&_input]:font-normal [&_select]:w-full [&_select]:min-h-10 [&_select]:rounded-[0.3rem] [&_select]:border [&_select]:border-stone [&_select]:bg-parchment-light [&_select]:p-2 [&_select]:text-castle [&_select]:font-normal [&_textarea]:w-full [&_textarea]:min-h-10 [&_textarea]:rounded-[0.3rem] [&_textarea]:border [&_textarea]:border-stone [&_textarea]:bg-parchment-light [&_textarea]:p-2 [&_textarea]:text-castle [&_textarea]:font-normal"
          key={editingClass?.id ?? 'new'}
          onSubmit={handleSubmit}
        >
          <h3 className="col-span-full">
            {editingClass ? 'Modifier une classe' : 'Ajouter une classe'}
          </h3>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Nom
            <input name="name" defaultValue={editingClass?.name ?? ''} required />
          </label>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Niveau
            <input name="level" type="number" min="1" max="6" defaultValue={editingClass?.level ?? ''} required />
          </label>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Matières enseignées
            <select className="min-h-28" name="subjectIds" multiple defaultValue={editingClass?.subjectIds ?? []}>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
          </label>
          <div className="col-span-full flex justify-end gap-2">
            <button
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-[0.35rem] border border-brass bg-brass px-[0.85rem] py-[0.55rem] font-[inherit] font-bold text-parchment-light hover:border-brass-dark hover:bg-stone-light hover:text-castle"
              type="submit"
            >
              Enregistrer
            </button>
            <button
              className="min-h-10 cursor-pointer rounded-[0.35rem] border border-brass bg-parchment-light px-[0.85rem] py-[0.55rem] font-[inherit] text-castle hover:border-brass-dark hover:bg-stone-light hover:text-castle"
              type="button"
              onClick={() => setShowForm(false)}
            >
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
              <td className="whitespace-nowrap">{classe.name}</td>
              <td className="whitespace-nowrap">Niveau {classe.level}</td>
              <td>{getClassSubjects(classe).join(', ') || 'Aucune matière'}</td>
              <td className="data-list-actions-cell">
                <div className="flex justify-end gap-2 max-[480px]:justify-start">
                  <button className="h-10 w-10 cursor-pointer rounded-[0.35rem] border border-brass bg-parchment-light p-2 font-[inherit] text-castle hover:border-brass-dark hover:bg-stone-light" type="button" aria-label={`Modifier ${classe.name}`} onClick={() => openForm(classe)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="h-10 w-10 cursor-pointer rounded-[0.35rem] border border-brass bg-parchment-light p-2 font-[inherit] text-castle hover:border-brass-dark hover:bg-stone-light" type="button" aria-label={`Supprimer ${classe.name}`} onClick={() => handleDelete(classe)}>
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
