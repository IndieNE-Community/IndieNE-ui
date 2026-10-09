import { createServer } from 'node:http'

const jogos = [1, 2, 3, 4, 5, 6, 7].map(id => ({
  id,
  titulo: `Jogo de teste ${id}`,
  usuarioId: '00000000-0000-4000-8000-000000000001',
  desenvolvedor: 'Estúdio de teste',
  imgThumb: '/images/jogos/raft.jpg',
  generos: id <= 5 ? ['RPG', 'Survival'] : ['RPG'],
  categorias: [2, 3, 5, 6, 7].includes(id) ? ['destaque'] : [],
  plataformas: ['PC'],
  totalArrecadado: 0,
  apoiadores: 0,
  metaPercentual: 0
}))

function page (content) {
  return {
    content,
    totalElements: content.length,
    totalPages: content.length ? 1 : 0,
    number: 0,
    size: 100
  }
}

const responses = {
  '/jogos': page(jogos),
  '/jogos/1': jogos[0],
  '/publicacoes': page([{
    id: 1, titulo: 'Publicação de teste', data: '2026-01-01T12:00:00Z', jogoId: 1,
    usuarioId: jogos[0].usuarioId
  }]),
  '/comentarios': page([{
    id: 1, texto: 'Comentário de teste', data: '2026-01-01T13:00:00Z', postagemId: 1,
    usuarioId: '00000000-0000-4000-8000-000000000002', likes: 0, dislikes: 0
  }]),
  '/imagens': [],
  '/curtidas': page([])
}

const server = createServer((request, response) => {
  const path = new URL(request.url, 'http://127.0.0.1:4318').pathname
  const failure = /^\/jogos\/(500|502|503|504|599)$/.exec(path)
  if (failure) {
    const status = Number(failure[1])
    if (status === 599) {
      request.socket.destroy()
      return
    }
    if (status === 502) {
      response.writeHead(status, { 'Content-Type': 'text/html' })
      response.end('<html><h1>Bad Gateway</h1><p>upstream internal.example.test</p></html>')
      return
    }
    response.writeHead(status, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ message: 'connect ECONNREFUSED internal.example.test', detail: 'Internal Server Error' }))
    return
  }
  if (request.method !== 'GET' || !Object.hasOwn(responses, path)) {
    response.writeHead(404).end()
    return
  }
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(responses[path]))
})

server.listen(4318, '127.0.0.1')
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close())
}
