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
    nome: "Nicolas Kalebe",
    role: "artista",
    avatarUrl:
      "/nicolas.jpg",
    bio: "Ilustradora digital focada em fantasia suave e personagens expressivos.",
    seguidores: 12840,
    destaque: "Especialista em retratos anime.",
  },
  {
    id: "art-2",
    nome: "Renato Kaori",
    role: "artista",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=320&auto=format&fit=crop",
    bio: "Diretor de arte com foco em sci-fi e composições cinematográficas.",
    seguidores: 9420,
  },
  {
    id: "cli-1",
    nome: "Marina Souza",
    role: "cliente",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop",
    bio: "Colecionadora e apoiadora de artistas independentes.",
    seguidores: 120,
  },
]

export const arts: Art[] = [
  {
    id: "artwork-1",
    titulo: "Noite Neon",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Neon", "#Retrato", "#Anime"],
    nsfw: false,
    preco: 120,
  },
  {
    id: "artwork-2",
    titulo: "Guardião Floral",
    imageUrl:
      "https://images.unsplash.com/photo-1496318447583-f524534e9ce1?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Fantasy", "#Painterly", "#Detail"],
    nsfw: false,
    preco: 220,
  },
  {
    id: "artwork-3",
    titulo: "Pixel Drift",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=900&auto=format&fit=crop",
    artistId: "art-2",
    tags: ["#PixelArt", "#Retro", "#Cidade"],
    nsfw: false,
    preco: 90,
  },
  {
    id: "artwork-4",
    titulo: "Luar Secreto",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Sensual", "#LuzSuave", "#Retrato"],
    nsfw: true,
    preco: 180,
  },
  {
    id: "artwork-5",
    titulo: "Catedral Astral",
    imageUrl:
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=900&auto=format&fit=crop",
    artistId: "art-2",
    tags: ["#SciFi", "#Matte", "#Arquitetura"],
    nsfw: false,
    preco: 300,
  },
  {
    id: "artwork-6",
    titulo: "Club 97",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=900&auto=format&fit=crop",
    artistId: "art-2",
    tags: ["#Cyber", "#Night", "#Mood"],
    nsfw: true,
    preco: 160,
  },
  {
    id: "artwork-7",
    titulo: "Viagem Dourada",
    imageUrl:
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Concept", "#Ilustração", "#Luz"],
    nsfw: false,
    preco: 140,
  },
  {
    id: "artwork-8",
    titulo: "Linha Calma",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Sketch", "#Mono", "#Minimal"],
    nsfw: false,
    preco: 70,
  },
  {
    id: "artwork-9",
    titulo: "Campo Vertical",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=700&h=1000&fit=crop&auto=format",
    artistId: "art-1",
    tags: ["#Landscape", "#Vertical", "#Soft"],
    nsfw: false,
    preco: 150,
  },
  {
    id: "artwork-10",
    titulo: "Luz Larga",
    imageUrl:
      "https://images.unsplash.com/photo-1496318447583-f524534e9ce1?q=80&w=1200&h=600&fit=crop&auto=format",
    artistId: "art-1",
    tags: ["#Wide", "#Glow", "#Atmosphere"],
    nsfw: false,
    preco: 200,
  },
  {
    id: "artwork-11",
    titulo: "Retrato Alto",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=700&h=1100&fit=crop&auto=format",
    artistId: "art-1",
    tags: ["#Portrait", "#Moody", "#Detail"],
    nsfw: false,
    preco: 180,
  },
  {
    id: "artwork-12",
    titulo: "Panorama Frio",
    imageUrl:
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=1400&h=700&fit=crop&auto=format",
    artistId: "art-1",
    tags: ["#Panorama", "#Blue", "#Calm"],
    nsfw: false,
    preco: 220,
  },
  {
    id: "artwork-13",
    titulo: "Aurora Serena",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Soft", "#Nature", "#Glow"],
    nsfw: false,
    preco: 160,
  },
  {
    id: "artwork-14",
    titulo: "Rosas de Nevoa",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&h=700&fit=crop&auto=format",
    artistId: "art-1",
    tags: ["#Mood", "#Light", "#Portrait"],
    nsfw: false,
    preco: 190,
  },
  {
    id: "artwork-15",
    titulo: "Brisa Azul",
    imageUrl:
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Sky", "#Soft", "#Pastel"],
    nsfw: false,
    preco: 175,
  },
  {
    id: "artwork-16",
    titulo: "Silencio Claro",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Landscape", "#Calm", "#Light"],
    nsfw: false,
    preco: 210,
  },
  {
    id: "artwork-17",
    titulo: "Caminho Dourado",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Golden", "#Warm", "#Trail"],
    nsfw: false,
    preco: 165,
  },
  {
    id: "artwork-18",
    titulo: "Maresia Suave",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Sea", "#Blue", "#Soft"],
    nsfw: false,
    preco: 185,
  },
  {
    id: "artwork-19",
    titulo: "Brilho da Manha",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Sunrise", "#Light", "#Dreamy"],
    nsfw: false,
    preco: 195,
  },
  {
    id: "artwork-20",
    titulo: "Jardim Silente",
    imageUrl:
      "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?q=80&w=900&auto=format&fit=crop",
    artistId: "art-1",
    tags: ["#Garden", "#Soft", "#Detail"],
    nsfw: false,
    preco: 205,
  },
]

export const priceSheets: PriceSheet[] = [
  {
    id: "ps-1",
    titulo: "Headshot Anime",
    preco: 50,
    descricao: "Arte colorida apenas do rosto, com fundo simples.",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ps-2",
    titulo: "Meio Corpo",
    preco: 120,
    descricao: "Ilustração detalhada até o torso com luz cinematográfica.",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ps-3",
    titulo: "Cena Completa",
    preco: 250,
    descricao: "Personagem em ambiente completo com props e atmosfera.",
    imageUrl:
      "https://images.unsplash.com/photo-1496318447583-f524534e9ce1?q=80&w=800&auto=format&fit=crop",
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
  {
    id: "not-1",
    titulo: "Nova proposta recebida",
    descricao: "Marina Souza enviou detalhes para uma comissão.",
    horario: "Agora",
  },
  {
    id: "not-2",
    titulo: "Pagamento confirmado",
    descricao: "Seu pedido #2345 teve o pagamento validado.",
    horario: "Há 2h",
  },
  {
    id: "not-3",
    titulo: "Atualização do artista",
    descricao: "Luna Azevedo enviou rascunho para revisão.",
    horario: "Há 1d",
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
