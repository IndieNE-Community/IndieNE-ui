import type { MaybeRefOrGetter } from 'vue'

export function usePagination<T> (
  items: MaybeRefOrGetter<readonly T[]>,
  itemsPerPage: number,
  minimumOnePage = false
) {
  const paginaAtual = ref(1)
  const totalPaginas = computed(() => {
    const total = Math.ceil(toValue(items).length / itemsPerPage)
    return minimumOnePage ? Math.max(1, total) : total
  })

  watch(() => toValue(items), () => { paginaAtual.value = 1 }, { deep: true })
  watch(totalPaginas, (total) => {
    if (paginaAtual.value > total) paginaAtual.value = Math.max(1, total)
  })

  const paginationPages = computed(() => {
    const pagina = paginaAtual.value
    const total = totalPaginas.value
    const paginas: number[] = []

    if (total <= 9) {
      for (let indice = 1; indice <= total; indice++) paginas.push(indice)
      return paginas
    }

    paginas.push(1)
    if (pagina > 3) paginas.push(-1)
    for (let indice = Math.max(2, pagina - 1); indice <= Math.min(total - 1, pagina + 1); indice++) {
      paginas.push(indice)
    }
    if (pagina < total - 2) paginas.push(-1)
    paginas.push(total)
    return paginas
  })

  const itensExibidos = computed(() => {
    const inicio = (paginaAtual.value - 1) * itemsPerPage
    return toValue(items).slice(inicio, inicio + itemsPerPage)
  })

  return { paginaAtual, totalPaginas, paginationPages, itensExibidos }
}
