import { expect, test } from '@playwright/test'

test('Destaques prioriza os marcados e inclui o restante sem duplicar ou reordenar o catálogo', async ({ request }) => {
  const response = await request.get('/')
  expect(response.status()).toBe(200)
  const sections = (await response.text()).match(/<section\b[\s\S]*?<\/section>/g) ?? []
  function gameIds (title: string) {
    const matches = sections.filter(section => new RegExp(`<h2\\b[^>]*>\\s*${title}\\s*</h2>`).test(section))
    expect(matches).toHaveLength(1)
    return [...matches[0]!.matchAll(/href="\/jogo\/(\d+)"/g)].map(match => Number(match[1]))
  }

  expect(gameIds('Destaques')).toEqual([2, 3, 5, 6, 7, 1, 4])
  expect(gameIds('RPG')).toEqual([1, 2, 3, 4, 5, 6, 7])
  expect(gameIds('Sobrevivência')).toEqual([1, 2, 3, 4, 5])
})
