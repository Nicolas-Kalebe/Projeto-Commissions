import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { arts, priceSheets, users } from "@/data"
import { PriceSheetRow } from "@/components/profile/PriceSheetRow"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { User } from "@/types"
import { API_ROUTES } from "@/constants/apiRoutes"
import { useToast } from "@/hooks/use-toast"
import {
  Bookmark,
  Heart,
  Instagram,
  Link,
  MessageCircle,
  Pencil,
  Star,
  Twitch,
  Twitter,
  UserPlus,
  Youtube,
} from "lucide-react"

type PortfolioPost = {
  id: string
  titulo: string
  descricao: string
  tags: string[]
  images: string[]
  popularidade: number
  likes: number
  saves: number
  createdAt?: string
  backendId?: number
  commissionLink?: string
}

type BackendArtistProfile = {
  avaliacao?: number
  estilo?: string
  tipoArtista?: string
  portifolioUrl?: string
  ativoParaServicos?: boolean
  usuarioNomePerfil?: string
  usuarioNome?: string
  usuarioFotoPerfil?: string
  usuarioSeguidores?: number
  portfolioItens?: BackendPortfolioItem[]
}

type BackendPortfolioItem = {
  id?: number
  artistaId?: number
  titulo?: string
  descricao?: string
  urlArquivo?: string
  ordem?: number
  likeCount?: number
  favoritoCount?: number
  visualizacaoCount?: number
  dataCriacao?: string
}

type SocialLinkKey =
  | "twitter"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitch"
  | "artstation"

type ProfileOverrides = {
  displayName?: string
  bio?: string
  avatarUrl?: string
  coverUrl?: string
  pronounsBadge?: string
  roleBadge?: string
  deliveryBadge?: string
  styleDescription?: string
  styleTags?: string[]
  socialLinks?: Partial<Record<SocialLinkKey, string>>
}

type ProfileDraft = {
  displayName: string
  bio: string
  avatarUrl: string
  coverUrl: string
  pronounsBadge: string
  roleBadge: string
  deliveryBadge: string
  styleDescription: string
  styleTags: string
  socialLinks: Record<SocialLinkKey, string>
}

const readField = <T,>(source: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null) return value as T
  }
  return undefined
}

const splitCommaList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const parsePortfolioItems = (value: unknown): BackendPortfolioItem[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return []
    const record = entry as Record<string, unknown>
    return [
      {
        id: readField<number>(record, "id", "Id"),
        artistaId: readField<number>(record, "artistaId", "ArtistaId"),
        titulo: readField<string>(record, "titulo", "Titulo"),
        descricao: readField<string>(record, "descricao", "Descricao"),
        urlArquivo: readField<string>(record, "urlArquivo", "UrlArquivo"),
        ordem: readField<number>(record, "ordem", "Ordem"),
        likeCount: readField<number>(record, "likeCount", "LikeCount"),
        favoritoCount: readField<number>(record, "favoritoCount", "FavoritoCount"),
        visualizacaoCount: readField<number>(record, "visualizacaoCount", "VisualizacaoCount"),
        dataCriacao: readField<string>(record, "dataCriacao", "DataCriacao"),
      },
    ]
  })
}

type PortfolioPreviewCardProps = {
  post: PortfolioPost
  onOpen: () => void
}

function PortfolioPreviewCard({ post, onOpen }: PortfolioPreviewCardProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselSnaps, setCarouselSnaps] = useState<number[]>([])
  const hasMultipleImages = post.images.length > 1

  useEffect(() => {
    if (!carouselApi || !hasMultipleImages) return
    setCarouselSnaps(carouselApi.scrollSnapList())
    setCarouselIndex(carouselApi.selectedScrollSnap())
    const onSelect = () => setCarouselIndex(carouselApi.selectedScrollSnap())
    carouselApi.on("select", onSelect)
    carouselApi.on("reInit", onSelect)
    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi, hasMultipleImages])

  return (
    <button
      type="button"
      className="relative cursor-pointer overflow-hidden rounded-xl border bg-card"
      onClick={onOpen}
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <div className="relative h-full w-full">
          {hasMultipleImages ? (
            <Carousel
              opts={{ loop: true }}
              setApi={setCarouselApi}
              className="h-full w-full overflow-hidden"
            >
              <CarouselContent viewportClassName="h-full" className="h-full !-ml-0">
                {post.images.map((image, index) => (
                  <CarouselItem key={`${post.id}-${index}`} className="h-full !pl-0">
                    <img
                      src={image}
                      alt={`${post.titulo} ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/70 border-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/60 dark:text-white dark:hover:bg-black/70"
                onClick={(event) => {
                  event.stopPropagation()
                  carouselApi?.scrollPrev()
                }}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label="Imagem anterior"
              />
              <CarouselNext
                className="right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/70 border-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/60 dark:text-white dark:hover:bg-black/70"
                onClick={(event) => {
                  event.stopPropagation()
                  carouselApi?.scrollNext()
                }}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label="Proxima imagem"
              />
              <div className="pointer-events-auto absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
                {carouselSnaps.map((_, index) => (
                  <button
                    key={`${post.id}-dot-${index}`}
                    type="button"
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      index === carouselIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    onClick={(event) => {
                      event.stopPropagation()
                      carouselApi?.scrollTo(index)
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                    aria-label={`Ir para imagem ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          ) : (
            <img
              src={post.images[0]}
              alt={post.titulo}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
          <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
            <span className="p-3 text-sm font-semibold text-white">
              {post.titulo}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

interface ArtistProfileProps {
  onRequestCommission: (price: number) => void
  currentUser?: User
  isMockUser?: boolean
  onCurrentUserUpdate?: (partial: Partial<User>) => void
}

type OwnerPriceSheetRowProps = {
  sheet: {
    id: string
    titulo: string
    preco: number
    descricao: string
    imageUrl?: string
  }
  images: string[]
}

function OwnerPriceSheetRow({ sheet, images }: OwnerPriceSheetRowProps) {
  const image = images[0] ?? sheet.imageUrl
  return (
    <Card className="border-border/60 bg-card/95 shadow-sm">
      <CardContent className="flex flex-col gap-6 p-5 xl:flex-row xl:items-stretch">
        <div className="flex flex-1 flex-col gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Comissao
            </p>
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-2xl font-semibold">{sheet.titulo}</h3>
              <span className="text-lg font-semibold text-muted-foreground">
                {sheet.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{sheet.descricao}</p>

          <div className="mt-auto">
            <Button variant="secondary">Editar comissao</Button>
          </div>
        </div>

        <div className="space-y-3 xl:w-[520px] xl:shrink-0">
          <div className="overflow-hidden rounded-xl">
            <div className="aspect-[16/9] h-[220px] w-full">
              {image ? (
                <img
                  src={image}
                  alt={sheet.titulo}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ArtistProfile({
  onRequestCommission,
  currentUser,
  isMockUser = false,
  onCurrentUserUpdate,
}: ArtistProfileProps) {
  const [postDialogOpen, setPostDialogOpen] = useState(false)
  const [activePostIndex, setActivePostIndex] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [portfolioSort, setPortfolioSort] = useState<"recentes" | "populares">(
    "recentes"
  )
  const [showServices, setShowServices] = useState(true)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [backendProfile, setBackendProfile] = useState<BackendArtistProfile | null>(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [profileOverrides, setProfileOverrides] = useState<ProfileOverrides | null>(null)
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null)
  const [draftAvatarPreview, setDraftAvatarPreview] = useState("")
  const [draftCoverPreview, setDraftCoverPreview] = useState("")
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false)
  const [portfolioTitle, setPortfolioTitle] = useState("")
  const [portfolioDescription, setPortfolioDescription] = useState("")
  const [portfolioImage, setPortfolioImage] = useState<File | null>(null)
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({})
  const [postMetrics, setPostMetrics] = useState<Record<string, { likes: number; saves: number }>>({})
  const [pulseLikeId, setPulseLikeId] = useState<string | null>(null)
  const [pulseSaveId, setPulseSaveId] = useState<string | null>(null)
  const { toast } = useToast()
  const fallbackArtist = users.find((user) => user.id === "art-1")
  const artist = !isMockUser && currentUser ? currentUser : fallbackArtist
  const isOwnerProfile = Boolean(!isMockUser && currentUser?.id && artist?.id && currentUser.id === artist.id)
  const isRealUser = Boolean(!isMockUser && currentUser)
  const canEditProfile = isOwnerProfile || isMockUser || isRealUser

  useEffect(() => {
    if (!isRealUser) {
      setBackendProfile(null)
      return
    }
    const tokenGoogle = localStorage.getItem("google_token")?.trim() ?? ""
    if (!tokenGoogle) {
      setBackendProfile(null)
      return
    }

    let isActive = true
    const loadProfile = async () => {
      try {
        const response = await fetch(API_ROUTES.Usuario.obterPerfilArtista, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleToken: tokenGoogle }),
        })
        if (!response.ok) return

        const body = await response.json().catch(() => null)
        const resultado = body?.resultado ?? body?.Resultado
        if (!resultado || typeof resultado !== "object") return

        const resultadoObj = resultado as Record<string, unknown>
        const usuarioObj =
          (readField<Record<string, unknown>>(resultadoObj, "usuario", "Usuario") ?? {}) as Record<
            string,
            unknown
          >

        const avaliacao = readField<number>(resultadoObj, "avaliacao", "Avaliacao")
        const estilo = readField<string>(resultadoObj, "estilo", "Estilo")
        const tipoArtista = readField<string>(resultadoObj, "tipoArtista", "TipoArtista")
        const portifolioUrl = readField<string>(
          resultadoObj,
          "portifolioUrl",
          "PortifolioUrl",
          "portfolioUrl",
          "PortfolioUrl"
        )
        const ativoParaServicos = readField<boolean>(resultadoObj, "ativoParaServicos", "AtivoParaServicos")
        const portfolioItens = parsePortfolioItems(
          readField<unknown>(resultadoObj, "portfolioItens", "PortfolioItens")
        )
        const usuarioNomePerfil = readField<string>(usuarioObj, "nomePerfil", "NomePerfil")
        const usuarioNome = readField<string>(usuarioObj, "nome", "Nome")
        const usuarioFotoPerfil = readField<string>(usuarioObj, "fotoPerfil", "FotoPerfil")
        const usuarioSeguidores = readField<number>(usuarioObj, "seguidores", "Seguidores")

        if (!isActive) return
        setBackendProfile({
          avaliacao,
          estilo,
          tipoArtista,
          portifolioUrl,
          ativoParaServicos,
          portfolioItens,
          usuarioNomePerfil,
          usuarioNome,
          usuarioFotoPerfil,
          usuarioSeguidores,
        })
      } catch {
        // Silent fallback to existing profile data
      }
    }

    loadProfile()
    return () => {
      isActive = false
    }
  }, [isRealUser, currentUser?.id])

  const gallery = isMockUser
    ? arts.filter((art) => art.artistId === "art-1")
    : []
  const extendedGallery = [
    ...gallery,
    ...gallery.map((art, index) => ({
      ...art,
      id: `${art.id}-extra-a-${index}`,
      titulo: `${art.titulo} (Estudo)`,
    })),
    ...gallery.map((art, index) => ({
      ...art,
      id: `${art.id}-extra-b-${index}`,
      titulo: `${art.titulo} (Variacao)`,
    })),
  ]
  const portfolioPosts = extendedGallery.reduce<PortfolioPost[]>((acc, _, index) => {
    const chunkSize = 3
    if (index % chunkSize !== 0) {
      return acc
    }
    const chunk = extendedGallery.slice(index, index + chunkSize)
    const images = chunk.map((item) => item.imageUrl).filter(Boolean)
    if (images.length === 0) {
      return acc
    }
    const tags = Array.from(
      new Set(chunk.flatMap((item) => item.tags ?? []))
    ).slice(0, 6)
    const titulo = chunk[0]?.titulo ?? "Novo post"
    const descricao = `Serie com ${images.length} variacoes explorando ${tags
      .slice(0, 3)
      .join(" ")}.`
    const popularidade = chunk.reduce((sum, item) => sum + item.preco, 0)
    const likes = Math.max(12, Math.round(popularidade * 3))
    const saves = Math.max(4, Math.round(popularidade * 1.2))
    acc.push({
      id: `post-${index}`,
      titulo,
      descricao,
      tags,
      images,
      popularidade,
      likes,
      saves,
      createdAt: new Date().toISOString(),
      commissionLink: index % 3 === 0 ? "/comissoes" : undefined,
    })
    return acc
  }, [])
  const testSingleImagePost: PortfolioPost = {
    id: "post-test-single",
    titulo: "Anime Draw",
    descricao:
      "Ilustracao com foco em expressao, cores suaves e atmosfera delicada.",
    tags: ["#Anime", "#Ilustracao", "#Personagem"],
    images: ["/mock_arts/test_tall_9_16.png"],
    popularidade: 999,
    likes: 4280,
    saves: 860,
    createdAt: new Date().toISOString(),
    commissionLink: "/comissoes",
  }
  const testPortfolioPosts: PortfolioPost[] = [
    {
      id: "post-test-3-4",
      titulo: "Character Sketch",
      descricao:
        "Estudo rapido de personagem com linha limpa e foco em silhueta.",
      tags: ["#Sketch", "#Personagem", "#Lineart"],
      images: ["/mock_arts/test_3_4.png", "/mock_arts/test_tall_9_16.png"],
      popularidade: 780,
      likes: 1670,
      saves: 310,
      createdAt: new Date().toISOString(),
    },
    {
      id: "post-test-4-3",
      titulo: "Cenario Ilustrado",
      descricao:
        "Cenario com elementos em camadas e detalhes sutis no fundo.",
      tags: ["#Cenario", "#Background", "#Ilustracao"],
      images: ["/mock_arts/test_4_3.png"],
      popularidade: 720,
      likes: 1420,
      saves: 280,
      createdAt: new Date().toISOString(),
    },
    {
      id: "post-test-16-9",
      titulo: "Paisagem Concept",
      descricao:
        "Paisagem com luz natural e clima de aventura.",
      tags: ["#Paisagem", "#Concept", "#Fantasy"],
      images: ["/mock_arts/test_wide_16_9.png", "/mock_arts/fantasy_landscape.png"],
      popularidade: 690,
      likes: 1310,
      saves: 250,
      createdAt: new Date().toISOString(),
    },
    {
      id: "post-test-21-9",
      titulo: "Horizonte Fantasy",
      descricao:
        "Cena ampla com atmosfera leve e contraste suave.",
      tags: ["#Fantasy", "#Atmosfera", "#Arte"],
      images: ["/mock_arts/test_ultrawide_21_9.png"],
      popularidade: 640,
      likes: 1180,
      saves: 220,
      createdAt: new Date().toISOString(),
    },
    {
      id: "post-test-wallhaven",
      titulo: "Noite Urbana",
      descricao:
        "Ilustracao noturna com luzes marcantes e clima urbano.",
      tags: ["#Noite", "#Urbano", "#Luzes"],
      images: ["/mock_arts/wallhaven-mlzdrk.jpg"],
      popularidade: 820,
      likes: 1900,
      saves: 360,
      createdAt: new Date().toISOString(),
    },
    {
      id: "post-test-watercolor",
      titulo: "Aquarela Naturaleza",
      descricao:
        "Pintura delicada com cores suaves e sensacao de calma.",
      tags: ["#Aquarela", "#Natureza", "#Pintura"],
      images: ["/mock_arts/watercolor_meadow.png", "/mock_arts/abstract_shapes.png"],
      popularidade: 860,
      likes: 2100,
      saves: 420,
      createdAt: new Date().toISOString(),
    },
  ]
  const ratingValue = isMockUser
    ? 4.8
    : typeof backendProfile?.avaliacao === "number"
      ? backendProfile.avaliacao
      : 0
  if (!artist) {
    return null
  }

  const baseProfileBio = isMockUser
    ? artist.bio
    : artist.bio?.trim()
      ? artist.bio
      : "Bio ainda n?o informada."
  const baseStyleDescription = isMockUser
    ? "Tra?o leve com foco em express?es, paleta suave e detalhes delicados para personagens e cenas."
    : backendProfile?.estilo?.trim()
      ? backendProfile.estilo
      : "Estilo ainda n?o informado."
  const baseStyleTags = isMockUser
    ? ["Lineart suave", "Cores pasteis", "Chibi"]
    : (backendProfile?.tipoArtista
      ? backendProfile.tipoArtista
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
      : [])
  const baseCoverImageUrl =
    !isMockUser && typeof backendProfile?.portifolioUrl === "string" && backendProfile.portifolioUrl.trim()
      ? backendProfile.portifolioUrl
      : "/mock_arts/test_wide_16_9.png"
  const baseDisplayName =
    !isMockUser && typeof backendProfile?.usuarioNomePerfil === "string" && backendProfile.usuarioNomePerfil.trim()
      ? backendProfile.usuarioNomePerfil
      : artist.nome

  const resolvedDisplayName = profileOverrides?.displayName ?? baseDisplayName
  const resolvedBio = profileOverrides?.bio ?? baseProfileBio
  const resolvedStyleDescription = profileOverrides?.styleDescription ?? baseStyleDescription
  const resolvedStyleTags =
    profileOverrides?.styleTags && profileOverrides.styleTags.length > 0
      ? profileOverrides.styleTags
      : baseStyleTags
  const resolvedCoverImageUrl = profileOverrides?.coverUrl ?? baseCoverImageUrl
  const resolvedAvatarUrl =
    profileOverrides?.avatarUrl ?? (artist.avatarUrl || backendProfile?.usuarioFotoPerfil || "")

  const baseBadges = {
    pronounsBadge: "Ela/dela",
    roleBadge: "Ilustradora",
    deliveryBadge: "Entrega em 7 dias",
  }
  const resolvedBadges = {
    pronounsBadge: profileOverrides?.pronounsBadge ?? baseBadges.pronounsBadge,
    roleBadge: profileOverrides?.roleBadge ?? baseBadges.roleBadge,
    deliveryBadge: profileOverrides?.deliveryBadge ?? baseBadges.deliveryBadge,
  }
  const badgeList = [
    resolvedBadges.pronounsBadge,
    resolvedBadges.roleBadge,
    resolvedBadges.deliveryBadge,
  ].filter(Boolean)

  const baseSocialLinks: Record<SocialLinkKey, string> = {
    twitter: "https://twitter.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
    youtube: "https://www.youtube.com/",
    twitch: "https://www.twitch.tv/",
    artstation: "https://www.artstation.com/",
  }
  const resolvedSocialLinks: Record<SocialLinkKey, string> = {
    ...baseSocialLinks,
    ...(profileOverrides?.socialLinks ?? {}),
  }
  const handleSource = resolvedDisplayName
    !isMockUser && typeof backendProfile?.usuarioNomePerfil === "string" && backendProfile.usuarioNomePerfil.trim()
      ? backendProfile.usuarioNomePerfil
      : artist.nome

  const initials = resolvedDisplayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
  const handle = `@${handleSource
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")}`
  const followersValue = isMockUser
    ? artist.seguidores
    : typeof backendProfile?.usuarioSeguidores === "number"
      ? backendProfile.usuarioSeguidores
      : undefined

  const socialLinks = [
    {
      name: "Twitter",
      href: resolvedSocialLinks.twitter,
      icon: Twitter,
    },
    {
      name: "Instagram",
      href: resolvedSocialLinks.instagram,
      icon: Instagram,
    },
    {
      name: "TikTok",
      href: resolvedSocialLinks.tiktok,
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
          <path d="M15.5 3.5c.6 1.6 1.9 2.8 3.5 3.2v3.1c-1.5 0-2.9-.5-4-1.3v5.2a4.9 4.9 0 1 1-4.9-4.9c.4 0 .8 0 1.2.1v3.2a1.8 1.8 0 1 0 1.5 1.8V3.5h2.7z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: resolvedSocialLinks.youtube,
      icon: Youtube,
    },
    {
      name: "Twitch",
      href: resolvedSocialLinks.twitch,
      icon: Twitch,
    },
    {
      name: "ArtStation",
      href: resolvedSocialLinks.artstation,
      icon: Link,
    },
  ]
    .filter((link) => Boolean(link.href))

  useEffect(() => {
    if (!isEditProfileOpen) return
    setProfileDraft({
      displayName: resolvedDisplayName,
      bio: resolvedBio,
      avatarUrl: resolvedAvatarUrl,
      coverUrl: resolvedCoverImageUrl,
      pronounsBadge: resolvedBadges.pronounsBadge,
      roleBadge: resolvedBadges.roleBadge,
      deliveryBadge: resolvedBadges.deliveryBadge,
      styleDescription: resolvedStyleDescription,
      styleTags: resolvedStyleTags.join(", "),
      socialLinks: { ...resolvedSocialLinks },
    })
  }, [isEditProfileOpen])

  useEffect(() => {
    if (isEditProfileOpen) return
    if (draftAvatarPreview && profileOverrides?.avatarUrl !== draftAvatarPreview) {
      URL.revokeObjectURL(draftAvatarPreview)
      setDraftAvatarPreview("")
    }
    if (draftCoverPreview && profileOverrides?.coverUrl !== draftCoverPreview) {
      URL.revokeObjectURL(draftCoverPreview)
      setDraftCoverPreview("")
    }
  }, [
    isEditProfileOpen,
    draftAvatarPreview,
    draftCoverPreview,
    profileOverrides?.avatarUrl,
    profileOverrides?.coverUrl,
  ])

  useEffect(() => {
    if (!isAddPortfolioOpen) {
      resetPortfolioDialog()
    }
  }, [isAddPortfolioOpen])

  const updateDraft = (partial: Partial<ProfileDraft>) => {
    setProfileDraft((prev) => (prev ? { ...prev, ...partial } : prev))
  }

  const updateDraftSocial = (key: SocialLinkKey, value: string) => {
    setProfileDraft((prev) =>
      prev ? { ...prev, socialLinks: { ...prev.socialLinks, [key]: value } } : prev
    )
  }

  const handleDraftAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setDraftAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return previewUrl
    })
    updateDraft({ avatarUrl: previewUrl })
  }

  const handleDraftCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setDraftCoverPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return previewUrl
    })
    updateDraft({ coverUrl: previewUrl })
  }

  const normalizeOptional = (value: string) => {
    const trimmed = value.trim()
    return trimmed ? trimmed : undefined
  }

  const handleProfileSave = () => {
    if (!profileDraft) return
    const socialEntries = Object.entries(profileDraft.socialLinks).flatMap(
      ([key, value]) => {
        const trimmed = value.trim()
        if (!trimmed) return []
        return [[key, trimmed]] as [SocialLinkKey, string][]
      }
    )
    const nextOverrides: ProfileOverrides = {
      displayName: normalizeOptional(profileDraft.displayName),
      bio: normalizeOptional(profileDraft.bio),
      avatarUrl: normalizeOptional(profileDraft.avatarUrl),
      coverUrl: normalizeOptional(profileDraft.coverUrl),
      pronounsBadge: normalizeOptional(profileDraft.pronounsBadge),
      roleBadge: normalizeOptional(profileDraft.roleBadge),
      deliveryBadge: normalizeOptional(profileDraft.deliveryBadge),
      styleDescription: normalizeOptional(profileDraft.styleDescription),
      styleTags: splitCommaList(profileDraft.styleTags),
      socialLinks: socialEntries.length > 0 ? Object.fromEntries(socialEntries) : undefined,
    }
    if (nextOverrides.styleTags && nextOverrides.styleTags.length === 0) {
      delete nextOverrides.styleTags
    }
    setProfileOverrides(nextOverrides)
    setIsEditProfileOpen(false)
    toast({
      title: "Perfil atualizado",
      description: "As alteracoes ja aparecem no seu perfil.",
    })
    if (onCurrentUserUpdate) {
      onCurrentUserUpdate({
        nome: nextOverrides.displayName ?? resolvedDisplayName,
        avatarUrl: nextOverrides.avatarUrl ?? resolvedAvatarUrl,
        bio: nextOverrides.bio ?? resolvedBio,
      })
    }
  }

  const backendPosts: PortfolioPost[] = (backendProfile?.portfolioItens ?? [])
    .filter((item) => typeof item.urlArquivo === "string" && item.urlArquivo.trim())
    .map((item, index) => {
      const titulo = item.titulo?.trim() ? item.titulo : "Post do portfólio"
      const descricao = item.descricao?.trim() ? item.descricao : ""
      const images = [item.urlArquivo?.trim() ?? ""].filter(Boolean)
      const popularidade = item.visualizacaoCount ?? item.likeCount ?? 0
      return {
        id: item.id ? `portfolio-${item.id}` : `portfolio-${index}`,
        titulo,
        descricao,
        tags: [],
        images,
        popularidade,
        likes: item.likeCount ?? 0,
        saves: item.favoritoCount ?? 0,
        createdAt: item.dataCriacao ?? undefined,
        backendId: item.id,
      }
    })

  const activePriceSheets = isMockUser ? priceSheets : []
  const visiblePosts = isMockUser
    ? [testSingleImagePost, ...testPortfolioPosts, ...portfolioPosts]
    : backendPosts
  const sortedPosts = [...visiblePosts].sort((a, b) => {
    if (portfolioSort === "populares") {
      return b.popularidade - a.popularidade
    }

    return 0
  })
  const activePost = sortedPosts[activePostIndex]
  const isSingleImagePost = (activePost?.images?.length ?? 0) <= 1
  const portfolioTitleLimit = 50
  const descriptionLimit = 300
  const descriptionText = activePost?.descricao ?? ""
  const clampedDescription =
    descriptionText.length > descriptionLimit
      ? `${descriptionText.slice(0, descriptionLimit).trim()}...`
      : descriptionText
  const remainingPortfolioChars = descriptionLimit - portfolioDescription.length
  const remainingPortfolioTitleChars = portfolioTitleLimit - portfolioTitle.length
  const formatPostDate = (value?: string) => {
    if (!value) return ""
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return date.toLocaleDateString("pt-BR")
  }

  const resolveMetrics = (post?: PortfolioPost | null) => {
    if (!post) return { likes: 0, saves: 0 }
    const override = postMetrics[post.id]
    return {
      likes: override?.likes ?? post.likes,
      saves: override?.saves ?? post.saves,
    }
  }

  useEffect(() => {
    if (sortedPosts.length === 0) return
    if (activePostIndex >= sortedPosts.length) {
      setActivePostIndex(0)
      setActiveImageIndex(0)
    }
  }, [activePostIndex, sortedPosts.length])
  const serviceGalleries = activePriceSheets.map((sheet, index) => {
    if (sheet.id === "ps-1") {
      return [
        "/mock_arts/test_wide_16_9.png",
        "/mock_arts/test_ultrawide_21_9.png",
        "/mock_arts/test_4_3.png",
        "/mock_arts/test_3_4.png",
        "/mock_arts/test_tall_9_16.png",
      ]
    }
    if (sheet.id === "ps-single-vertical") {
      return ["/mock_arts/test_tall_9_16.png"]
    }
    const startIndex = gallery.length > 0 ? (index * 3) % gallery.length : 0
    const images = gallery
      .slice(startIndex, startIndex + 3)
      .map((art) => art.imageUrl)
      .filter(Boolean)

    if (images.length === 0 && sheet.imageUrl) {
      images.push(sheet.imageUrl)
    }

    return images
  })

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || isMockUser) return

    const tokenGoogle = localStorage.getItem("google_token")?.trim() ?? ""
    if (!tokenGoogle) {
      toast({
        title: "Sessao expirada",
        description: "Faça login novamente para atualizar a foto.",
        variant: "destructive",
      })
      return
    }

    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append("TokenGoogle", tokenGoogle)
      formData.append("FotoPerfil", file)

      const response = await fetch(API_ROUTES.Usuario.atualizarFotoUsuario, {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar a foto.")
      }

      const refresh = await fetch(API_ROUTES.Usuario.obterUsuarioPorToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleToken: tokenGoogle }),
      })

      if (refresh.ok) {
        const body = await refresh.json().catch(() => null)
        const resultado = body?.resultado ?? body?.Resultado
        const fotoPerfil = (resultado as { fotoPerfil?: unknown; FotoPerfil?: unknown })?.fotoPerfil
          ?? (resultado as { FotoPerfil?: unknown })?.FotoPerfil
        if (typeof fotoPerfil === "string" && onCurrentUserUpdate) {
          onCurrentUserUpdate({ avatarUrl: fotoPerfil })
        }
      }

      toast({
        title: "Foto atualizada",
        description: "Sua nova foto de perfil ja aparece no sistema.",
      })
    } catch {
      toast({
        title: "Erro ao atualizar",
        description: "Nao foi possivel enviar a imagem agora.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const resetPortfolioDialog = () => {
    setPortfolioTitle("")
    setPortfolioDescription("")
    setPortfolioImage(null)
  }

  const handlePortfolioImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""
    setPortfolioImage(file)
  }

  const refreshBackendProfile = async (tokenGoogle: string) => {
    const response = await fetch(API_ROUTES.Usuario.obterPerfilArtista, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ googleToken: tokenGoogle }),
    })
    if (!response.ok) return
    const body = await response.json().catch(() => null)
    const resultado = body?.resultado ?? body?.Resultado
    if (!resultado || typeof resultado !== "object") return
    const resultadoObj = resultado as Record<string, unknown>
    const usuarioObj =
      (readField<Record<string, unknown>>(resultadoObj, "usuario", "Usuario") ?? {}) as Record<
        string,
        unknown
      >
    const avaliacao = readField<number>(resultadoObj, "avaliacao", "Avaliacao")
    const estilo = readField<string>(resultadoObj, "estilo", "Estilo")
    const tipoArtista = readField<string>(resultadoObj, "tipoArtista", "TipoArtista")
    const portifolioUrl = readField<string>(
      resultadoObj,
      "portifolioUrl",
      "PortifolioUrl",
      "portfolioUrl",
      "PortfolioUrl"
    )
    const ativoParaServicos = readField<boolean>(resultadoObj, "ativoParaServicos", "AtivoParaServicos")
    const portfolioItens = parsePortfolioItems(
      readField<unknown>(resultadoObj, "portfolioItens", "PortfolioItens")
    )
    const usuarioNomePerfil = readField<string>(usuarioObj, "nomePerfil", "NomePerfil")
    const usuarioNome = readField<string>(usuarioObj, "nome", "Nome")
    const usuarioFotoPerfil = readField<string>(usuarioObj, "fotoPerfil", "FotoPerfil")
    const usuarioSeguidores = readField<number>(usuarioObj, "seguidores", "Seguidores")
    setBackendProfile({
      avaliacao,
      estilo,
      tipoArtista,
      portifolioUrl,
      ativoParaServicos,
      portfolioItens,
      usuarioNomePerfil,
      usuarioNome,
      usuarioFotoPerfil,
      usuarioSeguidores,
    })
  }

  const handlePortfolioSubmit = async () => {
    if (!portfolioImage || isMockUser) return
    const tokenGoogle = localStorage.getItem("google_token")?.trim() ?? ""
    if (!tokenGoogle) {
      toast({
        title: "Sessao expirada",
        description: "Faca login novamente para atualizar o portifolio.",
        variant: "destructive",
      })
      return
    }

    setIsUploadingPortfolio(true)
    try {
      const formData = new FormData()
      formData.append("GoogleToken.GoogleToken", tokenGoogle)
      formData.append("Imagem", portfolioImage)
      if (portfolioTitle.trim()) {
        formData.append("Titulo", portfolioTitle.trim())
      }
      if (portfolioDescription.trim()) {
        formData.append("Descricao", portfolioDescription.trim())
      }

      const response = await fetch(API_ROUTES.Usuario.atualizarPortfolio, {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar portifolio.")
      }

      await refreshBackendProfile(tokenGoogle)
      toast({
        title: "Portifolio atualizado",
        description: "Sua nova imagem ja aparece no perfil.",
      })
      setIsAddPortfolioOpen(false)
      resetPortfolioDialog()
    } catch {
      toast({
        title: "Erro ao enviar",
        description: "Nao foi possivel enviar a imagem agora.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingPortfolio(false)
    }
  }

  const triggerPulse = (setter: React.Dispatch<React.SetStateAction<string | null>>, postId: string) => {
    setter(postId)
    window.setTimeout(() => {
      setter((current) => (current === postId ? null : current))
    }, 220)
  }

  const handleLikePost = async (post?: PortfolioPost | null) => {
    if (!post) return
    if (likedPosts[post.id]) return
    if (!post.backendId) {
      toast({
        title: "Post indisponivel",
        description: "Este post ainda nao pode ser curtido.",
        variant: "destructive",
      })
      return
    }

    const tokenGoogle = localStorage.getItem("google_token")?.trim() ?? ""
    if (!tokenGoogle) {
      toast({
        title: "Sessao expirada",
        description: "Faca login novamente para curtir.",
        variant: "destructive",
      })
      return
    }

    setLikedPosts((prev) => ({ ...prev, [post.id]: true }))
    setPostMetrics((prev) => ({
      ...prev,
      [post.id]: {
        likes: (prev[post.id]?.likes ?? post.likes) + 1,
        saves: prev[post.id]?.saves ?? post.saves,
      },
    }))
    triggerPulse(setPulseLikeId, post.id)

    try {
      const response = await fetch(API_ROUTES.Interacao.curtirPortfolio, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleToken: tokenGoogle,
          portfolioItemId: post.backendId,
        }),
      })
      if (!response.ok) throw new Error("Falha ao curtir.")
    } catch {
      setLikedPosts((prev) => {
        const next = { ...prev }
        delete next[post.id]
        return next
      })
      setPostMetrics((prev) => ({
        ...prev,
        [post.id]: {
          likes: Math.max(0, (prev[post.id]?.likes ?? post.likes) - 1),
          saves: prev[post.id]?.saves ?? post.saves,
        },
      }))
      toast({
        title: "Erro ao curtir",
        description: "Nao foi possivel registrar a curtida.",
        variant: "destructive",
      })
    }
  }

  const handleSavePost = async (post?: PortfolioPost | null) => {
    if (!post) return
    if (!post.backendId) {
      toast({
        title: "Post indisponivel",
        description: "Este post ainda nao pode ser salvo.",
        variant: "destructive",
      })
      return
    }

    const tokenGoogle = localStorage.getItem("google_token")?.trim() ?? ""
    if (!tokenGoogle) {
      toast({
        title: "Sessao expirada",
        description: "Faca login novamente para salvar.",
        variant: "destructive",
      })
      return
    }

    const isSaved = Boolean(savedPosts[post.id])
    setSavedPosts((prev) => ({ ...prev, [post.id]: !isSaved }))
    setPostMetrics((prev) => ({
      ...prev,
      [post.id]: {
        likes: prev[post.id]?.likes ?? post.likes,
        saves: (prev[post.id]?.saves ?? post.saves) + (isSaved ? -1 : 1),
      },
    }))
    triggerPulse(setPulseSaveId, post.id)

    try {
      const response = await fetch(
        isSaved ? API_ROUTES.Interacao.desfavoritar : API_ROUTES.Interacao.favoritar,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleToken: tokenGoogle,
            alvoId: post.backendId,
            tipoAlvoInteracao: 1,
          }),
        }
      )
      if (!response.ok) throw new Error("Falha ao salvar.")
    } catch {
      setSavedPosts((prev) => ({ ...prev, [post.id]: isSaved }))
      setPostMetrics((prev) => ({
        ...prev,
        [post.id]: {
          likes: prev[post.id]?.likes ?? post.likes,
          saves: Math.max(0, (prev[post.id]?.saves ?? post.saves) + (isSaved ? 1 : -1)),
        },
      }))
      toast({
        title: "Erro ao salvar",
        description: "Nao foi possivel registrar o salvamento.",
        variant: "destructive",
      })
    }
  }

  return (
    <section className="min-h-[calc(100svh-4rem)] w-full space-y-6 px-6 py-6">
      <div className="h-52 w-full overflow-hidden rounded-2xl md:h-64">
        <img
          src={resolvedCoverImageUrl}
          alt="Foto de capa"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <section className="space-y-4 bg-card/80 p-4 md:p-5 dark:bg-[oklch(0.12_0_0)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-full border bg-background/80 p-1 text-lg font-bold">
              <Button
                type="button"
                size="default"
                variant={showServices ? "default" : "ghost"}
                onClick={() => setShowServices(true)}
                className={
                  showServices
                    ? "rounded-full"
                    : "rounded-full text-muted-foreground"
                }
              >
                Servicos
              </Button>
              <Button
                type="button"
                size="default"
                variant={showServices ? "ghost" : "default"}
                onClick={() => setShowServices(false)}
                className={
                  showServices
                    ? "rounded-full text-muted-foreground"
                    : "rounded-full"
                }
              >
                Portifolio
              </Button>
            </div>
            {!showServices && (
              <Select
                value={portfolioSort}
                onValueChange={(value) =>
                  setPortfolioSort(value as "recentes" | "populares")
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recentes">Mais recentes</SelectItem>
                  <SelectItem value="populares">Mais populares</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          {showServices ? (
            activePriceSheets.length > 0 ? (
              <div className="space-y-4">
                {activePriceSheets.map((sheet, index) =>
                  isOwnerProfile ? (
                    <OwnerPriceSheetRow
                      key={sheet.id}
                      sheet={sheet}
                      images={serviceGalleries[index] ?? []}
                    />
                  ) : (
                    <PriceSheetRow
                      key={sheet.id}
                      sheet={sheet}
                      images={serviceGalleries[index] ?? []}
                      artist={artist}
                      onRequest={onRequestCommission}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-6 text-center text-sm text-muted-foreground">
                Nenhum serviço cadastrado ainda.
              </div>
            )
          ) : (
            sortedPosts.length > 0 || canEditProfile ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {canEditProfile && (
                  <button
                    type="button"
                    className="group flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                    onClick={() => setIsAddPortfolioOpen(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-border/60 text-3xl font-semibold">
                        +
                      </div>
                      <span className="text-sm font-semibold">
                        Adicionar imagem
                      </span>
                    </div>
                  </button>
                )}
                {sortedPosts.map((post, index) => (
                  <div key={post.id} className="group relative">
                    <PortfolioPreviewCard
                      post={post}
                      onOpen={() => {
                        setActivePostIndex(index)
                        setActiveImageIndex(0)
                        setPostDialogOpen(true)
                      }}
                    />
                    <div className="absolute bottom-3 right-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {isOwnerProfile ? null : (
                        <>
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            aria-label="Curtir"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            aria-label="Salvar"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-6 text-center text-sm text-muted-foreground">
                Nenhum post no portfólio ainda.
              </div>
            )
          )}
        </section>
        <aside className="self-start lg:sticky lg:top-8">
          <section
            className="space-y-6 p-3 lg:-mt-3 lg:min-h-[calc(100svh-14em)]"
          >

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <Avatar className="relative z-10 h-32 w-32">
                  <AvatarImage
                    src={resolvedAvatarUrl}
                    alt={resolvedDisplayName}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                {!isMockUser && (
                  <>
                    <input
                      id="profile-photo-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <label
                      htmlFor="profile-photo-input"
                      className="group absolute inset-0 z-20 flex cursor-pointer items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity hover:opacity-100"
                      aria-label="Editar foto de perfil"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <Pencil className="h-4 w-4" />
                        Editar
                      </span>
                    </label>
                  </>
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center rounded-full bg-black/60 text-xs font-semibold text-white">
                    Enviando...
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{resolvedDisplayName}</h2>
                <p className="text-sm text-muted-foreground">{handle}</p>
              </div>
              <p className="text-sm text-muted-foreground">{resolvedBio}</p>
            </div>
            <div className="flex w-full flex-wrap justify-center gap-2">
              {badgeList.length > 0 ? (
                badgeList.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">Sem badges</Badge>
              )}
            </div>
            <div className="flex">
              {canEditProfile ? (
                <Button
                  className="w-full gap-2 px-4 py-6 text-base"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <Pencil className="h-5 w-5" />
                  Editar perfil
                </Button>
              ) : (
                <>
                  <Button className="flex-1 gap-2 px-4">
                    <UserPlus className="h-4 w-4" />
                    Seguir
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 gap-2"
                    aria-label="Enviar DM"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Mensagem
                  </Button>
                </>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold">
                  {typeof followersValue === "number"
                    ? followersValue.toLocaleString("pt-BR")
                    : "--"}
                </span>
                <span className="text-muted-foreground">Seguidores</span>
              </div>
              {!canEditProfile && (
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-semibold">312</span>
                  <span className="text-muted-foreground">Seguindo</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">
                  {ratingValue.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-3.5 w-2.5 ${index < Math.round(ratingValue)
                          ? "fill-foreground text-foreground"
                          : "text-muted-foreground"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">Avaliação</span>
              </div>
            </div>
            <div className="text-center text-xs font-semibold uppercase text-muted-foreground">
              Redes do Artista
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  aria-label={link.name}
                >
                  <a href={link.href} target="_blank" rel="noreferrer">
                    <link.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Sobre o estilo
              </div>
              <p className="text-muted-foreground">
                {resolvedStyleDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {resolvedStyleTags.length > 0 ? (
                  resolvedStyleTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">Sem tags</Badge>
                )}
              </div>
            </div>
          </section>
        </aside>
      </div>

      <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
        <DialogContent className="h-[92vh] max-h-[66vh] w-[98vw] max-w-7xl overflow-hidden p-0">
          <div className="h-full min-h-0">
            <div className="grid h-full min-h-0 gap-6 px-6 pb-6 pt-6 lg:grid-cols-[minmax(0,1fr)_840px] lg:items-stretch">
              <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto pb-12 pr-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-border/60">
                      <AvatarImage src={resolvedAvatarUrl} alt={resolvedDisplayName} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{resolvedDisplayName}</p>
                      <p className="text-xs text-muted-foreground">{handle}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-3xl font-semibold">
                    {activePost?.titulo ?? "Post do portifolio"}
                  </h3>
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      {clampedDescription}
                    </p>
                    {activePost?.createdAt ? (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatPostDate(activePost.createdAt)}
                      </span>
                    ) : null}
                  </div>
                </div>
                {activePost?.commissionLink && !isOwnerProfile ? (
                  <>
                    <Separator />
                    <Button
                      asChild
                      variant="ghost"
                      className="inline-flex self-start items-center justify-start gap-2 px-0 underline-offset-4 hover:underline"
                    >
                      <a href={activePost.commissionLink}>
                        Peca algo parecido ao artista
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M7 17L17 7" />
                          <path d="M7 7h10v10" />
                        </svg>
                      </a>
                    </Button>
                  </>
                ) : null}
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {(activePost?.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleLikePost(activePost)}
                  >
                    <Heart
                      className={`h-4 w-4 transition-transform ${
                        likedPosts[activePost?.id ?? ""] ? "fill-red-500 text-red-500" : ""
                      } ${pulseLikeId === activePost?.id ? "scale-110" : ""}`}
                    />
                    <span className="text-xs font-semibold">
                      {resolveMetrics(activePost).likes.toLocaleString("pt-BR")}
                    </span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleSavePost(activePost)}
                  >
                    <Bookmark
                      className={`h-4 w-4 transition-transform ${
                        savedPosts[activePost?.id ?? ""] ? "fill-sky-500 text-sky-500" : ""
                      } ${pulseSaveId === activePost?.id ? "scale-110" : ""}`}
                    />
                    <span className="text-xs font-semibold">
                      {resolveMetrics(activePost).saves.toLocaleString("pt-BR")}
                    </span>
                  </Button>
                </div>
              </div>

              <div
                className={`flex h-full flex-col space-y-3 ${
                  isSingleImagePost
                    ? "lg:self-center lg:justify-center"
                    : "lg:sticky lg:bottom-6 lg:self-stretch"
                }`}
              >
                <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card/70">
                  <div className="aspect-[16/9] w-full">
                    <img
                      src={activePost?.images?.[activeImageIndex]}
                      alt={`${activePost?.titulo ?? "Post"} ${activeImageIndex + 1}`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  {!isSingleImagePost && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        onClick={() => {
                          if (!activePost?.images?.length) return
                          setActiveImageIndex((prev) =>
                            prev === 0
                              ? activePost.images.length - 1
                              : prev - 1
                          )
                        }}
                      >
                        <span className="sr-only">Anterior</span>
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => {
                          if (!activePost?.images?.length) return
                          setActiveImageIndex((prev) =>
                            prev === activePost.images.length - 1 ? 0 : prev + 1
                          )
                        }}
                      >
                        <span className="sr-only">Proximo</span>
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Button>
                      <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                        {activeImageIndex + 1} /{" "}
                        {activePost?.images?.length ?? 0}
                      </div>
                    </>
                  )}
                </div>

                {(activePost?.images?.length ?? 0) > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {(activePost?.images ?? []).map((imageUrl, index) => (
                      <button
                        key={`${imageUrl}-${index}`}
                        type="button"
                        className={`overflow-hidden rounded-lg border ${
                          index === activeImageIndex
                            ? "border-foreground"
                            : "border-border/60"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <div className="h-16 w-24">
                          <img
                            src={imageUrl}
                            alt={`${activePost?.titulo ?? "Post"} ${index + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="w-[96vw] max-w-4xl overflow-hidden border border-white/10 bg-neutral-950 p-0 text-white">
          <div className="flex h-[86vh] flex-col">
            <DialogHeader className="border-b border-white/10 px-6 py-4">
              <DialogTitle className="text-white">Editar perfil</DialogTitle>
              <DialogDescription className="text-white/60">
                Atualize os dados visiveis do seu perfil.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {profileDraft ? (
                <div className="space-y-8">
                  <section className="space-y-4">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <div className="relative aspect-[16/7] w-full">
                        {profileDraft.coverUrl ? (
                          <img
                            src={profileDraft.coverUrl}
                            alt="Preview da capa"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-white/50">
                            Sem capa
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute right-4 top-4 flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="gap-2 bg-white/10 text-white hover:bg-white/20"
                            onClick={() =>
                              document.getElementById("draft-cover-input")?.click()
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            Editar capa
                          </Button>
                          <Input
                            id="draft-cover-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleDraftCoverChange}
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-6 right-6 z-20">
                        <div className="relative">
                          <Avatar className="h-40 w-40 border-4 border-neutral-950">
                            <AvatarImage
                              src={profileDraft.avatarUrl}
                              alt={profileDraft.displayName}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="secondary"
                            className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
                            onClick={() =>
                              document.getElementById("draft-avatar-input")?.click()
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Input
                            id="draft-avatar-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleDraftAvatarChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4 pt-10 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-white/70">
                          Capa do perfil
                        </Label>
                        <p className="text-xs text-white/50">
                          Use o botao \"Editar capa\" para trocar a imagem.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/70">
                          Foto de perfil
                        </Label>
                        <p className="text-xs text-white/50">
                          Use o botao sobre o avatar para trocar a imagem.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="text-sm font-semibold uppercase text-white/60">
                      Identidade
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="profile-display-name" className="text-white/70">
                          Nome de exibicao
                        </Label>
                        <Input
                          id="profile-display-name"
                          value={profileDraft.displayName}
                          onChange={(event) =>
                            updateDraft({ displayName: event.target.value })
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                          placeholder="Ex: Camila Araujo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-pronouns" className="text-white/70">
                          Pronomes
                        </Label>
                        <Select
                          value={profileDraft.pronounsBadge}
                          onValueChange={(value) => updateDraft({ pronounsBadge: value })}
                        >
                          <SelectTrigger
                            id="profile-pronouns"
                            className="border-white/10 bg-white/5 text-white"
                          >
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ele/dele">Ele/dele</SelectItem>
                            <SelectItem value="Ela/dela">Ela/dela</SelectItem>
                            <SelectItem value="Elu/Delu">Elu/Delu</SelectItem>
                            <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-role" className="text-white/70">
                          Cargo
                        </Label>
                        <Select
                          value={profileDraft.roleBadge}
                          onValueChange={(value) => updateDraft({ roleBadge: value })}
                        >
                          <SelectTrigger
                            id="profile-role"
                            className="border-white/10 bg-white/5 text-white"
                          >
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ilustradora">Ilustradora</SelectItem>
                            <SelectItem value="Ilustrador">Ilustrador</SelectItem>
                            <SelectItem value="Designer">Designer</SelectItem>
                            <SelectItem value="Concept artist">Concept artist</SelectItem>
                            <SelectItem value="Animadora">Animadora</SelectItem>
                            <SelectItem value="Modeladora 3D">Modeladora 3D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-delivery" className="text-white/70">
                          Prazo medio de entrega
                        </Label>
                        <Select
                          value={profileDraft.deliveryBadge}
                          onValueChange={(value) => updateDraft({ deliveryBadge: value })}
                        >
                          <SelectTrigger
                            id="profile-delivery"
                            className="border-white/10 bg-white/5 text-white"
                          >
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3 dias">1-3 dias</SelectItem>
                            <SelectItem value="1 semana">1 semana</SelectItem>
                            <SelectItem value="2-3 semanas">2-3 semanas</SelectItem>
                            <SelectItem value="1 mes">1 mes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <div className="text-sm font-semibold uppercase text-white/60">
                      Bio e estilo
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-bio" className="text-white/70">
                        Bio
                      </Label>
                      <Textarea
                        id="profile-bio"
                        value={profileDraft.bio}
                        onChange={(event) => updateDraft({ bio: event.target.value })}
                        rows={4}
                        className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                        placeholder="Conte um pouco sobre voce e o seu trabalho."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-style" className="text-white/70">
                        Sobre o estilo
                      </Label>
                      <Textarea
                        id="profile-style"
                        value={profileDraft.styleDescription}
                        onChange={(event) =>
                          updateDraft({ styleDescription: event.target.value })
                        }
                        rows={4}
                        className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                        placeholder="Descreva sua abordagem, tecnicas e referencias."
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="profile-style-tags" className="text-white/70">
                          Tags de estilo
                        </Label>
                        <Input
                          id="profile-style-tags"
                          value={profileDraft.styleTags}
                          onChange={(event) =>
                            updateDraft({ styleTags: event.target.value })
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                          placeholder="Ex: Lineart, Cores pasteis, Chibi"
                        />
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <div className="text-sm font-semibold uppercase text-white/60">
                      Redes sociais
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="profile-twitter" className="text-white/70">
                          Twitter/X
                        </Label>
                        <Input
                          id="profile-twitter"
                          value={profileDraft.socialLinks.twitter}
                          onChange={(event) =>
                            updateDraftSocial("twitter", event.target.value)
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                          placeholder="https://twitter.com/"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-instagram" className="text-white/70">
                          Instagram
                        </Label>
                        <Input
                          id="profile-instagram"
                          value={profileDraft.socialLinks.instagram}
                          onChange={(event) =>
                            updateDraftSocial("instagram", event.target.value)
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                          placeholder="https://www.instagram.com/"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-tiktok" className="text-white/70">
                          TikTok
                        </Label>
                        <Input
                          id="profile-tiktok"
                          value={profileDraft.socialLinks.tiktok}
                          onChange={(event) =>
                            updateDraftSocial("tiktok", event.target.value)
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                          placeholder="https://www.tiktok.com/"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-youtube" className="text-white/70">
                          YouTube
                        </Label>
                        <Input
                          id="profile-youtube"
                          value={profileDraft.socialLinks.youtube}
                          onChange={(event) =>
                            updateDraftSocial("youtube", event.target.value)
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                          placeholder="https://www.youtube.com/"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-twitch" className="text-white/70">
                          Twitch
                        </Label>
                        <Input
                          id="profile-twitch"
                          value={profileDraft.socialLinks.twitch}
                          onChange={(event) =>
                            updateDraftSocial("twitch", event.target.value)
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                          placeholder="https://www.twitch.tv/"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-artstation" className="text-white/70">
                          ArtStation
                        </Label>
                        <Input
                          id="profile-artstation"
                          value={profileDraft.socialLinks.artstation}
                          onChange={(event) =>
                            updateDraftSocial("artstation", event.target.value)
                          }
                          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                          placeholder="https://www.artstation.com/"
                        />
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}
            </div>

            <DialogFooter className="border-t border-white/10 px-6 py-4">
              <Button
                className="ml-auto bg-white text-black hover:bg-white/90"
                onClick={handleProfileSave}
              >
                Salvar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddPortfolioOpen} onOpenChange={setIsAddPortfolioOpen}>
        <DialogContent className="w-[92vw] max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar no portifolio</DialogTitle>
            <DialogDescription>
              Envie uma imagem para o seu portifolio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-title">Titulo</Label>
              <Input
                id="portfolio-title"
                value={portfolioTitle}
                onChange={(event) =>
                  setPortfolioTitle(event.target.value.slice(0, portfolioTitleLimit))
                }
                placeholder="Ex: Cenario ilustrado"
              />
              <p className="text-xs text-muted-foreground">
                {remainingPortfolioTitleChars} caracteres restantes
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio-description">
                Descricao (max {descriptionLimit} caracteres)
              </Label>
              <Textarea
                id="portfolio-description"
                value={portfolioDescription}
                onChange={(event) =>
                  setPortfolioDescription(event.target.value.slice(0, descriptionLimit))
                }
                rows={4}
                placeholder="Descreva o post."
              />
              <p className="text-xs text-muted-foreground">
                {remainingPortfolioChars} caracteres restantes
              </p>
            </div>
            <div className="space-y-2">
              <Label>Imagem</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    document.getElementById("portfolio-image-input")?.click()
                  }
                >
                  Upar imagem
                </Button>
                <span className="text-sm text-muted-foreground">
                  {portfolioImage ? portfolioImage.name : "Nenhum arquivo selecionado"}
                </span>
                <Input
                  id="portfolio-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePortfolioImageChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddPortfolioOpen(false)
                resetPortfolioDialog()
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePortfolioSubmit}
              disabled={!portfolioImage || isUploadingPortfolio}
            >
              {isUploadingPortfolio ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </section>
  )
}
