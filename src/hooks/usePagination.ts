import { useEffect, useMemo, useState } from 'react'

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [items])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  return {
    page,
    setPage,
    totalPages,
    paginatedItems,
    totalItems: items.length,
  }
}
