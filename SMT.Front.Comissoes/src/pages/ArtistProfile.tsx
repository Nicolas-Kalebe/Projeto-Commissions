import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
  Bookmark,
  Heart,
  MessageCircle,
  Star,
  Twitch,
  Twitter,
  UserPlus,
  Youtube,
} from "lucide-react"

interface ArtistProfileProps {
  onRequestCommission: (price: number) => void
}

export function ArtistProfile({ onRequestCommission }: ArtistProfileProps) {
  const [postDialogOpen, setPostDialogOpen] = useState(false)
  const [activePostIndex, setActivePostIndex] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [portfolioSort, setPortfolioSort] = useState<"recentes" | "populares">(
    "recentes"
  )
  const [showServices, setShowServices] = useState(true)
  const artist = users.find((user) => user.id === "art-1")
  const gallery = arts.filter((art) => art.artistId === "art-1")
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
  const portfolioPosts = extendedGallery.reduce<
    {
      id: string
      titulo: string
      descricao: string
      tags: string[]
      images: string[]
      popularidade: number
      likes: number
      saves: number
      commissionLink?: string
    }[]
  >((acc, art, index) => {
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
  const testSingleImagePost = {
    id: "post-test-single",
    titulo: "Teste Vertical",
    descricao:
      "Post de teste com uma unica imagem vertical para validar como a composicao se comporta no dialog. A ideia e simular um conteudo real, com contexto e detalhes suficientes para avaliar alinhamento, hierarquia e respiro do layout. O foco e garantir legibilidade em telas menores e equilibrio entre texto e imagem.",
    tags: ["#Teste", "#Vertical", "#9x16"],
    images: ["/mock_arts/test_tall_9_16.png"],
    popularidade: 999,
    likes: 4280,
    saves: 860,
    commissionLink: "/comissoes",
  }
  const following = 312
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

  const sortedPosts = [testSingleImagePost, ...portfolioPosts].sort((a, b) => {
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
              {priceSheets.map((sheet, index) => (
                <PriceSheetRow
                  key={sheet.id}
                  sheet={sheet}
                  images={serviceGalleries[index] ?? []}
                  artist={artist}
                  onRequest={onRequestCommission}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedPosts.map((post, index) => (
                <button
                  key={post.id}
                  type="button"
                  className="group relative cursor-pointer overflow-hidden rounded-xl border bg-card"
                  onClick={() => {
                    setActivePostIndex(index)
                    setActiveImageIndex(0)
                    setPostDialogOpen(true)
                  }}
                >
                  <div className="absolute bottom-3 right-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
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
                  </div>
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        src={post.images[0]}
                        alt={post.titulo}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="p-3 text-sm font-semibold text-white">
                          {post.titulo}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
        <aside className="self-start lg:sticky lg:top-8">
          <section
            className="space-y-6 p-3 lg:-mt-3 lg:min-h-[calc(100svh-14em)]"
          >

            <div className="flex flex-col items-center gap-3 text-center">
              <Avatar className="relative z-10 h-32 w-32">
                <AvatarImage src={artist.avatarUrl} alt={artist.nome} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
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
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold">
                  {artist.seguidores.toLocaleString("pt-BR")}
                </span>
                <span className="text-muted-foreground">Seguidores</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold">
                  {following.toLocaleString("pt-BR")}
                </span>
                <span className="text-muted-foreground">Seguindo</span>
              </div>
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
                {activePost?.commissionLink ? (
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
