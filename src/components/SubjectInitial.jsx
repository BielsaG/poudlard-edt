// Cercle avec l'initiale d'une matière (Métamorphose -> "M")
// large : version agrandie pour l'en-tête de la page détail
export default function SubjectInitial({ name, large = false }) {
  const sizeClass = large
    ? 'size-20 border-2 border-brass text-3xl text-castle'
    : 'size-11 border border-brass/60 text-stone-dark'

  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-stone-light font-title font-bold ${sizeClass}`}>
      {name[0]}
    </span>
  )
}
