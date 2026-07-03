export function formatarMoeda (valor: number): string {
  if (valor <= 0) return 'R$ 0'
  return `R$ ${valor.toLocaleString('pt-BR')}`
}

export function parseMetaValor (valor: string | undefined): number {
  if (!valor || valor === '—') return 0
  const numero = valor.replace(/[R$\s.]/g, '').replace(',', '.')
  const resultado = Number(numero)
  return Number.isFinite(resultado) ? resultado : 0
}
