// Cercle avec les initiales d'un sorcier : Albus Dumbledore -> "AD"
// className sert à choisir la taille et les couleurs
export default function Avatar({ firstName, lastName, className = 'size-10 bg-stone/50 text-xs text-stone-dark' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-bold ${className}`}>
      {firstName[0]}
      {lastName[0]}
    </span>
  )
}
