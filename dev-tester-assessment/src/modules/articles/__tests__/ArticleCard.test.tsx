import { render, screen } from '@testing-library/react'
import { ArticleCard } from '../../articles/components/ArticleCard'
import type { Article } from '../../articles/types'

const mockArticle: Article = {
  id: '1',
  title: 'Título de prueba',
  image: 'https://picsum.photos/seed/test/400/300',
  summary: 'Resumen de prueba'
}

test('renderiza título, imagen y resumen', () => {
  render(<ArticleCard article={mockArticle} />)

  expect(screen.getByRole('img', { name: /título de prueba/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 3, name: /título de prueba/i })).toBeInTheDocument()
  expect(screen.getByText(/resumen de prueba/i)).toBeInTheDocument()
})
