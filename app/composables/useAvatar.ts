import { buildAvatarUrl } from '~/utils/avatar'

// Avatar gerado pelo serviço configurado no ambiente, sem upload.
export function useAvatar () {
  const { public: { avatarBase } } = useRuntimeConfig()
  function getAvatarUrl (nome?: string | null): string {
    return buildAvatarUrl(avatarBase, nome?.trim() || 'IndieNE')
  }

  return { getAvatarUrl }
}
