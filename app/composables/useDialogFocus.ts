export function useDialogFocus (open: Ref<boolean>, container: Ref<HTMLElement | null>) {
  let retornoFoco: HTMLElement | null = null

  function elementosFocaveis () {
    return [...(container.value?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) ?? [])]
  }

  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Tab') return
    const elementos = elementosFocaveis()
    if (!elementos.length) {
      event.preventDefault()
      container.value?.focus()
      return
    }
    const primeiro = elementos[0]!
    const ultimo = elementos.at(-1)!
    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault()
      ultimo.focus()
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault()
      primeiro.focus()
    }
  }

  watch(open, async (aberto) => {
    if (aberto) {
      retornoFoco = document.activeElement as HTMLElement | null
      await nextTick()
      ;(elementosFocaveis()[0] ?? container.value)?.focus()
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
      retornoFoco?.focus()
      retornoFoco = null
    }
  })

  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}
