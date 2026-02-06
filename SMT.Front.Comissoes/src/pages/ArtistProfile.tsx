import { useEffect, useRef, useState } from "react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PriceSheetRow } from "@/components/profile/PriceSheetRow"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { PriceSheet, User } from "@/types"
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
  usuarioId?: number
  avaliacao?: number
  estilo?: string
  tipoArtista?: string
  cargoArtista?: string
  prazoMedioEntrega?: string
  tagsArtista?: string[]
  portifolioUrl?: string
  usuarioFotoCapa?: string
  ativoParaServicos?: boolean
  usuarioNomePerfil?: string
  usuarioNome?: string
  usuarioFotoPerfil?: string
  usuarioSeguidores?: number
  usuarioBio?: string
  usuarioPronome?: string
  socialLinks?: Partial<Record<SocialLinkKey, string>>
  portfolioItens?: BackendPortfolioItem[]
}

type BackendPortfolioItem = {
  id?: number
  artistaId?: number
  titulo?: string
  descricao?: string
  hashtags?: string[]
  urlArquivo?: string
  imagens?: BackendPortfolioItemImagem[]
  ordem?: number
  likeCount?: number
  favoritoCount?: number
  visualizacaoCount?: number
  dataCriacao?: string
  curtidoPeloUsuario?: boolean
  salvoPeloUsuario?: boolean
}

type BackendPortfolioItemImagem = {
  id?: number
  portfolioItemId?: number
  urlArquivo?: string
  ordem?: number
  principal?: boolean
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

const userFetchGuard = { token: "", ts: 0 }
const artistFetchGuard = { token: "", ts: 0 }

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

const normalizeDraftValue = (value: string) => value.trim()

const normalizeTagsForCompare = (value: string) =>
  splitCommaList(value)
    .map((item) => item.toLowerCase())
    .sort()
    .join(",")

const normalizePronounLabel = (value?: string) => {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized === "ela/dela") return "Ela/dela"
  if (normalized === "ele/dele") return "Ele/dele"
  if (normalized === "elu/delu") return "Elu/Delu"
  if (normalized.includes("não") || normalized.includes("nao")) return "Prefiro não informar"
  return value
}

const normalizeRoleLabel = (value?: string) => {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized.includes("ilustrador")) return "Ilustrador"
  if (normalized.includes("designer")) return "Designer"
  if (normalized.includes("concept")) return "Concept artist"
  if (normalized.includes("animador")) return "Animadora"
  if (normalized.includes("3d")) return "Modeladora 3D"
  return value
}

const normalizeDeliveryLabel = (value?: string) => {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized.includes("três") || normalized.includes("tres")) return "1-3 dias"
  if (normalized.includes("semana")) return "1 semana"
  if (normalized.includes("meio")) return "2-3 semanas"
  if (normalized.includes("trinta") || normalized.includes("mês") || normalized.includes("mes")) return "1 mes"
  return value
}

const mapPronomeToEnum = (value?: string) => {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized === "ela/dela") return 1
  if (normalized === "ele/dele") return 2
  if (normalized === "elu/delu") return 3
  if (normalized.includes("prefiro") || normalized.includes("não") || normalized.includes("nao")) return 4
  return undefined
}

const mapCargoToEnum = (value?: string) => {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized.includes("ilustrador")) return 1
  if (normalized.includes("designer")) return 2
  if (normalized.includes("concept")) return 3
  if (normalized.includes("animador")) return 4
  if (normalized.includes("3d")) return 5
  return undefined
}

const mapPrazoToEnum = (value?: string) => {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized.includes("1-3") || normalized.includes("três") || normalized.includes("tres")) return 1
  if (normalized.includes("1 semana") || normalized.includes("semana")) return 2
  if (normalized.includes("2-3") || normalized.includes("meio")) return 3
  if (normalized.includes("1 mes") || normalized.includes("mês") || normalized.includes("mes") || normalized.includes("trinta")) return 4
  return undefined
}

const normalizeSocialHandle = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const stripAt = (input: string) => input.replace(/^@+/, "")
  if (trimmed.startsWith("@")) return stripAt(trimmed)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed)
      const path = url.pathname.replace(/\/+$/, "")
      const lastSegment = path.split("/").filter(Boolean).pop() ?? ""
      if (!lastSegment) return ""
      return stripAt(lastSegment)
    } catch {
      // fallthrough
    }
  }
  if (trimmed.startsWith("www.")) {
    return normalizeSocialHandle(`https://${trimmed}`)
  }
  return stripAt(trimmed)
}

const mapSocialKey = (value: string): SocialLinkKey | null => {
  const normalized = value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "")
  if (!normalized) return null
  if (normalized.includes("twitter") || normalized === "x") return "twitter"
  if (normalized.includes("instagram")) return "instagram"
  if (normalized.includes("tiktok")) return "tiktok"
  if (normalized.includes("youtube")) return "youtube"
  if (normalized.includes("twitch")) return "twitch"
  if (normalized.includes("artstation")) return "artstation"
  return null
}

const parseSocialLinks = (value: unknown): Partial<Record<SocialLinkKey, string>> => {
  if (!Array.isArray(value)) return {}
  const result: Partial<Record<SocialLinkKey, string>> = {}
  value.forEach((entry) => {
    if (!entry || typeof entry !== "object") return
    const record = entry as Record<string, unknown>
    const titulo = readField<string>(record, "titulo", "Titulo")
    const url = readField<string>(record, "url", "Url")
    if (!titulo || !url) return
    const key = mapSocialKey(titulo)
    if (!key) return
    const handle = normalizeSocialHandle(url)
    if (!handle) return
    result[key] = handle
  })
  return result
}

const normalizeSocialLinkMap = (
  links: Partial<Record<SocialLinkKey, string>>
): Partial<Record<SocialLinkKey, string>> => {
  const result: Partial<Record<SocialLinkKey, string>> = {}
  Object.entries(links).forEach(([key, value]) => {
    if (!value) return
    const handle = normalizeSocialHandle(value)
    if (!handle) return
    result[key as SocialLinkKey] = handle
  })
  return result
}

const buildSocialHref = (key: SocialLinkKey, value: string) => {
  const handle = normalizeSocialHandle(value)
  if (!handle) return ""
  switch (key) {
    case "twitter":
      return `https://x.com/${handle}`
    case "instagram":
      return `https://www.instagram.com/${handle}`
    case "tiktok":
      return `https://www.tiktok.com/@${handle}`
    case "youtube":
      return `https://www.youtube.com/@${handle}`
    case "twitch":
      return `https://www.twitch.tv/${handle}`
    case "artstation":
      return `https://www.artstation.com/${handle}`
    default:
      return ""
  }
}

const emptySocialLinks: Record<SocialLinkKey, string> = {
  twitter: "",
  instagram: "",
  tiktok: "",
  youtube: "",
  twitch: "",
  artstation: "",
}

const socialNetworkTitleMap: Record<SocialLinkKey, string> = {
  twitter: "Twitter",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  twitch: "Twitch",
  artstation: "ArtStation",
}

const parsePortfolioImages = (value: unknown): BackendPortfolioItemImagem[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return []
    const record = entry as Record<string, unknown>
    return [
      {
        id: readField<number>(record, "id", "Id"),
        portfolioItemId: readField<number>(record, "portfolioItemId", "PortfolioItemId"),
        urlArquivo: readField<string>(record, "urlArquivo", "UrlArquivo"),
        ordem: readField<number>(record, "ordem", "Ordem"),
        principal: readField<boolean>(record, "principal", "Principal"),
      },
    ]
  })
}

const parsePortfolioItems = (value: unknown): BackendPortfolioItem[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return []
    const record = entry as Record<string, unknown>
    const imagens = parsePortfolioImages(readField<unknown>(record, "imagens", "Imagens"))
    const hashtags = readField<string[]>(record, "hashtags", "Hashtags")
    return [
      {
        id: readField<number>(record, "id", "Id"),
        artistaId: readField<number>(record, "artistaId", "ArtistaId"),
        titulo: readField<string>(record, "titulo", "Titulo"),
        descricao: readField<string>(record, "descricao", "Descricao"),
        hashtags: Array.isArray(hashtags) ? hashtags.filter(Boolean) : undefined,
        urlArquivo: readField<string>(record, "urlArquivo", "UrlArquivo"),
        imagens: imagens.length > 0 ? imagens : undefined,
        ordem: readField<number>(record, "ordem", "Ordem"),
        likeCount: readField<number>(
          record,
          "likeCount",
          "LikeCount",
          "quantidadeCurtidas",
          "QuantidadeCurtidas"
        ),
        favoritoCount: readField<number>(
          record,
          "favoritoCount",
          "FavoritoCount",
          "quantidadeSalvos",
          "QuantidadeSalvos"
        ),
        visualizacaoCount: readField<number>(
          record,
          "visualizacaoCount",
          "VisualizacaoCount",
          "quantidadeVisualizacoes",
          "QuantidadeVisualizacoes"
        ),
        dataCriacao: readField<string>(record, "dataCriacao", "DataCriacao"),
        curtidoPeloUsuario: readField<boolean>(
          record,
          "curtidoPeloUsuario",
          "CurtidoPeloUsuario"
        ),
        salvoPeloUsuario: readField<boolean>(
          record,
          "salvoPeloUsuario",
          "SalvoPeloUsuario"
        ),
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
      className="relative h-full w-full cursor-pointer overflow-hidden rounded-xl border bg-card"
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
                    className={`h-1.5 w-1.5 rounded-full transition ${index === carouselIndex
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
          <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            {post.titulo}
          </div>
        </div>
      </div>
    </button>
  )
}

interface ArtistProfileProps {
  onRequestCommission: (price: number) => void
  currentUser?: User
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

type ServiceSheet = PriceSheet & {
  images?: string[]
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
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [backendProfile, setBackendProfile] = useState<BackendArtistProfile | null>(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [profileOverrides, setProfileOverrides] = useState<ProfileOverrides | null>(null)
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null)
  const [profileDraftInitial, setProfileDraftInitial] = useState<ProfileDraft | null>(null)
  const profileRequestIdRef = useRef(0)
  const [draftAvatarPreview, setDraftAvatarPreview] = useState("")
  const [draftCoverPreview, setDraftCoverPreview] = useState("")
  const [draftCoverFile, setDraftCoverFile] = useState<File | null>(null)
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [serviceTitle, setServiceTitle] = useState("")
  const [servicePrice, setServicePrice] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")
  const [serviceTerms, setServiceTerms] = useState("")
  const [serviceImages, setServiceImages] = useState<File[]>([])
  const [serviceDragIndex, setServiceDragIndex] = useState<number | null>(null)
  const [serviceDragOverIndex, setServiceDragOverIndex] = useState<number | null>(null)
  const [servicePreviewUrls, setServicePreviewUrls] = useState<
    { file: File; url: string }[]
  >([])
  const [addedServices, setAddedServices] = useState<ServiceSheet[]>([])
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false)
  const [portfolioTitle, setPortfolioTitle] = useState("")
  const [portfolioDescription, setPortfolioDescription] = useState("")
  const [portfolioImages, setPortfolioImages] = useState<File[]>([])
  const [portfolioHashtags, setPortfolioHashtags] = useState<string[]>([])
  const [portfolioTagInput, setPortfolioTagInput] = useState("#")
  const [portfolioServiceId, setPortfolioServiceId] = useState("none")
  const [portfolioDragIndex, setPortfolioDragIndex] = useState<number | null>(null)
  const [portfolioDragOverIndex, setPortfolioDragOverIndex] = useState<number | null>(null)
  const [portfolioPreviewUrls, setPortfolioPreviewUrls] = useState<
    { file: File; url: string }[]
  >([])
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({})
  const [postMetrics, setPostMetrics] = useState<Record<string, { likes: number; saves: number }>>({})
  const [pulseLikeId, setPulseLikeId] = useState<string | null>(null)
  const [pulseSaveId, setPulseSaveId] = useState<string | null>(null)
  const { toast } = useToast()
  const portfolioHashtagsLimit = 10
  const portfolioHashtagLengthLimit = 15
  const fallbackArtist: User = {
    id: currentUser?.id ?? "",
    nome: currentUser?.nome ?? "",
    role: currentUser?.role ?? "cliente",
    avatarUrl: currentUser?.avatarUrl ?? "",
    bio: currentUser?.bio ?? "",
    seguidores: currentUser?.seguidores ?? 0,
  }
  const artist = currentUser ?? fallbackArtist
  const isOwnerProfile = Boolean(currentUser?.id && artist?.id && currentUser.id === artist.id)
  const canEditProfile = Boolean(currentUser?.id)

  const applyUserFromTokenResponse = (resultado: Record<string, unknown>) => {
    const usuarioId = readField<number>(resultado, "id", "Id")
    const usuarioNomePerfil = readField<string>(resultado, "nomePerfil", "NomePerfil")
    const usuarioNome = readField<string>(resultado, "nome", "Nome")
    const usuarioFotoPerfil = readField<string>(resultado, "fotoPerfil", "FotoPerfil")
    const usuarioFotoCapa = readField<string>(resultado, "fotoCapa", "FotoCapa")
    const usuarioSeguidores = readField<number>(resultado, "seguidores", "Seguidores")
    const usuarioBio = readField<string>(resultado, "bio", "Bio")
    const usuarioPronome = readField<string>(resultado, "pronome", "Pronome")
    const redesSociais = readField<unknown>(resultado, "redesSociais", "RedesSociais")
    const socialLinks = parseSocialLinks(redesSociais)
    const hasSocialLinks = Object.keys(socialLinks).length > 0
    setBackendProfile((prev) => ({
      usuarioId: usuarioId ?? prev?.usuarioId,
      avaliacao: prev?.avaliacao,
      estilo: prev?.estilo,
      tipoArtista: prev?.tipoArtista,
      cargoArtista: prev?.cargoArtista,
      prazoMedioEntrega: prev?.prazoMedioEntrega,
      tagsArtista: prev?.tagsArtista,
      portifolioUrl: prev?.portifolioUrl,
      ativoParaServicos: prev?.ativoParaServicos,
      portfolioItens: prev?.portfolioItens,
      usuarioNomePerfil: usuarioNomePerfil ?? prev?.usuarioNomePerfil,
      usuarioNome: usuarioNome ?? prev?.usuarioNome,
      usuarioFotoPerfil: usuarioFotoPerfil ?? prev?.usuarioFotoPerfil,
      usuarioFotoCapa: usuarioFotoCapa ?? prev?.usuarioFotoCapa,
      usuarioSeguidores: usuarioSeguidores ?? prev?.usuarioSeguidores,
      usuarioBio: usuarioBio ?? prev?.usuarioBio,
      usuarioPronome: usuarioPronome ?? prev?.usuarioPronome,
      socialLinks: hasSocialLinks ? socialLinks : prev?.socialLinks,
    }))
  }

  const fetchUsuarioPorToken = async (tokenGoogle: string, force = false) => {
    const now = Date.now()
    if (!force && userFetchGuard.token === tokenGoogle && now - userFetchGuard.ts < 1500) {
      return
    }
    userFetchGuard.token = tokenGoogle
    userFetchGuard.ts = now
    const response = await fetch(API_ROUTES.Usuario.obterUsuarioPorToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenGoogle }),
    })
    if (!response.ok) return
    const body = await response.json().catch(() => null)
    const resultado = body?.resultado ?? body?.Resultado
    if (!resultado || typeof resultado !== "object") return
    applyUserFromTokenResponse(resultado as Record<string, unknown>)
  }


  useEffect(() => {
    const tokenGoogle = localStorage.getItem("google_token")?.trim() ?? ""
    if (!tokenGoogle) {
      setBackendProfile(null)
      return
    }

    let isActive = true
    const loadProfile = async () => {
      try {
        const now = Date.now()
        if (
          artistFetchGuard.token === tokenGoogle &&
          now - artistFetchGuard.ts < 1500 &&
          backendProfile
        ) {
          await fetchUsuarioPorToken(tokenGoogle, true)
          return
        }
        const requestId = ++profileRequestIdRef.current
        artistFetchGuard.token = tokenGoogle
        artistFetchGuard.ts = now
        const response = await fetch(API_ROUTES.Usuario.obterPerfilArtista, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenGoogle }),
        })
        if (!response.ok) {
          return
        }

        const body = await response.json().catch(() => null)
        const resultado = body?.resultado ?? body?.Resultado
        if (!resultado || typeof resultado !== "object") {
          return
        }

        const resultadoObj = resultado as Record<string, unknown>
        const usuarioId = readField<number>(resultadoObj, "usuarioId", "UsuarioId")
        const avaliacao = readField<number>(resultadoObj, "avaliacao", "Avaliacao")
        const estilo = readField<string>(resultadoObj, "estilo", "Estilo")
        const tipoArtista = readField<string>(resultadoObj, "tipoArtista", "TipoArtista")
        const cargoArtista = readField<string>(resultadoObj, "cargoArtista", "CargoArtista")
        const prazoMedioEntrega = readField<string>(
          resultadoObj,
          "prazoMedioEntrega",
          "PrazoMedioEntrega"
        )
        const tagsArtista = readField<string[]>(
          resultadoObj,
          "tagsArtista",
          "TagsArtista"
        )
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

        if (!isActive || requestId !== profileRequestIdRef.current) return
        setBackendProfile((prev) => ({
          usuarioId: usuarioId ?? prev?.usuarioId,
          avaliacao,
          estilo,
          tipoArtista,
          cargoArtista,
          prazoMedioEntrega,
          tagsArtista,
          portifolioUrl,
          ativoParaServicos,
          portfolioItens,
          usuarioNomePerfil: prev?.usuarioNomePerfil,
          usuarioNome: prev?.usuarioNome,
          usuarioFotoPerfil: prev?.usuarioFotoPerfil,
          usuarioFotoCapa: prev?.usuarioFotoCapa,
          usuarioSeguidores: prev?.usuarioSeguidores,
          usuarioBio: prev?.usuarioBio,
          usuarioPronome: prev?.usuarioPronome,
          socialLinks: prev?.socialLinks,
        }))
        await fetchUsuarioPorToken(tokenGoogle, true)
      } catch {
        // Silent fallback to existing profile data
      }
    }

    loadProfile()
    return () => {
      isActive = false
    }
  }, [currentUser?.id])

  const isProfileLoading =
    !backendProfile || (!backendProfile.usuarioNomePerfil && !backendProfile.usuarioNome)
  const ratingValue =
    typeof backendProfile?.avaliacao === "number"
      ? backendProfile.avaliacao
      : 0
  if (!artist) {
    return null
  }

  const baseProfileBio = backendProfile?.usuarioBio?.trim()
    ? backendProfile.usuarioBio
    : artist.bio?.trim()
      ? artist.bio
      : "Bio ainda n?o informada."
  const baseStyleDescription = backendProfile?.estilo?.trim()
    ? backendProfile.estilo
    : "Estilo ainda n?o informado."
  const baseStyleTags = backendProfile?.tagsArtista ?? []
  const baseCoverImageUrl =
    typeof backendProfile?.usuarioFotoCapa === "string" && backendProfile.usuarioFotoCapa.trim()
      ? backendProfile.usuarioFotoCapa
      : typeof backendProfile?.portifolioUrl === "string" && backendProfile.portifolioUrl.trim()
        ? backendProfile.portifolioUrl
        : ""
  const baseDisplayName =
    typeof backendProfile?.usuarioNomePerfil === "string" && backendProfile.usuarioNomePerfil.trim()
      ? backendProfile.usuarioNomePerfil
      : typeof backendProfile?.usuarioNome === "string" && backendProfile.usuarioNome.trim()
        ? backendProfile.usuarioNome
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
    profileOverrides?.avatarUrl ??
    (isProfileLoading ? "" : (artist.avatarUrl || backendProfile?.usuarioFotoPerfil || ""))

  const baseBadges = {
    pronounsBadge: normalizePronounLabel(backendProfile?.usuarioPronome) ?? "Ela/dela",
    roleBadge: normalizeRoleLabel(backendProfile?.cargoArtista ?? backendProfile?.tipoArtista) ?? "Ilustradora",
    deliveryBadge: normalizeDeliveryLabel(backendProfile?.prazoMedioEntrega) ?? "Entrega em 7 dias",
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

  const baseSocialLinks: Partial<Record<SocialLinkKey, string>> = {}
  const resolvedSocialLinks = normalizeSocialLinkMap({
    ...(backendProfile?.socialLinks ?? {}),
    ...(profileOverrides?.socialLinks ?? {}),
    ...baseSocialLinks,
  })
  const handleSource = resolvedDisplayName

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
  const followersValue =
    typeof backendProfile?.usuarioSeguidores === "number"
      ? backendProfile.usuarioSeguidores
      : undefined

  const availableSocialLinks = backendProfile?.socialLinks ?? {}

  const socialLinks: Array<{
    key: SocialLinkKey
    name: string
    handle?: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  }> = [
    {
      key: "twitter" as SocialLinkKey,
      name: "Twitter",
      handle: availableSocialLinks.twitter,
      icon: Twitter,
    },
    {
      key: "instagram" as SocialLinkKey,
      name: "Instagram",
      handle: availableSocialLinks.instagram,
      icon: Instagram,
    },
    {
      key: "tiktok" as SocialLinkKey,
      name: "TikTok",
      handle: availableSocialLinks.tiktok,
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
          <path d="M15.5 3.5c.6 1.6 1.9 2.8 3.5 3.2v3.1c-1.5 0-2.9-.5-4-1.3v5.2a4.9 4.9 0 1 1-4.9-4.9c.4 0 .8 0 1.2.1v3.2a1.8 1.8 0 1 0 1.5 1.8V3.5h2.7z" />
        </svg>
      ),
    },
    {
      key: "youtube" as SocialLinkKey,
      name: "YouTube",
      handle: availableSocialLinks.youtube,
      icon: Youtube,
    },
    {
      key: "twitch" as SocialLinkKey,
      name: "Twitch",
      handle: availableSocialLinks.twitch,
      icon: Twitch,
    },
    {
      key: "artstation" as SocialLinkKey,
      name: "ArtStation",
      handle: availableSocialLinks.artstation,
      icon: Link,
    },
  ]
    .filter((link) => Boolean(link.handle))

  useEffect(() => {
    if (!isEditProfileOpen) return
    const initialDraft: ProfileDraft = {
      displayName: backendProfile?.usuarioNomePerfil
        ? backendProfile.usuarioNomePerfil
        : artist.nome,
      bio: backendProfile?.usuarioBio ?? "",
      avatarUrl: resolvedAvatarUrl,
      coverUrl: resolvedCoverImageUrl,
      pronounsBadge: normalizePronounLabel(backendProfile?.usuarioPronome) ?? "",
      roleBadge: normalizeRoleLabel(backendProfile?.cargoArtista ?? backendProfile?.tipoArtista) ?? "",
      deliveryBadge: normalizeDeliveryLabel(backendProfile?.prazoMedioEntrega) ?? "",
      styleDescription: backendProfile?.estilo ?? "",
      styleTags: (backendProfile?.tagsArtista ?? []).join(", "),
      socialLinks: { ...emptySocialLinks, ...resolvedSocialLinks },
    }
    setProfileDraft({
      ...initialDraft,
    })
    setProfileDraftInitial(initialDraft)
    setDraftCoverFile(null)
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
    if (!isEditProfileOpen) {
      setDraftCoverFile(null)
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

  useEffect(() => {
    if (!backendProfile?.portfolioItens || backendProfile.portfolioItens.length === 0) return
    const initialLikes: Record<string, boolean> = {}
    const initialSaves: Record<string, boolean> = {}
    backendProfile.portfolioItens.forEach((item) => {
      if (!item?.id) return
      if (item.curtidoPeloUsuario) {
        initialLikes[`portfolio-${item.id}`] = true
      }
      if (item.salvoPeloUsuario) {
        initialSaves[`portfolio-${item.id}`] = true
      }
    })
    if (Object.keys(initialLikes).length > 0) {
      setLikedPosts((prev) => ({ ...prev, ...initialLikes }))
    }
    if (Object.keys(initialSaves).length > 0) {
      setSavedPosts((prev) => ({ ...prev, ...initialSaves }))
    }
  }, [backendProfile?.portfolioItens])
  useEffect(() => {
    const next = portfolioImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPortfolioPreviewUrls(next)
    return () => {
      next.forEach((item) => URL.revokeObjectURL(item.url))
    }
  }, [portfolioImages])

  useEffect(() => {
    if (!isAddServiceOpen) {
      resetServiceDialog()
    }
  }, [isAddServiceOpen])

  useEffect(() => {
    const next = serviceImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setServicePreviewUrls(next)
    return () => {
      next.forEach((item) => URL.revokeObjectURL(item.url))
    }
  }, [serviceImages])

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
    event.target.value = ""
    if (!file) return
    setDraftCoverFile(file)
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

  const handleProfileSave = async () => {
    if (!profileDraft) return
    const initialDraft = profileDraftInitial
    const displayNameChanged =
      Boolean(initialDraft) &&
      normalizeDraftValue(profileDraft.displayName) !== normalizeDraftValue(initialDraft!.displayName)
    const bioChanged =
      Boolean(initialDraft) &&
      normalizeDraftValue(profileDraft.bio) !== normalizeDraftValue(initialDraft!.bio)
    const pronounsChanged =
      Boolean(initialDraft) &&
      normalizeDraftValue(profileDraft.pronounsBadge) !== normalizeDraftValue(initialDraft!.pronounsBadge)
    const styleDescriptionChanged =
      Boolean(initialDraft) &&
      normalizeDraftValue(profileDraft.styleDescription) !==
      normalizeDraftValue(initialDraft!.styleDescription)
    const roleChanged =
      Boolean(initialDraft) &&
      normalizeDraftValue(profileDraft.roleBadge) !== normalizeDraftValue(initialDraft!.roleBadge)
    const deliveryChanged =
      Boolean(initialDraft) &&
      normalizeDraftValue(profileDraft.deliveryBadge) !== normalizeDraftValue(initialDraft!.deliveryBadge)
    const tagsChanged =
      Boolean(initialDraft) &&
      normalizeTagsForCompare(profileDraft.styleTags) !==
      normalizeTagsForCompare(initialDraft!.styleTags)

    const socialEntries = Object.entries(profileDraft.socialLinks).flatMap(
      ([key, value]) => {
        const trimmed = normalizeSocialHandle(value)
        if (!trimmed) return []
        const current = resolvedSocialLinks[key as SocialLinkKey]
        if (current && normalizeSocialHandle(current) === trimmed) return []
        return [[key, trimmed]] as [SocialLinkKey, string][]
      }
    )
    const nextOverrides: ProfileOverrides = {
      avatarUrl: normalizeOptional(profileDraft.avatarUrl),
      coverUrl: normalizeOptional(profileDraft.coverUrl),
    }
    if (displayNameChanged) nextOverrides.displayName = normalizeOptional(profileDraft.displayName)
    if (bioChanged) nextOverrides.bio = normalizeOptional(profileDraft.bio)
    if (pronounsChanged) nextOverrides.pronounsBadge = normalizeOptional(profileDraft.pronounsBadge)
    if (roleChanged) nextOverrides.roleBadge = normalizeOptional(profileDraft.roleBadge)
    if (deliveryChanged) nextOverrides.deliveryBadge = normalizeOptional(profileDraft.deliveryBadge)
    if (styleDescriptionChanged)
      nextOverrides.styleDescription = normalizeOptional(profileDraft.styleDescription)
    if (tagsChanged) nextOverrides.styleTags = splitCommaList(profileDraft.styleTags)
    if (socialEntries.length > 0)
      nextOverrides.socialLinks = Object.fromEntries(socialEntries)
    if (nextOverrides.styleTags && nextOverrides.styleTags.length === 0) {
      delete nextOverrides.styleTags
    }

    const hasUsuarioFieldsToSync = Boolean(displayNameChanged || bioChanged || pronounsChanged)
    const hasArtistaFieldsToSync = Boolean(
      styleDescriptionChanged || roleChanged || deliveryChanged || tagsChanged
    )
    const shouldSyncProfileData = hasUsuarioFieldsToSync || hasArtistaFieldsToSync || socialEntries.length > 0

    let tokenGoogle = ""
    if (shouldSyncProfileData || Boolean(draftCoverFile)) {
      tokenGoogle = localStorage.getItem("google_token")?.trim() ?? ""
      if (!tokenGoogle) {
        toast({
          title: "Sessao expirada",
          description: "Faca login novamente para salvar suas alteracoes.",
          variant: "destructive",
        })
        return
      }
    }

    if (shouldSyncProfileData) {
      setIsSavingProfile(true)
      try {
        if (hasUsuarioFieldsToSync) {
          const responsePerfil = await fetch(API_ROUTES.Usuario.atualizarPerfilUsuario, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tokenGoogle,
              nomePerfil: nextOverrides.displayName,
              bio: nextOverrides.bio,
              pronome: mapPronomeToEnum(nextOverrides.pronounsBadge),
            }),
          })
          if (!responsePerfil.ok) {
            throw new Error("Falha ao atualizar dados do perfil")
          }
        }

        if (hasArtistaFieldsToSync) {
          const usuarioId = backendProfile?.usuarioId
          if (!usuarioId) {
            throw new Error("UsuarioId nao encontrado para atualizar artista")
          }
          const responseArtista = await fetch(API_ROUTES.Usuario.atualizarPerfilArtista, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuarioId,
              estiloDescricao: nextOverrides.styleDescription,
              prazoMedioEntrega: mapPrazoToEnum(nextOverrides.deliveryBadge),
              cargoArtista: mapCargoToEnum(nextOverrides.roleBadge),
              tagsArtista: nextOverrides.styleTags,
            }),
          })
          if (!responseArtista.ok) {
            throw new Error("Falha ao atualizar dados do artista")
          }
        }

        for (const [key, handle] of socialEntries) {
          const response = await fetch(API_ROUTES.Usuario.atualizarRedesSociais, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tokenGoogle,
              redeSocial: socialNetworkTitleMap[key],
              usuario: handle,
            }),
          })
          if (!response.ok) {
            throw new Error(`Falha ao atualizar ${key}`)
          }
        }

        await refreshBackendProfile(tokenGoogle)
      } catch {
        toast({
          title: "Erro ao atualizar perfil",
          description: "Nao foi possivel salvar bio, estilo ou redes sociais agora.",
          variant: "destructive",
        })
        return
      } finally {
        setIsSavingProfile(false)
      }
    }

    let updatedCoverUrl = nextOverrides.coverUrl
    if (draftCoverFile) {
      setIsUploadingCover(true)
      try {
        const formData = new FormData()
        formData.append("TokenGoogle", tokenGoogle)
        formData.append("FotoPerfil", draftCoverFile)
        formData.append("fotoPerfilEnum", "2")

        const response = await fetch(API_ROUTES.Usuario.atualizarFotoUsuario, {
          method: "PATCH",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Falha ao atualizar a capa.")
        }

        await refreshBackendProfile(tokenGoogle)
        updatedCoverUrl = undefined
        toast({
          title: "Capa atualizada",
          description: "Sua nova imagem ja aparece no perfil.",
        })
      } catch {
        toast({
          title: "Erro ao atualizar",
          description: "Nao foi possivel enviar a capa agora.",
          variant: "destructive",
        })
        return
      } finally {
        setIsUploadingCover(false)
      }
    }

    const nextOverridesWithCover = {
      ...nextOverrides,
      coverUrl: updatedCoverUrl,
    }
    setProfileOverrides(nextOverridesWithCover)
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

  const profileHasChanges =
    Boolean(profileDraft && profileDraftInitial) &&
    (
      normalizeDraftValue(profileDraft!.displayName) !==
      normalizeDraftValue(profileDraftInitial!.displayName) ||
      normalizeDraftValue(profileDraft!.bio) !== normalizeDraftValue(profileDraftInitial!.bio) ||
      normalizeDraftValue(profileDraft!.pronounsBadge) !==
      normalizeDraftValue(profileDraftInitial!.pronounsBadge) ||
      normalizeDraftValue(profileDraft!.roleBadge) !==
      normalizeDraftValue(profileDraftInitial!.roleBadge) ||
      normalizeDraftValue(profileDraft!.deliveryBadge) !==
      normalizeDraftValue(profileDraftInitial!.deliveryBadge) ||
      normalizeDraftValue(profileDraft!.styleDescription) !==
      normalizeDraftValue(profileDraftInitial!.styleDescription) ||
      normalizeTagsForCompare(profileDraft!.styleTags) !==
      normalizeTagsForCompare(profileDraftInitial!.styleTags) ||
      Object.entries(profileDraft!.socialLinks).some(([key, value]) => {
        const current = profileDraftInitial!.socialLinks[key as SocialLinkKey] ?? ""
        return normalizeSocialHandle(value) !== normalizeSocialHandle(current)
      }) ||
      Boolean(draftCoverFile)
    )

  const backendPosts: PortfolioPost[] = (backendProfile?.portfolioItens ?? []).reduce(
    (acc, item, index) => {
      const titulo = item.titulo?.trim() ? item.titulo : "Post do portfolio"
      const descricao = item.descricao?.trim() ? item.descricao : ""
      const orderedImages = (item.imagens ?? [])
        .slice()
        .sort((a, b) => {
          const aPrincipal = a.principal ? 1 : 0
          const bPrincipal = b.principal ? 1 : 0
          if (aPrincipal !== bPrincipal) return bPrincipal - aPrincipal
          return (a.ordem ?? 0) - (b.ordem ?? 0)
        })
        .map((image) => image.urlArquivo?.trim() ?? "")
        .filter(Boolean)
      const images =
        orderedImages.length > 0
          ? orderedImages
          : [item.urlArquivo?.trim() ?? ""].filter(Boolean)
      if (images.length === 0) return acc
      const tags = (item.hashtags ?? []).filter(Boolean)
      const popularidade = item.visualizacaoCount ?? item.likeCount ?? 0
      acc.push({
        id: item.id ? `portfolio-${item.id}` : `portfolio-${index}`,
        titulo,
        descricao,
        tags,
        images,
        popularidade,
        likes: item.likeCount ?? 0,
        saves: item.favoritoCount ?? 0,
        createdAt: item.dataCriacao ?? undefined,
        backendId: item.id,
      })
      return acc
    },
    [] as PortfolioPost[]
  )

  const activePriceSheets: ServiceSheet[] = [
    ...addedServices,
  ]
  const portfolioServiceOptions = activePriceSheets.map((sheet, index) => ({
    id: sheet.id,
    index: index + 1,
    label: `${index + 1} - ${sheet.titulo}`,
    priceLabel: sheet.preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
  }))
  const visiblePosts = backendPosts
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
  const remainingPortfolioHashtags = portfolioHashtagsLimit - portfolioHashtags.length
  const parsedServicePrice = Number.parseFloat(servicePrice.replace(",", "."))
  const isServicePriceValid =
    Number.isFinite(parsedServicePrice) &&
    parsedServicePrice > 0 &&
    parsedServicePrice <= 99999
  const serviceTitleLimit = 50
  const serviceTextLimit = 1000
  const remainingServiceTitleChars = serviceTitleLimit - serviceTitle.length
  const remainingServiceDescChars = serviceTextLimit - serviceDescription.length
  const remainingServiceTermsChars = serviceTextLimit - serviceTerms.length
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
    if (sheet.images && sheet.images.length > 0) {
      return sheet.images
    }
    if (sheet.imageUrl) {
      return [sheet.imageUrl]
    }
    return []
  })

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

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
        body: JSON.stringify({ tokenGoogle }),
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
    setPortfolioImages([])
    setPortfolioHashtags([])
    setPortfolioTagInput("#")
    setPortfolioServiceId("none")
  }

  const normalizePortfolioTag = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return null
    const withoutPrefix = trimmed.replace(/^#+/, "").trim()
    if (!withoutPrefix) return null
    return `#${withoutPrefix.slice(0, portfolioHashtagLengthLimit)}`
  }

  const addPortfolioTags = (rawTags: string[]) => {
    setPortfolioHashtags((prev) => {
      const existing = new Set(prev.map((tag) => tag.toLowerCase()))
      const next = [...prev]
      rawTags.forEach((raw) => {
        if (next.length >= portfolioHashtagsLimit) return
        const normalized = normalizePortfolioTag(raw)
        if (!normalized) return
        const key = normalized.toLowerCase()
        if (existing.has(key)) return
        existing.add(key)
        next.push(normalized)
      })
      return next
    })
  }

  const ensurePortfolioTagPrefix = (value: string) =>
    value.startsWith("#") ? value : `#${value}`

  const clampPortfolioTagInput = (value: string) => {
    const prefixed = ensurePortfolioTagPrefix(value)
    const withoutPrefix = prefixed.replace(/^#+/, "")
    return `#${withoutPrefix.slice(0, portfolioHashtagLengthLimit)}`
  }

  const handlePortfolioTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (!value) {
      setPortfolioTagInput("#")
      return
    }
    if (value.includes(" ")) {
      const parts = value.split(/\s+/)
      const tail = parts.pop() ?? ""
      addPortfolioTags(parts)
      setPortfolioTagInput(tail ? clampPortfolioTagInput(tail) : "#")
      return
    }
    setPortfolioTagInput(clampPortfolioTagInput(value))
  }

  const handlePortfolioTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addPortfolioTags([portfolioTagInput])
      setPortfolioTagInput("#")
    }
  }

  const handlePortfolioTagBlur = () => {
    addPortfolioTags([portfolioTagInput])
    setPortfolioTagInput("#")
  }

  const handleRemovePortfolioTag = (tagToRemove: string) => {
    setPortfolioHashtags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleRemovePortfolioImage = (index: number) => {
    setPortfolioImages((prev) => prev.filter((_, current) => current !== index))
  }

  const handleMovePortfolioImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setPortfolioImages((prev) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex >= prev.length
      ) {
        return prev
      }
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const resetServiceDialog = () => {
    setServiceTitle("")
    setServicePrice("")
    setServiceDescription("")
    setServiceTerms("")
    setServiceImages([])
    setServicePreviewUrls([])
    setServiceDragIndex(null)
    setServiceDragOverIndex(null)
  }

  const handleServiceImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    setServiceImages(files)
  }

  const handleRemoveServiceImage = (index: number) => {
    setServiceImages((prev) => prev.filter((_, current) => current !== index))
  }

  const handleMoveServiceImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setServiceImages((prev) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex >= prev.length
      ) {
        return prev
      }
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const handlePortfolioImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    setPortfolioImages(files)
  }

  const refreshBackendProfile = async (tokenGoogle: string) => {
    const response = await fetch(API_ROUTES.Usuario.obterUsuarioPorToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenGoogle }),
    })
    if (!response.ok) return
    const body = await response.json().catch(() => null)
    const resultado = body?.resultado ?? body?.Resultado
    if (!resultado || typeof resultado !== "object") return
    applyUserFromTokenResponse(resultado as Record<string, unknown>)
  }

  const handleServiceSubmit = () => {
    if (serviceImages.length === 0) return
    const priceValue = Number.parseFloat(servicePrice.replace(",", "."))
    if (!Number.isFinite(priceValue) || priceValue <= 0) return

    const title = serviceTitle.trim().slice(0, serviceTitleLimit) || "Novo servico"
    const description =
      serviceDescription.trim().slice(0, serviceTextLimit) || "Servico personalizado."
    const terms = serviceTerms.trim().slice(0, serviceTextLimit) || undefined
    const imageUrls = serviceImages.map((file) => URL.createObjectURL(file))
    const newService: ServiceSheet = {
      id: `local-service-${Date.now()}`,
      titulo: title,
      preco: priceValue,
      descricao: description,
      termos: terms,
      imageUrl: imageUrls[0],
      images: imageUrls,
    }

    setAddedServices((prev) => [newService, ...prev])
    setIsAddServiceOpen(false)
    resetServiceDialog()
  }

  const handlePortfolioSubmit = async () => {
    if (
      !portfolioTitle.trim() ||
      portfolioImages.length === 0 ||
      portfolioHashtags.length === 0 ||
      portfolioHashtags.length > portfolioHashtagsLimit
    ) {
      toast({
        title: "Campos obrigatorios",
        description: `Preencha titulo, hashtags e imagens. Maximo de ${portfolioHashtagsLimit} hashtags.`,
        variant: "destructive",
      })
      return
    }
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
      portfolioImages.forEach((file) => {
        formData.append("Imagens", file)
      })
      portfolioHashtags.forEach((tag) => {
        formData.append("Hashtags", tag)
      })
      if (portfolioTitle.trim()) {
        formData.append("Titulo", portfolioTitle.trim())
      }
      if (portfolioDescription.trim()) {
        formData.append("Descricao", portfolioDescription.trim())
      }
      if (portfolioServiceId !== "none") {
        const selectedService = portfolioServiceOptions.find(
          (option) => option.id === portfolioServiceId
        )
        formData.append("ServicoId", portfolioServiceId)
        if (selectedService) {
          formData.append("ServicoNumero", String(selectedService.index))
        }
      }

      const response = await fetch(API_ROUTES.Usuario.cadastrarPortfolio, {
        method: "POST",
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

    const isLiked = Boolean(likedPosts[post.id])
    setLikedPosts((prev) => ({ ...prev, [post.id]: !isLiked }))
    setPostMetrics((prev) => ({
      ...prev,
      [post.id]: {
        likes: (prev[post.id]?.likes ?? post.likes) + (isLiked ? -1 : 1),
        saves: prev[post.id]?.saves ?? post.saves,
      },
    }))
    triggerPulse(setPulseLikeId, post.id)

    try {
      const response = await fetch(isLiked ? API_ROUTES.Interacao.descurtir : API_ROUTES.Interacao.curtir, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleToken: tokenGoogle,
          alvoId: post.backendId,
          tipoAlvoInteracao: 1,
        }),
      })
      if (!response.ok) throw new Error("Falha ao curtir.")
    } catch {
      setLikedPosts((prev) => ({ ...prev, [post.id]: isLiked }))
      setPostMetrics((prev) => ({
        ...prev,
        [post.id]: {
          likes: Math.max(0, (prev[post.id]?.likes ?? post.likes) + (isLiked ? 1 : -1)),
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
        isSaved ? API_ROUTES.Interacao.removerSalvamento : API_ROUTES.Interacao.salvar,
        {
          method: isSaved ? "DELETE" : "POST",
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

  const showLoadingOverlay = isProfileLoading

  return (
    <section className="relative min-h-[calc(100svh-4rem)] w-full px-6 py-6">
      {showLoadingOverlay ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="rounded-xl bg-black/70 px-6 py-4 text-sm font-semibold text-white shadow-lg">
            Carregando...
          </div>
        </div>
      ) : null}
      <div className={`space-y-6 ${showLoadingOverlay ? "pointer-events-none blur-sm" : ""}`}>
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
                {canEditProfile ? (
                  <button
                    type="button"
                    className="group flex min-h-[220px] w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-500/60 bg-card/40 text-muted-foreground transition hover:border-zinc-700/70 hover:text-foreground dark:border-border/60 dark:hover:border-foreground/40"
                    onClick={() => setIsAddServiceOpen(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-zinc-500/60 text-3xl font-semibold dark:border-border/60">
                        +
                      </div>
                      <span className="text-sm font-semibold">
                        Adicionar servi?o
                      </span>
                    </div>
                  </button>
                ) : null}
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
            ) : canEditProfile ? (
              <div className="space-y-4">
                <button
                  type="button"
                  className="group flex min-h-[220px] w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-500/60 bg-card/40 text-muted-foreground transition hover:border-zinc-700/70 hover:text-foreground dark:border-border/60 dark:hover:border-foreground/40"
                  onClick={() => setIsAddServiceOpen(true)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-zinc-500/60 text-3xl font-semibold dark:border-border/60">
                      +
                    </div>
                    <span className="text-sm font-semibold">
                      Adicionar servi?o
                    </span>
                  </div>
                </button>
                <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-6 text-center text-sm text-muted-foreground">
                  Nenhum servi?o cadastrado ainda.
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-6 text-center text-sm text-muted-foreground">
                Nenhum servi?o cadastrado ainda.
              </div>
            )
          ) : (
            sortedPosts.length > 0 || canEditProfile ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {canEditProfile && (
                  <button
                    type="button"
                    className="group flex aspect-[4/3] cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-500/60 bg-card/40 text-muted-foreground transition hover:border-zinc-700/70 hover:text-foreground dark:border-border/60 dark:hover:border-foreground/40"
                    onClick={() => setIsAddPortfolioOpen(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-zinc-500/60 text-3xl font-semibold dark:border-border/60">
                        +
                      </div>
                      <span className="text-sm font-semibold">
                        Adicionar imagem
                      </span>
                    </div>
                  </button>
                )}
                {sortedPosts.map((post, index) => {
                  const metrics = resolveMetrics(post)
                  return (
                  <div key={post.id} className="group relative">
                    <PortfolioPreviewCard
                      post={post}
                      onOpen={() => {
                        setActivePostIndex(index)
                        setActiveImageIndex(0)
                        setPostDialogOpen(true)
                      }}
                    />
                    <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                      <Heart
                        className={`h-3 w-3 ${likedPosts[post.id] ? "fill-red-500 text-red-500" : "text-white/80"}`}
                      />
                      <span>{metrics.likes.toLocaleString("pt-BR")}</span>
                    </div>
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
                )})}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-6 text-center text-sm text-muted-foreground">
                Nenhum post no portf?lio ainda.
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
                {canEditProfile && (
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
              Redes sociais
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="icon-sm"
                  aria-label={link.name}
                  onClick={() => {
                    const href = link.handle ? buildSocialHref(link.key, link.handle) : ""
                    if (!href) return
                    window.open(href, "_blank", "noreferrer")
                  }}
                >
                  <link.icon className="h-4 w-4" />
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
              <div className="flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-y-auto pb-12 pr-2">
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
                  <p className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm text-muted-foreground">
                    {clampedDescription}
                  </p>
                  {activePost?.createdAt ? (
                    <div className="flex justify-end">
                      <span className="text-xs text-muted-foreground">
                        {formatPostDate(activePost.createdAt)}
                      </span>
                    </div>
                  ) : null}
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
                      className={`h-4 w-4 transition-transform ${likedPosts[activePost?.id ?? ""] ? "fill-red-500 text-red-500" : ""
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
                      className={`h-4 w-4 transition-transform ${savedPosts[activePost?.id ?? ""] ? "fill-sky-500 text-sky-500" : ""
                        } ${pulseSaveId === activePost?.id ? "scale-110" : ""}`}
                    />
                    <span className="text-xs font-semibold">
                      {resolveMetrics(activePost).saves.toLocaleString("pt-BR")}
                    </span>
                  </Button>
                </div>
              </div>

              <div
                className={`flex h-full flex-col space-y-3 ${isSingleImagePost
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
                        className={`overflow-hidden rounded-lg border ${index === activeImageIndex
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
        <DialogContent className="w-[96vw] max-w-4xl overflow-hidden border border-border bg-background p-0 text-foreground shadow-xl">
          <div className="flex h-[86vh] flex-col">
            <DialogHeader className="border-b border-border px-6 py-4">
              <DialogTitle>Editar perfil</DialogTitle>
              <DialogDescription>
                Atualize os dados visiveis do seu perfil.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {profileDraft ? (
                <div className="space-y-8">
                  <section className="space-y-4">
                    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                      <div className="relative aspect-[16/7] w-full">
                        {profileDraft.coverUrl ? (
                          <img
                            src={profileDraft.coverUrl}
                            alt="Preview da capa"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                            Sem capa
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute right-4 top-4 flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="gap-2"
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
                          <Avatar className="h-40 w-40 border-4 border-background">
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
                            className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
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
                        <Label className="text-muted-foreground">
                          Capa do perfil
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Use o botao \"Editar capa\" para trocar a imagem.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">
                          Foto de perfil
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Use o botao sobre o avatar para trocar a imagem.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="text-sm font-semibold uppercase text-muted-foreground">
                      Identidade
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="profile-display-name" className="text-muted-foreground">
                          Nome de exibicao
                        </Label>
                        <Input
                          id="profile-display-name"
                          value={profileDraft.displayName}
                          onChange={(event) =>
                            updateDraft({ displayName: event.target.value })
                          }
                          className="bg-background/60"
                          placeholder="Ex: Camila Araujo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-pronouns" className="text-muted-foreground">
                          Pronomes
                        </Label>
                        <Select
                          value={profileDraft.pronounsBadge}
                          onValueChange={(value) => updateDraft({ pronounsBadge: value })}
                        >
                          <SelectTrigger
                            id="profile-pronouns"
                            className="bg-background/60"
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
                        <Label htmlFor="profile-role" className="text-muted-foreground">
                          Cargo
                        </Label>
                        <Select
                          value={profileDraft.roleBadge}
                          onValueChange={(value) => updateDraft({ roleBadge: value })}
                        >
                          <SelectTrigger
                            id="profile-role"
                            className="bg-background/60"
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
                        <Label htmlFor="profile-delivery" className="text-muted-foreground">
                          Prazo medio de entrega
                        </Label>
                        <Select
                          value={profileDraft.deliveryBadge}
                          onValueChange={(value) => updateDraft({ deliveryBadge: value })}
                        >
                          <SelectTrigger
                            id="profile-delivery"
                            className="bg-background/60"
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
                    <div className="text-sm font-semibold uppercase text-muted-foreground">
                      Bio e estilo
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-bio" className="text-muted-foreground">
                        Bio
                      </Label>
                      <Textarea
                        id="profile-bio"
                        value={profileDraft.bio}
                        onChange={(event) => updateDraft({ bio: event.target.value })}
                        rows={4}
                        className="bg-background/60"
                        placeholder="Conte um pouco sobre voce e o seu trabalho."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-style" className="text-muted-foreground">
                        Sobre o estilo
                      </Label>
                      <Textarea
                        id="profile-style"
                        value={profileDraft.styleDescription}
                        onChange={(event) =>
                          updateDraft({ styleDescription: event.target.value })
                        }
                        rows={4}
                        className="bg-background/60"
                        placeholder="Descreva sua abordagem, tecnicas e referencias."
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="profile-style-tags" className="text-muted-foreground">
                          Tags de estilo
                        </Label>
                        <Input
                          id="profile-style-tags"
                          value={profileDraft.styleTags}
                          onChange={(event) =>
                            updateDraft({ styleTags: event.target.value })
                          }
                          className="bg-background/60"
                          placeholder="Ex: Lineart, Cores pasteis, Chibi"
                        />
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <div className="text-sm font-semibold uppercase text-muted-foreground">
                      Redes sociais
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="profile-twitter" className="text-muted-foreground">
                          Twitter/X
                        </Label>
                        <Input
                          id="profile-twitter"
                          value={profileDraft.socialLinks.twitter}
                          onChange={(event) =>
                            updateDraftSocial("twitter", normalizeSocialHandle(event.target.value))
                          }
                          className="bg-background/60"
                          placeholder="seuusuario"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-instagram" className="text-muted-foreground">
                          Instagram
                        </Label>
                        <Input
                          id="profile-instagram"
                          value={profileDraft.socialLinks.instagram}
                          onChange={(event) =>
                            updateDraftSocial("instagram", normalizeSocialHandle(event.target.value))
                          }
                          className="bg-background/60"
                          placeholder="seuusuario"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-tiktok" className="text-muted-foreground">
                          TikTok
                        </Label>
                        <Input
                          id="profile-tiktok"
                          value={profileDraft.socialLinks.tiktok}
                          onChange={(event) =>
                            updateDraftSocial("tiktok", normalizeSocialHandle(event.target.value))
                          }
                          className="bg-background/60"
                          placeholder="seuusuario"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-youtube" className="text-muted-foreground">
                          YouTube
                        </Label>
                        <Input
                          id="profile-youtube"
                          value={profileDraft.socialLinks.youtube}
                          onChange={(event) =>
                            updateDraftSocial("youtube", normalizeSocialHandle(event.target.value))
                          }
                          className="bg-background/60"
                          placeholder="seuusuario"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-twitch" className="text-muted-foreground">
                          Twitch
                        </Label>
                        <Input
                          id="profile-twitch"
                          value={profileDraft.socialLinks.twitch}
                          onChange={(event) =>
                            updateDraftSocial("twitch", normalizeSocialHandle(event.target.value))
                          }
                          className="bg-background/60"
                          placeholder="seuusuario"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-artstation" className="text-muted-foreground">
                          ArtStation
                        </Label>
                        <Input
                          id="profile-artstation"
                          value={profileDraft.socialLinks.artstation}
                          onChange={(event) =>
                            updateDraftSocial("artstation", normalizeSocialHandle(event.target.value))
                          }
                          className="bg-background/60"
                          placeholder="seuusuario"
                        />
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}
            </div>

            <DialogFooter className="border-t border-border px-6 py-4">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`ml-auto inline-flex ${!profileHasChanges ? "cursor-pointer" : ""}`}>
                      <Button
                        className={`${!profileHasChanges ? "opacity-60" : ""}`}
                        onClick={handleProfileSave}
                        disabled={isUploadingCover || isSavingProfile || !profileHasChanges}
                      >
                        {isUploadingCover || isSavingProfile ? "Salvando..." : "Salvar"}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!profileHasChanges ? (
                    <TooltipContent>Sem alteracoes para salvar.</TooltipContent>
                  ) : null}
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="w-[94vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar serviço</DialogTitle>
            <DialogDescription>
              Crie um novo serviço com valor, descrição, termos e imagens.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label htmlFor="service-title">Titulo</Label>
              <Input
                id="service-title"
                value={serviceTitle}
                maxLength={serviceTitleLimit}
                onChange={(event) =>
                  setServiceTitle(event.target.value.slice(0, serviceTitleLimit))
                }
                placeholder="Ex: Ilustracao completa"
              />
              <p className="text-xs text-muted-foreground">
                {remainingServiceTitleChars} caracteres restantes
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-price">Valor (R$)</Label>
              <Input
                id="service-price"
                type="number"
                min="0"
                max="99999"
                step="0.01"
                value={servicePrice}
                onChange={(event) => setServicePrice(event.target.value)}
                placeholder="Ex: 350"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-description">
                Descricao (max {serviceTextLimit} caracteres)
              </Label>
              <Textarea
                id="service-description"
                value={serviceDescription}
                maxLength={serviceTextLimit}
                onChange={(event) =>
                  setServiceDescription(event.target.value.slice(0, serviceTextLimit))
                }
                rows={4}
                placeholder="Descreva o servico e o que esta incluso."
              />
              <p className="text-xs text-muted-foreground">
                {remainingServiceDescChars} caracteres restantes
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-terms">
                Termos (max {serviceTextLimit} caracteres)
              </Label>
              <Textarea
                id="service-terms"
                value={serviceTerms}
                maxLength={serviceTextLimit}
                onChange={(event) =>
                  setServiceTerms(event.target.value.slice(0, serviceTextLimit))
                }
                rows={4}
                placeholder="Ex: Prazo, revisoes, uso comercial, formatos de entrega."
              />
              <p className="text-xs text-muted-foreground">
                {remainingServiceTermsChars} caracteres restantes
              </p>
            </div>
            <div className="space-y-2">
              <Label>Imagens</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    document.getElementById("service-image-input")?.click()
                  }
                >
                  Upar imagens
                </Button>
                <span className="text-sm text-muted-foreground">
                  {serviceImages.length > 0
                    ? `${serviceImages.length} arquivo(s) selecionado(s)`
                    : "Nenhum arquivo selecionado"}
                </span>
                <Input
                  id="service-image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleServiceImageChange}
                />
              </div>
              {servicePreviewUrls.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Arraste as imagens para ordenar.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {servicePreviewUrls.map((item, index) => (
                      <div
                        key={`${item.file.name}-${item.file.lastModified}`}
                        className={`relative h-20 w-20 cursor-grab overflow-hidden rounded-lg border border-border/60 active:cursor-grabbing ${serviceDragIndex === index ? "opacity-50" : ""
                          } ${serviceDragOverIndex === index &&
                            serviceDragIndex !== null &&
                            serviceDragIndex !== index
                            ? "ring-2 ring-foreground/60"
                            : ""
                          }`}
                        draggable
                        onDragStart={(event) => {
                          setServiceDragIndex(index)
                          setServiceDragOverIndex(index)
                          event.dataTransfer.effectAllowed = "move"
                        }}
                        onDragOver={(event) => {
                          event.preventDefault()
                          event.dataTransfer.dropEffect = "move"
                          if (serviceDragOverIndex !== index) {
                            setServiceDragOverIndex(index)
                          }
                        }}
                        onDrop={(event) => {
                          event.preventDefault()
                          if (serviceDragIndex === null) return
                          handleMoveServiceImage(serviceDragIndex, index)
                          setServiceDragIndex(null)
                          setServiceDragOverIndex(null)
                        }}
                        onDragEnd={() => {
                          setServiceDragIndex(null)
                          setServiceDragOverIndex(null)
                        }}
                        aria-grabbed={serviceDragIndex === index}
                      >
                        <img
                          src={item.url}
                          alt={item.file.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/70 text-xs font-semibold text-white hover:bg-black/80"
                          onClick={() => handleRemoveServiceImage(index)}
                          aria-label="Remover imagem"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddServiceOpen(false)
                resetServiceDialog()
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleServiceSubmit}
              disabled={
                !serviceTitle.trim() ||
                !isServicePriceValid ||
                serviceImages.length === 0
              }
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddPortfolioOpen} onOpenChange={setIsAddPortfolioOpen}>
        <DialogContent className="w-[94vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar no portifolio</DialogTitle>
            <DialogDescription>
              Envie uma ou mais imagens para o seu portifolio.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label htmlFor="portfolio-title">Titulo *</Label>
              <Input
                id="portfolio-title"
                value={portfolioTitle}
                onChange={(event) =>
                  setPortfolioTitle(event.target.value.slice(0, portfolioTitleLimit))
                }
                placeholder="Ex: Cenario ilustrado"
                required
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
              <Label htmlFor="portfolio-service">Vincular a um servico</Label>
              <Select
                value={portfolioServiceId}
                onValueChange={(value) => setPortfolioServiceId(value)}
              >
                <SelectTrigger
                  id="portfolio-service"
                  className="bg-transparent border-input dark:bg-input/30"
                >
                  <SelectValue placeholder="Selecione um servico (opcional)" />
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="none">Sem vinculo</SelectItem>
                  {portfolioServiceOptions.length > 0 ? (
                    portfolioServiceOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label} • {option.priceLabel}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-services" disabled>
                      Nenhum servico cadastrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Selecione o servico que este post representa para criar o link.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio-hashtags">Hashtags *</Label>
              <Input
                id="portfolio-hashtags"
                value={portfolioTagInput}
                onChange={handlePortfolioTagInputChange}
                onKeyDown={handlePortfolioTagKeyDown}
                onBlur={handlePortfolioTagBlur}
                placeholder="#ilustracao #anime"
                maxLength={portfolioHashtagLengthLimit + 1}
                disabled={portfolioHashtags.length >= portfolioHashtagsLimit}
                required
              />
              <p className="text-xs text-muted-foreground">
                Separe com espaco. Max {portfolioHashtagsLimit} hashtags, ate {portfolioHashtagLengthLimit} caracteres cada.
              </p>
              <p className="text-xs text-muted-foreground">
                {remainingPortfolioHashtags} hashtag(s) restante(s)
              </p>
              {portfolioHashtags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {portfolioHashtags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleRemovePortfolioTag(tag)}
                      className="flex items-center gap-2 rounded-full border border-foreground/20 px-3 py-1 text-xs text-foreground/80 hover:border-foreground/40"
                      aria-label={`Remover ${tag}`}
                    >
                      <span>{tag}</span>
                      <span className="text-[10px] font-semibold leading-none text-foreground/60">
                        x
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Imagens *</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    document.getElementById("portfolio-image-input")?.click()
                  }
                >
                  Upar imagens
                </Button>
                <span className="text-sm text-muted-foreground">
                  {portfolioImages.length > 0
                    ? `${portfolioImages.length} arquivo(s) selecionado(s)`
                    : "Nenhum arquivo selecionado"}
                </span>
                <Input
                  id="portfolio-image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePortfolioImageChange}
                  required
                />
              </div>
              {portfolioPreviewUrls.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Arraste as imagens para ordenar.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {portfolioPreviewUrls.map((item, index) => (
                      <div
                        key={`${item.file.name}-${item.file.lastModified}`}
                        className={`relative h-22 w-22 cursor-grab overflow-hidden rounded-lg border border-border/60 active:cursor-grabbing ${portfolioDragIndex === index ? "opacity-50" : ""
                          } ${portfolioDragOverIndex === index &&
                            portfolioDragIndex !== null &&
                            portfolioDragIndex !== index
                            ? "ring-2 ring-foreground/60"
                            : ""
                          }`}
                        draggable
                        onDragStart={(event) => {
                          setPortfolioDragIndex(index)
                          setPortfolioDragOverIndex(index)
                          event.dataTransfer.effectAllowed = "move"
                        }}
                        onDragOver={(event) => {
                          event.preventDefault()
                          event.dataTransfer.dropEffect = "move"
                          if (portfolioDragOverIndex !== index) {
                            setPortfolioDragOverIndex(index)
                          }
                        }}
                        onDrop={(event) => {
                          event.preventDefault()
                          if (portfolioDragIndex === null) return
                          handleMovePortfolioImage(portfolioDragIndex, index)
                          setPortfolioDragIndex(null)
                          setPortfolioDragOverIndex(null)
                        }}
                        onDragEnd={() => {
                          setPortfolioDragIndex(null)
                          setPortfolioDragOverIndex(null)
                        }}
                        aria-grabbed={portfolioDragIndex === index}
                      >
                        <img
                          src={item.url}
                          alt={item.file.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/70 text-xs font-semibold text-white hover:bg-black/80"
                          onClick={() => handleRemovePortfolioImage(index)}
                          aria-label="Remover imagem"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
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
              disabled={
                isUploadingPortfolio ||
                !portfolioTitle.trim() ||
                portfolioImages.length === 0 ||
                portfolioHashtags.length === 0 ||
                portfolioHashtags.length > portfolioHashtagsLimit
              }
            >
              {isUploadingPortfolio ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </div>
    </section>
  )
}
