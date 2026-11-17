import Eyebrow from './Eyebrow'

// En-tête centré des pages : sur-titre + titre + sous-titre
export default function PageTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 font-title text-3xl md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 text-lg text-stone-dark">{subtitle}</p>}
    </div>
  )
}
