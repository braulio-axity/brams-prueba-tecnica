import { useMemo, useState } from 'react'
import type { Article } from '../types'
import { ArticleCard } from './ArticleCard'

type Props = {
  items: Article[]
  pageSize?: number
}

export function ArticleList({ items, pageSize = 5 }: Props) {
  const [page, setPage] = useState(1)

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  )
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  const goTo = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)))

  return (
    <section>
      {pageItems.length === 0 ? (
        <p role="status">No hay artículos</p>
      ) : (
        <div className="grid">
          {pageItems.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      <nav className="pagination" aria-label="paginacion">
        <button onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="prev">
          « Anterior
        </button>
        <span data-testid="page-indicator">
          Página {page} de {totalPages}
        </span>
        <button onClick={() => goTo(page + 1)} disabled={page === totalPages} aria-label="next">
          Siguiente »
        </button>
      </nav>
    </section>
  )
}
