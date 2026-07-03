interface LocalStorageStateOptions<T> {
  defaultValue: () => T
  deserialize?: (value: string) => T
  serialize?: (value: T) => string
}

export function useLocalStorageState<T> (key: string, options: LocalStorageStateOptions<T>): Ref<T> {
  const state = ref<T>(options.defaultValue()) as Ref<T>

  if (import.meta.client) {
    try {
      const storedValue = localStorage.getItem(key)
      if (storedValue !== null) {
        state.value = options.deserialize ? options.deserialize(storedValue) : JSON.parse(storedValue) as T
      }
    } catch {
      state.value = options.defaultValue()
    }

    watch(state, (value) => {
      const serialized = options.serialize ? options.serialize(value) : JSON.stringify(value)
      localStorage.setItem(key, serialized)
    }, { deep: true })
  }

  return state
}
