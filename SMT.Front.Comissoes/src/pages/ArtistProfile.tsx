import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  commissionLink?: string
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
  const { toast } = useToast()
  const fallbackArtist = users.find((user) => user.id === "art-1")
  const artist = !isMockUser && currentUser ? currentUser : fallbackArtist
  const isOwnerProfile = Boolean(!isMockUser && currentUser?.id && artist?.id && currentUser.id === artist.id)
  const gallery = !isMockUser && currentUser
    ? arts.filter((art) => art.artistId === currentUser.id)
    : arts.filter((art) => art.artistId === "art-1")
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
    },
  ]
  const rating = 4.8
  if (!artist) {
    return null
  }

  const initials = artist.nome
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
  const handle = `@${artist.nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")}`

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/",
      icon: Twitter,
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/",
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
          <path d="M15.5 3.5c.6 1.6 1.9 2.8 3.5 3.2v3.1c-1.5 0-2.9-.5-4-1.3v5.2a4.9 4.9 0 1 1-4.9-4.9c.4 0 .8 0 1.2.1v3.2a1.8 1.8 0 1 0 1.5 1.8V3.5h2.7z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/",
      icon: Youtube,
    },
    {
      name: "Twitch",
      href: "https://www.twitch.tv/",
      icon: Twitch,
    },
  ]

  const sortedPosts = [
    testSingleImagePost,
    ...testPortfolioPosts,
    ...portfolioPosts,
  ].sort((a, b) => {
    if (portfolioSort === "populares") {
      return b.popularidade - a.popularidade
    }

    return 0
  })
  const activePost = sortedPosts[activePostIndex]
  const isSingleImagePost = (activePost?.images?.length ?? 0) <= 1
  const descriptionLimit = 300
  const descriptionText = activePost?.descricao ?? ""
  const clampedDescription =
    descriptionText.length > descriptionLimit
      ? `${descriptionText.slice(0, descriptionLimit).trim()}...`
      : descriptionText
  const serviceGalleries = priceSheets.map((sheet, index) => {
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

  return (
    <section className="min-h-[calc(100svh-4rem)] w-full space-y-6 px-6 py-6">
      <div className="h-52 w-full overflow-hidden rounded-2xl md:h-64">
        <img
          src="/mock_arts/test_wide_16_9.png"
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
            <div className="space-y-4">
              {priceSheets.map((sheet, index) =>
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                    {isOwnerProfile ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        aria-label="Editar post"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    ) : (
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
          )}
        </section>
        <aside className="self-start lg:sticky lg:top-8">
          <section
            className="space-y-6 p-3 lg:-mt-3 lg:min-h-[calc(100svh-14em)]"
          >

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <Avatar className="relative z-10 h-32 w-32">
                  <AvatarImage src={artist.avatarUrl} alt={artist.nome} />
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
                <h2 className="text-2xl font-semibold">{artist.nome}</h2>
                <p className="text-sm text-muted-foreground">{handle}</p>
              </div>
              <p className="text-sm text-muted-foreground">{artist.bio}</p>
            </div>
            <div className="flex w-full flex-wrap justify-center gap-2">
              <Badge variant="secondary">
                Ela/dela
              </Badge>
              <Badge variant="secondary">
                Ilustradora
              </Badge>
              <Badge variant="secondary">
                Entrega em 7 dias
              </Badge>
              <Badge variant="secondary">
                Ativo hoje
              </Badge>
            </div>
            <div className="flex gap-2">
              {isOwnerProfile ? (
                <>
                  <Button className="flex-1 gap-2 px-4">
                    <Pencil className="h-4 w-4" />
                    Editar perfil
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 gap-2"
                    aria-label="Editar posts"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar posts
                  </Button>
                </>
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
                  {artist.seguidores.toLocaleString("pt-BR")}
                </span>
                <span className="text-muted-foreground">Seguidores</span>
              </div>
              {!isOwnerProfile && (
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-semibold">312</span>
                  <span className="text-muted-foreground">Seguindo</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">
                  {rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-3.5 w-2.5 ${index < Math.round(rating)
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
                Traço leve com foco em expressões, paleta suave e detalhes
                delicados para personagens e cenas.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Lineart suave</Badge>
                <Badge variant="secondary">Cores pasteis</Badge>
                <Badge variant="secondary">Chibi</Badge>
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
                      <AvatarImage src={artist.avatarUrl} alt={artist.nome} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{artist.nome}</p>
                      <p className="text-xs text-muted-foreground">{handle}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-3xl font-semibold">
                    {activePost?.titulo ?? "Post do portifolio"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {clampedDescription}
                  </p>
                </div>
                {isOwnerProfile ? (
                  <>
                    <Separator />
                    <Button
                      variant="secondary"
                      className="inline-flex self-start items-center justify-start gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar post
                    </Button>
                  </>
                ) : activePost?.commissionLink ? (
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
                {!isOwnerProfile && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs font-semibold">
                          {(activePost?.likes ?? 0).toLocaleString("pt-BR")}
                        </span>
                      </Button>
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Bookmark className="h-4 w-4" />
                        <span className="text-xs font-semibold">
                          {(activePost?.saves ?? 0).toLocaleString("pt-BR")}
                        </span>
                      </Button>
                    </div>
                  </>
                )}
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

    </section>
  )
}
