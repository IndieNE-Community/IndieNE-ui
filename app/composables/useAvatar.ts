// Avatar gerado a partir do nome (sem upload, sem backend).
// Mesmo estilo usado nos comentários (DiceBear avataaars).
export function useAvatar () {
  function getAvatarUrl (nome?: string | null): string {
    const seed = encodeURIComponent(nome?.trim() || 'IndieNE')
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
  }

  return { getAvatarUrl }
}
