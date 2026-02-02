import type {
  Art,
  CommissionStatus,
  ModerationReport,
  NotificationItem,
  PriceSheet,
  User,
} from "@/types"

export const users: User[] = [
  {
    id: "art-1",
    nome: "MockUser-1",
    role: "artista",
    avatarUrl:
      "/mock_arts/anime_neon.png",
    bio: "Ilustradora digital focada em fantasia suave e personagens expressivos.",
    seguidores: 12840,
    destaque: "Especialista em retratos anime.",
  },
  {
    id: "art-2",
    nome: "Renato Kaori",
    role: "artista",
    avatarUrl:
      "/mock_arts/anime_neon.png",
    bio: "Diretor de arte com foco em sci-fi e composições cinematográficas.",
    seguidores: 9420,
  },
  {
    id: "cli-1",
    nome: "Marina Souza",
    role: "cliente",
    avatarUrl:
      "/mock_arts/fantasy_landscape.png",
    bio: "Colecionadora e apoiadora de artistas independentes.",
    seguidores: 120,
  },
]

export const arts: Art[] = [
  {
    id: "artwork-1",
    titulo: "Noite Neon",
    imageUrl:
      "/mock_arts/cyberpunk_char.png",
    images: [
      "/mock_arts/cyberpunk_char.png",
      "/mock_arts/anime_neon.png",
      "/mock_arts/comic_hero.png",
    ],
    artistId: "art-1",
    tags: ["#Neon", "#Retrato", "#Anime"],
    nsfw: false,
    preco: 120,
    patrocinado: true,
  },
  {
    id: "artwork-2",
    titulo: "Guardião Floral",
    imageUrl:
      "/mock_arts/abstract_shapes.png",
    artistId: "art-1",
    tags: ["#Fantasy", "#Painterly", "#Detail"],
    nsfw: false,
    preco: 220,
  },
  {
    id: "artwork-3",
    titulo: "Pixel Drift",
    imageUrl:
      "/mock_arts/render_3d.png",
    images: [
      "/mock_arts/render_3d.png",
      "/mock_arts/pixel_city.png",
      "/mock_arts/abstract_shapes.png",
    ],
    artistId: "art-2",
    tags: ["#PixelArt", "#Retro", "#Cidade"],
    nsfw: false,
    preco: 90,
  },
  {
    id: "artwork-4",
    titulo: "Luar Secreto",
    imageUrl:
      "/mock_arts/oil_portrait.png",
    artistId: "art-1",
    tags: ["#Sensual", "#LuzSuave", "#Retrato"],
    nsfw: true,
    preco: 180,
  },
  {
    id: "artwork-5",
    titulo: "Catedral Astral",
    imageUrl:
      "/mock_arts/charcoal_tree.png",
    images: [
      "/mock_arts/charcoal_tree.png",
      "/mock_arts/fantasy_landscape.png",
      "/mock_arts/watercolor_meadow.png",
    ],
    artistId: "art-2",
    tags: ["#SciFi", "#Matte", "#Arquitetura"],
    nsfw: false,
    preco: 300,
    patrocinado: true,
  },
  {
    id: "artwork-6",
    titulo: "Club 97",
    imageUrl:
      "/mock_arts/sketch_dragon.png",
    artistId: "art-2",
    tags: ["#Cyber", "#Night", "#Mood"],
    nsfw: true,
    preco: 160,
  },
  {
    id: "artwork-7",
    titulo: "Viagem Dourada",
    imageUrl:
      "/mock_arts/watercolor_meadow.png",
    images: [
      "/mock_arts/watercolor_meadow.png",
      "/mock_arts/fantasy_landscape.png",
      "/mock_arts/low_poly.png",
    ],
    artistId: "art-1",
    tags: ["#Concept", "#Ilustração", "#Luz"],
    nsfw: false,
    preco: 140,
  },
  {
    id: "artwork-8",
    titulo: "Linha Calma",
    imageUrl:
      "/mock_arts/sketch_dragon.png",
    artistId: "art-1",
    tags: ["#Sketch", "#Mono", "#Minimal"],
    nsfw: false,
    preco: 70,
  },
  {
    id: "artwork-9",
    titulo: "Campo Vertical",
    imageUrl:
      "/mock_arts/low_poly.png",
    artistId: "art-1",
    tags: ["#Landscape", "#Vertical", "#Soft"],
    nsfw: false,
    preco: 150,
  },
  {
    id: "artwork-10",
    titulo: "Luz Larga",
    imageUrl:
      "/mock_arts/comic_hero.png",
    images: [
      "/mock_arts/comic_hero.png",
      "/mock_arts/test_wide_16_9.png",
      "/mock_arts/test_ultrawide_21_9.png",
    ],
    artistId: "art-1",
    tags: ["#Wide", "#Glow", "#Atmosphere"],
    nsfw: false,
    preco: 200,
    patrocinado: true,
  },
  {
    id: "artwork-11",
    titulo: "Retrato Alto",
    imageUrl:
      "/mock_arts/oil_portrait.png",
    artistId: "art-1",
    tags: ["#Portrait", "#Moody", "#Detail"],
    nsfw: false,
    preco: 180,
  },
  {
    id: "artwork-12",
    titulo: "Panorama Frio",
    imageUrl:
      "/mock_arts/cyberpunk_char.png",
    artistId: "art-1",
    tags: ["#Panorama", "#Blue", "#Calm"],
    nsfw: false,
    preco: 220,
  },
  {
    id: "artwork-13",
    titulo: "Aurora Serena",
    imageUrl:
      "/mock_arts/watercolor_meadow.png",
    artistId: "art-1",
    tags: ["#Soft", "#Nature", "#Glow"],
    nsfw: false,
    preco: 160,
  },
  {
    id: "artwork-14",
    titulo: "Rosas de Nevoa",
    imageUrl:
      "/mock_arts/render_3d.png",
    artistId: "art-1",
    tags: ["#Mood", "#Light", "#Portrait"],
    nsfw: false,
    preco: 190,
  },
  {
    id: "artwork-15",
    titulo: "Brisa Azul",
    imageUrl:
      "/mock_arts/low_poly.png",
    artistId: "art-1",
    tags: ["#Sky", "#Soft", "#Pastel"],
    nsfw: false,
    preco: 175,
  },
  {
    id: "artwork-16",
    titulo: "Silencio Claro",
    imageUrl:
      "/mock_arts/oil_portrait.png",
    artistId: "art-1",
    tags: ["#Landscape", "#Calm", "#Light"],
    nsfw: false,
    preco: 210,
  },
  {
    id: "artwork-17",
    titulo: "Caminho Dourado",
    imageUrl:
      "/mock_arts/abstract_shapes.png",
    artistId: "art-1",
    tags: ["#Golden", "#Warm", "#Trail"],
    nsfw: false,
    preco: 165,
  },
  {
    id: "artwork-18",
    titulo: "Maresia Suave",
    imageUrl:
      "/mock_arts/comic_hero.png",
    artistId: "art-1",
    tags: ["#Sea", "#Blue", "#Soft"],
    nsfw: false,
    preco: 185,
  },
  {
    id: "artwork-19",
    titulo: "Brilho da Manha",
    imageUrl:
      "/mock_arts/render_3d.png",
    artistId: "art-1",
    tags: ["#Sunrise", "#Light", "#Dreamy"],
    nsfw: false,
    preco: 195,
  },
  {
    id: "artwork-20",
    titulo: "Jardim Silente",
    imageUrl:
      "/mock_arts/sketch_dragon.png",
    artistId: "art-1",
    tags: ["#Garden", "#Soft", "#Detail"],
    nsfw: false,
    preco: 205,
  },
  // --- Additional Mocks for Volume ---
  {
    id: "artwork-21",
    titulo: "Floresta Encantada",
    imageUrl: "/mock_arts/fantasy_landscape.png",
    artistId: "art-1",
    tags: ["#Fantasy", "#Nature", "#Magic"],
    nsfw: false,
    preco: 180,
  },
  {
    id: "artwork-22",
    titulo: "Guerreiro Cibernético",
    imageUrl: "/mock_arts/cyberpunk_char.png",
    artistId: "art-1",
    tags: ["#SciFi", "#Cyber", "#Character"],
    nsfw: false,
    preco: 250,
  },
  {
    id: "artwork-23",
    titulo: "Retrato Realista",
    imageUrl: "/mock_arts/oil_portrait.png",
    artistId: "art-1",
    tags: ["#Portrait", "#Realism", "#Oil"],
    nsfw: false,
    preco: 300,
  },
  {
    id: "artwork-24",
    titulo: "Cidade 8-bit",
    imageUrl: "/mock_arts/pixel_city.png",
    artistId: "art-2",
    tags: ["#PixelArt", "#Retro", "#City"],
    nsfw: false,
    preco: 80,
  },
  {
    id: "artwork-25",
    titulo: "Vale Perdido",
    imageUrl: "/mock_arts/low_poly.png",
    artistId: "art-1",
    tags: ["#Fantasy", "#Landscape", "#LowPoly"],
    nsfw: false,
    preco: 120,
  },
  {
    id: "artwork-26",
    titulo: "Princesa Guerreira",
    imageUrl: "/mock_arts/anime_neon.png",
    artistId: "art-1",
    tags: ["#Portrait", "#Anime", "#Character"],
    nsfw: false,
    preco: 160,
  },
  {
    id: "artwork-27",
    titulo: "Nave Espacial",
    imageUrl: "/mock_arts/render_3d.png",
    artistId: "art-2",
    tags: ["#SciFi", "#Space", "#3D"],
    nsfw: false,
    preco: 220,
  },
  {
    id: "artwork-28",
    titulo: "Masmorra Escura",
    imageUrl: "/mock_arts/sketch_dragon.png",
    artistId: "art-1",
    tags: ["#Fantasy", "#Sketch", "#Dark"],
    nsfw: true,
    preco: 90,
  },
  {
    id: "artwork-29",
    titulo: "Backup de Memória",
    imageUrl: "/mock_arts/abstract_shapes.png",
    artistId: "art-2",
    tags: ["#SciFi", "#Abstract", "#Data"],
    nsfw: false,
    preco: 150,
  },
  {
    id: "artwork-30",
    titulo: "Herói Clássico",
    imageUrl: "/mock_arts/comic_hero.png",
    artistId: "art-1",
    tags: ["#Portrait", "#Comic", "#Character"],
    nsfw: false,
    preco: 110,
  },
]

export const priceSheets: PriceSheet[] = [
  {
    id: "ps-1",
    titulo: "Headshot Anime",
    preco: 50,
    descricao:
      "## Headshot Anime Premium\nFeito para **avatar**, redes sociais e comissoes rapidas, com foco em expressividade e acabamento limpo.\n\n### O que voce recebe\n- **Pintura completa** com luz suave\n- Ajustes finos de cor, olhos, cabelo e acessorios\n- Arquivo final em **alta resolucao** + versao para redes\n\n### Como funciona\n- Envie referencias ou moodboard\n- Aprovacao do esboco e lineart\n- Entrega final em **ate 7 dias**\n\n### Observacoes\n- Fundo simples incluso\n- Uso comercial sob consulta",
    imageUrl:
      "/mock_arts/cyberpunk_char.png",
  },
  {
    id: "ps-single-vertical",
    titulo: "Vertical 9x16",
    preco: 160,
    descricao: "Arte vertical com foco em enquadramento e luz suave.",
    imageUrl: "/mock_arts/test_tall_9_16.png",
  },
  {
    id: "ps-2",
    titulo: "Meio Corpo",
    preco: 120,
    descricao: "Ilustração detalhada até o torso com luz cinematográfica.",
    imageUrl:
      "/mock_arts/fantasy_landscape.png",
  },
  {
    id: "ps-3",
    titulo: "Cena Completa",
    preco: 250,
    descricao: "Personagem em ambiente completo com props e atmosfera.",
    imageUrl:
      "/mock_arts/charcoal_tree.png",
  },
  {
    id: "ps-4",
    titulo: "Chibi Express",
    preco: 40,
    descricao: "Chibi rapido com foco em carisma e paleta pastel.",
    imageUrl:
      "/mock_arts/anime_neon.png",
  },
  {
    id: "ps-5",
    titulo: "Emote Pack (3)",
    preco: 70,
    descricao: "Tres emotes prontos para stream com variações de humor.",
    imageUrl:
      "/mock_arts/sketch_dragon.png",
  },
  {
    id: "ps-6",
    titulo: "Ilustracao Vertical",
    preco: 180,
    descricao: "Arte vertical para story/poster com foco em luz suave.",
    imageUrl:
      "/mock_arts/low_poly.png",
  },
]

export const commissionStatuses: CommissionStatus[] = [
  {
    id: "pagamento",
    titulo: "Pagamento Realizado",
    descricao: "Valor bloqueado em segurança.",
  },
  {
    id: "producao",
    titulo: "Em Produção",
    descricao: "Artista trabalhando na entrega.",
  },
  {
    id: "entrega",
    titulo: "Entrega Final",
    descricao: "Arquivo aguardando liberação.",
  },
  {
    id: "aprovacao",
    titulo: "Aprovação",
    descricao: "Pagamento liberado ao artista.",
  },
]

export const moderationReports: ModerationReport[] = [
  {
    id: "rep-1",
    conteudo: "Luar Secreto",
    motivo: "Conteúdo sensível sem aviso",
    autor: "Luna Azevedo",
    status: "novo",
  },
  {
    id: "rep-2",
    conteudo: "Club 97",
    motivo: "Tag incorreta",
    autor: "Renato Kaori",
    status: "novo",
  },
  {
    id: "rep-3",
    conteudo: "Catedral Astral",
    motivo: "Possível plágio",
    autor: "Renato Kaori",
    status: "revisado",
  },
]

export const notifications: NotificationItem[] = [
  // Hoje
  {
    id: "not-1",
    titulo: "Nova proposta recebida",
    descricao: "Marina Souza enviou detalhes para uma comissão.",
    data: new Date().toISOString(), // Hoje
    lida: false,
    tipo: "pedido",
  },
  {
    id: "not-2",
    titulo: "Pagamento confirmado",
    descricao: "Seu pedido #2345 teve o pagamento validado.",
    data: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
    lida: false,
    tipo: "sistema",
  },
  {
    id: "not-3",
    titulo: "Novo seguidor",
    descricao: "Pedro Silva começou a te seguir.",
    data: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 horas atrás
    lida: true,
    tipo: "social",
  },
  // Ontem
  {
    id: "not-4",
    titulo: "Atualização de status",
    descricao: "O artista iniciou o rascunho do seu pedido.",
    data: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // Ontem
    lida: true,
    tipo: "pedido",
  },
  {
    id: "not-5",
    titulo: "Comentário na sua arte",
    descricao: "Ana Clara comentou: 'Ficou incrível!'",
    data: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // Ontem
    lida: true,
    tipo: "social",
  },
  // Essa Semana (3 dias atrás)
  {
    id: "not-6",
    titulo: "Promoção de Outono",
    descricao: "Aproveite 20% de desconto em comissões selecionadas.",
    data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 dias atrás
    lida: true,
    tipo: "sistema",
  },
  // Semana Passada (8 dias atrás)
  {
    id: "not-7",
    titulo: "Pedido Concluído",
    descricao: "Sua arte #9981 está pronta para download.",
    data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 dias atrás
    lida: true,
    tipo: "pedido",
  },
  // Mês Passado (35 dias atrás)
  {
    id: "not-8",
    titulo: "Bem-vindo!",
    descricao: "Obrigado por se juntar à nossa plataforma.",
    data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(), // 35 dias atrás
    lida: true,
    tipo: "sistema",
  },
]

export const categoryFilters = [
  { key: "categorias", label: "Categorias", icon: "category" },
  { key: "ilustracao", label: "Ilustracao", icon: "brush", tags: ["#Ilustração"] },
  { key: "anime", label: "Anime", icon: "face", tags: ["#Anime"] },
  { key: "pixel", label: "Pixel Art", icon: "grid_on", tags: ["#PixelArt"] },
  { key: "realismo", label: "Realismo", icon: "visibility", tags: ["#Detail"] },
  { key: "retratos", label: "Retratos", icon: "person", tags: ["#Retrato", "#Portrait"] },
  { key: "fantasia", label: "Fantasia", icon: "auto_stories", tags: ["#Fantasy"] },
  { key: "sci-fi", label: "Sci-Fi", icon: "rocket_launch", tags: ["#SciFi", "#Cyber"] },
  { key: "concept", label: "Concept", icon: "lightbulb", tags: ["#Concept"] },
  { key: "paisagem", label: "Paisagem", icon: "landscape", tags: ["#Landscape", "#Panorama"] },
  { key: "sketch", label: "Sketch", icon: "draw", tags: ["#Sketch"] },
  { key: "chibi", label: "Chibi", icon: "child_friendly", tags: ["#Chibi"] },
  { key: "retrato-empresarial", label: "Retrato Pro", icon: "badge", tags: ["#Portrait"] },
  { key: "mascotes", label: "Mascotes", icon: "pets", tags: ["#Concept"] },
  { key: "cenas", label: "Cenas", icon: "panorama", tags: ["#Panorama"] },
  { key: "emotes", label: "Emotes", icon: "emoji_emotions", tags: ["#Chibi"] },
  { key: "lineart", label: "Lineart", icon: "border_color", tags: ["#Sketch"] },
  { key: "ref-sheet", label: "Ref Sheet", icon: "collections_bookmark", tags: ["#Detail"] },
  { key: "backgrounds", label: "Backgrounds", icon: "filter_hdr", tags: ["#Landscape"] },
  { key: "sticker-pack", label: "Stickers", icon: "local_offer", tags: ["#PixelArt"] },
  { key: "vtuber", label: "VTuber", icon: "face_retouching_natural", tags: ["#Anime"] },
  { key: "props", label: "Props", icon: "extension", tags: ["#Concept"] },
]

export const conversations: import("@/types").Conversation[] = [
  {
    id: "conv-1",
    userId: "art-1",
    lastMessage: "Acabei o rascunho, posso enviar agora.",
    time: "10:42",
    unread: 2,
    status: "online",
    label: "Comissao #2841",
  },
  {
    id: "conv-2",
    userId: "cli-1",
    lastMessage: "Preciso ajustar a paleta, consigo hoje.",
    time: "Ontem",
    unread: 0,
    status: "ocupado",
    label: "Briefing atualizado",
  },
  {
    id: "conv-3",
    userId: "art-2",
    lastMessage: "Enviei o arquivo final em alta.",
    time: "Seg",
    unread: 1,
    status: "offline",
    label: "Entrega final",
  },
  {
    id: "conv-4",
    userId: "art-1",
    lastMessage: "Consigo revisar o lineart hoje a noite.",
    time: "09:12",
    unread: 0,
    status: "online",
    label: "Ajuste de pose",
  },
  {
    id: "conv-5",
    userId: "cli-1",
    lastMessage: "Pode adicionar brilho extra nos olhos?",
    time: "Ontem",
    unread: 3,
    status: "ocupado",
    label: "Detalhes finais",
  },
  {
    id: "conv-6",
    userId: "art-2",
    lastMessage: "Vou te enviar a versao com fundo escuro.",
    time: "Qui",
    unread: 0,
    status: "offline",
    label: "Variacoes",
  },
  {
    id: "conv-7",
    userId: "art-1",
    lastMessage: "Tenho agenda livre para nova comissao.",
    time: "Ter",
    unread: 1,
    status: "online",
    label: "Novo pedido",
  },
  {
    id: "conv-8",
    userId: "cli-1",
    lastMessage: "Fechado, pode seguir com a entrega.",
    time: "Seg",
    unread: 0,
    status: "offline",
    label: "Aprovado",
  },
]

export const messages: import("@/types").Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    sender: "artista",
    content: "Oi! Tudo certo com o briefing que voce enviou?",
    time: "09:58",
    status: "lido",
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    sender: "cliente",
    content:
      "Sim! Quero manter o fundo mais claro e adicionar flores neon.",
    time: "10:05",
    status: "lido",
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    sender: "artista",
    content:
      "Perfeito. Vou enviar o rascunho ainda hoje para sua aprovacao.",
    time: "10:16",
    status: "lido",
  },
  {
    id: "msg-4",
    conversationId: "conv-1",
    sender: "artista",
    content: "Acabei o rascunho, posso enviar agora.",
    time: "10:42",
    status: "entregue",
  },
  {
    id: "msg-5",
    conversationId: "conv-1",
    sender: "cliente",
    content: "Pode sim! Estou online.",
    time: "10:44",
    status: "enviado",
  },
  {
    id: "msg-6",
    conversationId: "conv-1",
    sender: "artista",
    content: "Perfeito, estou enviando o arquivo em alta agora.",
    time: "10:45",
    status: "entregue",
  },
  {
    id: "msg-7",
    conversationId: "conv-1",
    sender: "cliente",
    content: "Recebi! Gostei muito do brilho, so queria a flor um pouco menor.",
    time: "10:47",
    status: "lido",
  },
  {
    id: "msg-8",
    conversationId: "conv-1",
    sender: "artista",
    content: "Beleza, ajusto a flor e te mando a versao final hoje.",
    time: "10:49",
    status: "lido",
  },
  {
    id: "msg-9",
    conversationId: "conv-1",
    sender: "cliente",
    content: "Fechado. Obrigado!",
    time: "10:50",
    status: "enviado",
  },
]
