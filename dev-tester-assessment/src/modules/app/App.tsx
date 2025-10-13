import { useEffect, useMemo, useState } from 'react'
import { ArticleList } from '../articles/components/ArticleList'
import { SearchBar } from '../articles/components/SearchBar'
import type { Article } from '../articles/types'

export function App() {
  const [articles, setArticles] = useState<Article[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    // Simular fetch a CMS con pequeño delay
    const timer = setTimeout(async () => {
      const res = await fetch('/mock/articles.json')
      const data = (await res.json()) as Article[]
      setArticles(data)
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles
    return articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    )
  }, [articles, query])

  return (
    <div className="container">
      <header>
        <h1>Dev Tester Assessment</h1>
        <SearchBar value={query} onChange={setQuery} />
      </header>
      <main>
        <ArticleList items={filtered} pageSize={5} />
      </main>
    </div>
  )
}
