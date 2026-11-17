// Petit libellé en majuscules au-dessus d'une info (ex. "SALLE DÉDIÉE")
export default function Label({ children, className = 'text-stone-dark' }) {
  return <p className={`text-[0.65rem] font-bold tracking-widest uppercase ${className}`}>{children}</p>
}
