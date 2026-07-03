export function useModal<T> () {
  const itemSelecionado = ref<T | null>(null) as Ref<T | null>

  function abrir (item: T) {
    itemSelecionado.value = item
  }

  function fechar () {
    itemSelecionado.value = null
  }

  function fecharComEscape (event: KeyboardEvent) {
    if (event.key === 'Escape') fechar()
  }

  watch(itemSelecionado, (item) => {
    if (!import.meta.client) return
    if (item) window.addEventListener('keydown', fecharComEscape)
    else window.removeEventListener('keydown', fecharComEscape)
  })

  onUnmounted(() => {
    if (import.meta.client) window.removeEventListener('keydown', fecharComEscape)
  })

  return { itemSelecionado, abrir, fechar }
}
