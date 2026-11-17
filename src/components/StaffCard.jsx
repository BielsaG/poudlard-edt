import Avatar from './Avatar'
import Label from './Label'

// Carte d'un membre du staff : initiales, nom et matière(s) enseignée(s)
// wizard : un sorcier avec sa liste "subjects" (voir getStaffDirectory)
export default function StaffCard({ wizard }) {
  const subjects = wizard.subjects.length > 0 ? wizard.subjects.map((s) => s.name).join(', ') : '—'

  return (
    <article className="flex h-full gap-5 rounded-md border border-stone/60 bg-parchment-light p-7 shadow-md shadow-castle/5">
      <Avatar
        firstName={wizard.firstName}
        lastName={wizard.lastName}
        className="size-18 bg-stone/60 font-title text-2xl text-castle shadow-md"
      />

      <div className="min-w-0 flex-1">
        <h2 className="font-title text-xl">
          {wizard.firstName} {wizard.lastName}
        </h2>

        <hr className="my-4 border-stone/50" />

        <Label>Matière enseignée</Label>
        <p className="mt-1 font-bold">{subjects}</p>
      </div>
    </article>
  )
}
