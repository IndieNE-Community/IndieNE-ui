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

    expect(await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    ), 'A página não deve ter rolagem horizontal').toBeLessThanOrEqual(1)
  })
}
