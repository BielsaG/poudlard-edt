// Carte d'une maison : blason, nom et valeurs, avec une ombre à la couleur de la maison
// house : une maison du db.json (name, image, traits, color)
export default function HouseCard({ house }) {
  return (
    <article
      // shadow-xl : taille de l'ombre / shadow-(color:--house-color)/20 : couleur de la maison à 20 % d'opacité
      className="h-full rounded-md bg-parchment-light px-6 py-8 text-center shadow-xl shadow-(color:--house-color)/20"
      // La couleur vient du json : on la donne à Tailwind via une variable CSS
      style={{ '--house-color': house.color }}
    >
      <img src={house.image} alt={`Blason de ${house.name}`} className="mx-auto h-24 w-full object-contain" />
      <h3 className="mt-5 font-title text-xl">{house.name}</h3>
      <hr className="mx-auto my-3 h-px w-12 border-0 bg-stone-dark" />
      <p className="mt-1 text-stone-dark">{house.traits}</p>
    </article>
  )
}
