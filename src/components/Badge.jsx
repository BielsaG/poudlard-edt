export default function Badge({ children, size = 'sm' }) {
  const sizeClass = size === 'md' ? 'px-3 py-0.5 text-sm' : 'px-2.5 py-0.5 text-xs'

  return <span className={`inline-block rounded-full bg-stone/50 font-bold ${sizeClass}`}>{children}</span>
}
