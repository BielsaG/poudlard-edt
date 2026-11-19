import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function getPages(currentPage, totalPages) {
  if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const shown = [...new Set([1, currentPage - 1, currentPage, totalPages])]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  const pages = []
  shown.forEach((page, index) => {
    const previous = shown[index - 1]
    if (previous !== undefined && page - previous > 1) pages.push('…')
    pages.push(page)
  })
  return pages
}

const SLOT = 'inline-flex size-10 items-center justify-center rounded-md'
const linkClass = `${SLOT} text-brass-dark transition-colors hover:text-castle focus-visible:outline-2 focus-visible:outline-brass`

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  if (totalPages <= 1) return null

  const maxSlots = totalPages <= 3 ? totalPages : 5
  const middleWidth = `calc(${maxSlots} * 2.5rem + ${maxSlots - 1} * 0.25rem)`
  const isFirst = currentPage === 1
  const isLast = currentPage === totalPages

  return (
    <nav aria-label="Pagination" className={className}>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          aria-label="Page précédente"
          className={`${linkClass} ${isFirst ? 'invisible' : ''}`}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
        </button>

        <ul className="flex justify-center gap-1" style={{ width: middleWidth }}>
          {getPages(currentPage, totalPages).map((page, index) =>
            page === '…' ? (
              <li key={`ellipsis-${index}`} className={`${SLOT} text-stone-dark`} aria-hidden="true">
                …
              </li>
            ) : (
              <li key={page}>
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                  // Page actuelle : en gras et plus foncée ; les autres en graisse normale
                  className={`${linkClass} ${page === currentPage ? 'font-extrabold text-castle' : 'font-normal'}`}
                >
                  {page}
                </button>
              </li>
            ),
          )}
        </ul>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          aria-label="Page suivante"
          className={`${linkClass} ${isLast ? 'invisible' : ''}`}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
        </button>
      </div>
    </nav>
  )
}
