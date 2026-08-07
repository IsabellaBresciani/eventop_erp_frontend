import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TablePaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  itemLabel?: string
  className?: string
}

export const DEFAULT_TABLE_PAGE_SIZE = 10

export function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = 'resultados',
  className = '',
}: TablePaginationProps) {
  if (totalItems <= pageSize) return null

  const rangeStart = (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, totalItems)
  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <nav
      className={`flex flex-col items-center justify-between gap-4 border-t border-black/[0.06] px-5 py-4 sm:flex-row sm:px-6 ${className}`}
      aria-label="Paginación de tabla"
    >
      <p className="text-[13px] text-apple-label">
        Mostrando {rangeStart}–{rangeEnd} de {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-full text-apple-label transition-colors hover:bg-apple-fill disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageNumbers.map((pageNumber, index) =>
          pageNumber === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 min-w-[2.25rem] items-center justify-center px-1 text-[13px] text-apple-label"
            >
              …
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-2 text-[13px] font-semibold transition-colors ${
                pageNumber === page
                  ? 'bg-primary text-white shadow-[0_2px_8px_rgba(94,23,235,0.3)]'
                  : 'text-apple-label hover:bg-apple-fill'
              }`}
              aria-label={`Página ${pageNumber}`}
              aria-current={pageNumber === page ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-full text-apple-label transition-colors hover:bg-apple-fill disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}

function getPageNumbers(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: Array<number | 'ellipsis'> = [1]

  if (current > 3) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  if (current < total - 2) pages.push('ellipsis')

  pages.push(total)
  return pages
}
