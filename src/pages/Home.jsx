import { Link } from 'react-router-dom'
import img from '../assets/photos/photo-poudlard-accueil.jpg'

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-4 py-12 text-center">
      <img src={img} alt="" className="h-96 w-full object-cover" />
      <h5>École de sorcellerie · Écosse</h5>
      <h1>Votre année à Poudlard, parfaitement orchestrée.</h1>
      <p>Consultez les cours, découvrez le corps enseignant et gardez le rythme de la vie au château.</p>
      <div className="flex gap-4">
        <Link to="/cours" className="bg-brass text-castle hover:bg-parchment hover:text-castle">
          Consulter les cours
        </Link>
        <Link to="/matieres" className="bg-stone text-parchment hover:bg-parchment hover:text-castle">
          Voir les matières
        </Link>
      </div>
    </section>
  )
}
