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
    const studentList = await getStudents()
    const houseList = await getHouses()
    const classList = await getClasses()
    return [studentList, houseList, classList]
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [studentList, houseList, classList] = await loadStudents()
        setStudents(studentList)
        setHouses(houseList)
        setClasses(classList)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2>Élèves</h2>
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
          key={editingStudent?.id ?? 'new'}
          onSubmit={handleSubmit}
        >
          <h3 className="col-span-full">
            {editingStudent ? 'Modifier un élève' : 'Ajouter un élève'}
          </h3>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Prénom
            <input name="firstName" defaultValue={editingStudent?.firstName ?? ''} required />
          </label>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Nom
            <input name="lastName" defaultValue={editingStudent?.lastName ?? ''} required />
          </label>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Adresse e-mail
            <input name="email" type="email" defaultValue={editingStudent?.email ?? ''} required />
          </label>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Mot de passe
            <input name="password" type="password" required={!editingStudent} />
          </label>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Maison
            <select name="houseId" defaultValue={editingStudent?.houseId ?? ''} required>
              <option value="">Choisir une maison</option>
              {houses.map((house) => <option key={house.id} value={house.id}>{house.name}</option>)}
            </select>
          </label>
          <label className="grid content-start gap-[0.4rem] font-semibold">
            Classe
            <select name="classId" defaultValue={editingStudent?.classId ?? ''} required>
              <option value="">Choisir une classe</option>
              {classes.map((classe) => <option key={classe.id} value={classe.id}>{classe.name}</option>)}
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
                <div className="flex justify-end gap-2 max-[480px]:justify-start">
                  <button className="h-10 w-10 cursor-pointer rounded-[0.35rem] border border-brass bg-parchment-light p-2 font-[inherit] text-castle hover:border-brass-dark hover:bg-stone-light" type="button" aria-label={`Modifier ${student.firstName} ${student.lastName}`} onClick={() => openForm(student)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="h-10 w-10 cursor-pointer rounded-[0.35rem] border border-brass bg-parchment-light p-2 font-[inherit] text-castle hover:border-brass-dark hover:bg-stone-light" type="button" aria-label={`Supprimer ${student.firstName} ${student.lastName}`} onClick={() => handleDelete(student)}>
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
