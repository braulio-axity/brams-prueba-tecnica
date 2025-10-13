import type { Article } from '../types'

type Props = {
  article: Article
}

export function ArticleCard({ article }: Props) {
  return (
    <article className="card" aria-label="article-card">
      <img src={article.image} alt={article.title} className="card-img" />
      <div className="card-body">
        <h3 className="card-title">{article.title}</h3>
        <p className="card-summary">{article.summary}</p>
      </div>
    </article>
  )
}
