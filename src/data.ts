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
    nome: "Luna Azevedo",
    role: "artista",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=300&auto=format&fit=crop",
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
]

export const priceSheets: PriceSheet[] = [
  {
    id: "ps-1",
    titulo: "Headshot Anime",
    preco: 50,
    descricao: "Arte colorida apenas do rosto, com fundo simples.",
  },
  {
    id: "ps-2",
    titulo: "Meio Corpo",
    preco: 120,
    descricao: "Ilustração detalhada até o torso com luz cinematográfica.",
  },
  {
    id: "ps-3",
    titulo: "Cena Completa",
    preco: 250,
    descricao: "Personagem em ambiente completo com props e atmosfera.",
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
