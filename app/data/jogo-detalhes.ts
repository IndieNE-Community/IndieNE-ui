// TODO(API): substituir detalhes, campanha, atualizações e comentários mockados pelos respectivos dados do backend.
import type { DetalhesJogo } from '~/types/jogo-detalhes.interface'

const vazio: DetalhesJogo = {
  descricao: '',
  valorArrecadado: 0,
  apoiadores: 0,
  dias: 0,
  metaValor: 0,
  fotos: [],
  atualizacoes: []
}

/** Gera detalhes mínimos (meta, valor, apoiadores) alinhados ao metaPercentual do jogo. */
function detalheCampanha (
  metaValor: number,
  metaPercentual: number,
  descricao: string,
  dias = 60
): Pick<DetalhesJogo, 'descricao' | 'valorArrecadado' | 'apoiadores' | 'dias' | 'metaValor' | 'fotos' | 'atualizacoes'> {
  const valorArrecadado = Math.round((metaValor * metaPercentual) / 100)
  const apoiadores = Math.max(1, Math.round(valorArrecadado / 55))
  return {
    descricao,
    valorArrecadado,
    apoiadores,
    dias,
    metaValor,
    fotos: [],
    atualizacoes: []
  }
}

const detalhesPorJogo: Record<string, DetalhesJogo> = {
  'god-breakers': {
    descricao: 'Assuma o controle de cada luta em um combate fluido e feroz enquanto conecta combos agressivos, cancela ataques e coordena sua equipe para criar a equipe perfeita e derrube criaturas brutas em vários mundos.',
    valorArrecadado: 68745,
    apoiadores: 851,
    dias: 86,
    metaValor: 100000,
    fotos: ['', '', '', '', '', '', '', '', ''],
    atualizacoes: [
      {
        titulo: 'Novas mecanicas de raid',
        data: '26/11 às 19h58',
        descricao: 'Novas mecanicas de raid foram adicionadas ao jogo, incluindo novas boss fights e novas mecânicas de combate.',
        imagem: 'https://thunderfulgames.com/wp-content/uploads/2025/08/GODBREAKERS_Co-op_Mini-boss_Fight_Gladitor-scaled.jpg',
        comentarios: [
          { usuario: '@japa_UDI', texto: 'Godbreakers já mostra um potencial enorme.', likes: 58, dislikes: 0 },
          { usuario: '@manoel_games', texto: 'Desde o trailer eu tava empolgado', likes: 0, dislikes: 0 }
        ]
      },
      {
        titulo: 'Novas skins',
        data: '2 meses atrás',
        descricao: 'Novas skins foram adicionadas ao jogo, incluindo novas skins para os personagens e novas mecânicas de combate.',
        imagem: 'https://image.api.playstation.com/vulcan/ap/rnd/202510/2410/994872858ee48fa0ea6e2e553fca8c72e98d346262e4199e.jpg?w=1920&thumb=false',
        comentarios: [
          { usuario: '@tadala_queue', texto: 'Muito hypado, já vó deixar na wishlist', likes: 83, dislikes: 0 }
        ]
      },
      {
        titulo: 'Nova classe: Scy Bat',
        data: '6 meses atrás',
        descricao: 'Nova classe: Scy Bat, uma classe que combina a velocidade e a agilidade de um morcego com a força e a resistência de um vampiro.',
        imagem: 'https://cdnb.artstation.com/p/assets/images/images/094/509/265/4k/anna-nilsson-scy-bat.webp?1765585802',
        comentarios: []
      }
    ]
  },
  'binding-isaac': detalheCampanha(80000, 100, 'Roguelike de ação e exploração em masmorras com combate frenético e dezenas de itens.', 45),
  'hades': detalheCampanha(120000, 100, 'Roguelike de ação com narrativa e combate fluido no submundo grego.', 30),
  'absolum': detalheCampanha(75000, 45, 'RPG de ação com mundo aberto e narrativa envolvente.', 90),
  'back-seat-drivers': detalheCampanha(60000, 82, 'Corrida multijogador caótica com foco em diversão em grupo.', 60),
  'space-evolver': detalheCampanha(50000, 25, 'Estratégia espacial com evolução e gestão de recursos.', 120),
  'hollow-knight': detalheCampanha(57000, 100, 'Metroidvania em um reino de insetos com combate preciso e atmosfera única.', 28),
  'celeste': detalheCampanha(23000, 100, 'Plataforma desafiador com história sobre superação e saúde mental.', 21),
  'dead-cells': detalheCampanha(250000, 100, 'Roguelike de ação 2D com combate fluido e progressão permanente.', 19),
  'stardew-valley': detalheCampanha(40000, 100, 'Simulação de fazenda e vida com RPG e multiplayer.', 31),
  'undertale': detalheCampanha(51000, 100, 'RPG que questiona violência com escolhas que importam.', 27),
  'deliverance': detalheCampanha(90000, 70, 'Survival de ação em mundo pós-apocalíptico, solo ou cooperativo.', 75),
  'flatlands': detalheCampanha(45000, 55, 'Survival em mundo plano com crafting e exploração.', 80),
  'monster-survival': detalheCampanha(85000, 88, 'Survival roguelike contra monstros com progressão e coop.', 65),
  'giant-green-peaks': detalheCampanha(55000, 40, 'Survival em paisagens gigantes e perigosas.', 100),
  'the-forest': detalheCampanha(125000, 100, 'Survival de terror em floresta com criaturas e construção.', 30),
  'valheim': detalheCampanha(500000, 100, 'Survival viking com exploração, construção e chefes épicos.', 22),
  'dont-starve': detalheCampanha(200000, 100, 'Survival gótico com crafting, sanity e estações.', 12),
  'subnautica': detalheCampanha(100000, 100, 'Survival e exploração no fundo do oceano alienígena.', 18),
  'raft': detalheCampanha(150000, 100, 'Survival no mar em uma jangada, construindo e explorando ilhas.', 25),
  'grounded': detalheCampanha(180000, 100, 'Survival onde você é minúsculo no quintal, com insetos gigantes.', 26),
  'songs-of-silence': detalheCampanha(70000, 60, 'RPG de estratégia com combate tático e narrativa.', 85),
  'amerta': detalheCampanha(65000, 35, 'RPG indie com foco em história e exploração.', 110),
  'cosmic-coop': detalheCampanha(58000, 50, 'RPG cooperativo em cenário espacial.', 70),
  'cassette-beasts': detalheCampanha(75000, 100, 'RPG com monstros que você grava em fitas e transforma.', 24),
  'chained-echoes': detalheCampanha(95000, 100, 'RPG clássico inspirado em SNES com combate por turnos.', 30),
  'sea-of-stars': detalheCampanha(130000, 100, 'RPG inspirado nos clássicos dos 90s com combate e exploração.', 29),
  'eastward': detalheCampanha(80000, 100, 'RPG de aventura pixel art com dupla de personagens.', 35),
  'crosscode': detalheCampanha(26000, 100, 'RPG de ação 2D com puzzles e combate em tempo real.', 36),
  'octopath': detalheCampanha(150000, 100, 'RPG com oito protagonistas e combate por turnos estilizado.', 14),
  'triangle-strategy': detalheCampanha(140000, 100, 'RPG tático com decisões morais e batalhas em grid.', 24),
  'ambrosia': detalheCampanha(72000, 42, 'RPG de aventura indie com mundo aberto e narrativa.', 95)
}

export function getDetalhesJogo (jogoId: string): DetalhesJogo {
  return detalhesPorJogo[jogoId] ?? { ...vazio }
}
