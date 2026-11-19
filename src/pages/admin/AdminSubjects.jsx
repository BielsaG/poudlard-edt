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
    const subjectList = await getSubjects()
    const teacherList = await getTeachers()
    return [subjectList, teacherList]
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [subjectList, teacherList] = await loadSubjects()
        setSubjects(subjectList)
        setTeachers(teacherList)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2>Matières</h2>
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
          key={editingSubject?.id ?? 'new'}
          onSubmit={handleSubmit}
        >
          <h3 className="col-span-full">
            {editingSubject ? 'Modifier une matière' : 'Ajouter une matière'}
          </h3>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Nom
            <input name="name" defaultValue={editingSubject?.name ?? ''} required />
          </label>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Salle
            <input name="room" defaultValue={editingSubject?.room ?? ''} required />
          </label>
          <label className="grid content-start gap-[0.4rem] font-semibold">
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
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Description
            <textarea name="description" defaultValue={editingSubject?.description ?? ''} required />
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
                <div className="flex justify-end gap-2 max-[480px]:justify-start">
                  <button className="h-10 w-10 cursor-pointer rounded-[0.35rem] border border-brass bg-parchment-light p-2 font-[inherit] text-castle hover:border-brass-dark hover:bg-stone-light" type="button" aria-label={`Modifier ${subject.name}`} onClick={() => openForm(subject)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="h-10 w-10 cursor-pointer rounded-[0.35rem] border border-brass bg-parchment-light p-2 font-[inherit] text-castle hover:border-brass-dark hover:bg-stone-light" type="button" aria-label={`Supprimer ${subject.name}`} onClick={() => handleDelete(subject)}>
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
