import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import {
    CarouselOverlayNext,
    CarouselOverlayPrevious,
} from "@/components/ui/carousel-overlay"

export function FeedBanner() {
    const [bannerApi, setBannerApi] = useState<CarouselApi | null>(null)
    const bannerAutoResumeAtRef = useRef(0)
    const bannerAutoResumeDelayMs = 10000
    const banners = [
        {
            title: "Desconto no Premium",
            description: "Assine hoje e ganhe 20% no plano anual para artistas.",
            action: "Ver ofertas",
            imageUrl:
                "/mock_arts/mock_1.jpg",
        },
        {
            title: "Artistas mais requisitados",
            description: "Descubra quem lidera os pedidos de comissoes esta semana.",
            action: "Explorar lista",
            imageUrl:
                "/mock_arts/mock_1.jpg",
        },
        {
            title: "Ranking de artistas",
            description: "Acompanhe o top 10 com mais seguidores e avaliacoes.",
            action: "Ver ranking",
            imageUrl:
                "/mock_arts/mock_2.jpg",
        },
    ]

    useEffect(() => {
        if (!bannerApi) return
        const intervalId = window.setInterval(() => {
            if (Date.now() < bannerAutoResumeAtRef.current) return
            bannerApi.scrollNext()
        }, 4000)
        return () => window.clearInterval(intervalId)
    }, [bannerApi])

    const handleBannerPrev = () => {
        bannerAutoResumeAtRef.current = Date.now() + bannerAutoResumeDelayMs
        bannerApi?.scrollPrev()
    }

    const handleBannerNext = () => {
        bannerAutoResumeAtRef.current = Date.now() + bannerAutoResumeDelayMs
        bannerApi?.scrollNext()
    }

    return (
        <Carousel
            opts={{ loop: true }}
            setApi={setBannerApi}
            className="group w-full"
        >
            <CarouselContent viewportClassName="rounded-xl">
                {banners.map((banner) => (
                    <CarouselItem key={banner.title} className="md:basis-full">
                        <Card className="overflow-hidden border-border/60 bg-card/95">
                            <div className="relative aspect-[16/2] w-full">
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    className="absolute inset-0 h-full w-full scale-110 object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--overlay-strong)] via-[color:var(--overlay-soft)] to-transparent" />
                                <CardContent className="relative flex h-full flex-col justify-center gap-4 p-6 md:p-10">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-[color:var(--overlay-text-muted)]">
                                            Destaque
                                        </p>
                                        <h2 className="text-2xl font-semibold text-[color:var(--overlay-text)]">
                                            {banner.title}
                                        </h2>
                                        <p className="text-sm text-[color:var(--overlay-text-muted)]">
                                            {banner.description}
                                        </p>
                                    </div>
                                    <div>
                                        <Button variant="secondary">{banner.action}</Button>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselOverlayPrevious
                variant="ghost"
                size="icon"
                className="left-4 top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100 h-9 w-9"
                onClick={handleBannerPrev}
            />
            <CarouselOverlayNext
                variant="ghost"
                size="icon"
                className="right-4 top-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100 h-9 w-9"
                onClick={handleBannerNext}
            />
        </Carousel>
    )
}
