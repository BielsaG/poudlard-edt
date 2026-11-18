// Carte claire avec un titre et un séparateur
export default function Card({ title, children }) {
  return (
    <div className="rounded-md border border-stone/60 bg-parchment-light p-6 shadow-md shadow-castle/5">
      <h2 className="font-title text-xl">{title}</h2>
      <hr className="my-4 border-stone/50" />
      {children}
    </div>
  )
}
