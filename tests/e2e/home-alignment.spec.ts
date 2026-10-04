import { expect, test, type Locator } from '@playwright/test'

async function contentBounds (container: Locator) {
  await expect(container).toHaveCount(1)
  await expect(container).toBeVisible()
  const bounds = await container.evaluate(element => {
    const rect = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    return {
      left: rect.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft),
      right: rect.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight),
      height: rect.height
    }
  })
  expect(bounds.height).toBeGreaterThan(0)
  expect(bounds.right).toBeGreaterThan(bounds.left)
  return bounds
}

for (const width of [390, 639, 640, 767, 768, 1023, 1024, 1280, 1440, 1920]) {
  test(`cabeçalho e seções da home compartilham margens em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    expect(await page.evaluate(() => window.innerWidth)).toBe(width)

    const header = page.getByRole('banner')
    // Sem CSS, todas as caixas poderiam alinhar por acaso.
    await expect(header).toHaveCSS('position', 'sticky')
    await expect(page.getByRole('heading', { name: 'Destaques', exact: true })).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    const reference = await contentBounds(header.locator(':scope > div'))

    const sections = [
      ['Hero', page.locator('main section').filter({
        has: page.getByRole('button', { name: 'Slide 1', exact: true })
      })],
      ...['Destaques', 'Sobrevivência', 'RPG', 'Últimas postagens'].map(title => [
        title,
        page.locator('main section').filter({
          has: page.getByRole('heading', { name: title, exact: true })
        })
      ])
    ] as Array<[string, Locator]>

    for (const [name, section] of sections) {
      const actual = await contentBounds(section.locator(':scope > div'))
      expect(Math.abs(actual.left - reference.left), `${name}: margem esquerda`).toBeLessThanOrEqual(1)
      expect(Math.abs(actual.right - reference.right), `${name}: margem direita`).toBeLessThanOrEqual(1)
    }

    for (const title of ['Destaques', 'Sobrevivência', 'RPG']) {
      const section = page.locator('main section').filter({
        has: page.getByRole('heading', { name: title, exact: true })
      })
      const cards = section.locator('a[href^="/jogo/"]')
      await expect(cards).toHaveCount(title === 'Sobrevivência' ? 5 : 7)
      const first = await cards.first().boundingBox()
      expect(first).not.toBeNull()
      expect(Math.abs(first!.x - reference.left), `${title}: primeiro cartão alinhado`).toBeLessThanOrEqual(1)

      const track = cards.first().locator('..')
      const overflow = await track.evaluate(el => el.scrollWidth - el.clientWidth)
      const previous = section.getByRole('button', { name: 'Anterior', exact: true, includeHidden: true })
      const next = section.getByRole('button', { name: 'Próximo', exact: true, includeHidden: true })
      await expect(previous).toBeHidden()
      if (overflow > 1) {
        await expect(next).toBeVisible()
        await next.click()
        await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(0)
        await expect(previous).toBeVisible()
      } else {
        await expect(next).toBeHidden()
      }

      // Mede o cartão final, não apenas o contêiner: detecta sobra no caso de cinco itens.
      await track.evaluate(el => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }))
      await expect.poll(async () => {
        const last = await cards.last().boundingBox()
        return last ? Math.abs(last.x + last.width - reference.right) : Infinity
      }, { message: `${title}: último cartão alinhado ao final da rolagem` }).toBeLessThanOrEqual(1)
      await expect(next).toBeHidden()
    }

    expect(await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    ), 'A página não deve ter rolagem horizontal').toBeLessThanOrEqual(1)
  })
}
