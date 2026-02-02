import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

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
                "/mock_arts/anime_neon.png",
        },
        {
            title: "Artistas mais requisitados",
            description: "Descubra quem lidera os pedidos de comissoes esta semana.",
            action: "Explorar lista",
            imageUrl:
                "/mock_arts/fantasy_landscape.png",
        },
        {
            title: "Ranking de artistas",
            description: "Acompanhe o top 10 com mais seguidores e avaliacoes.",
            action: "Ver ranking",
            imageUrl:
                "/mock_arts/pixel_city.png",
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
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                                <CardContent className="relative flex h-full flex-col justify-center gap-4 p-6 md:p-10">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-white/70">
                                            Destaque
                                        </p>
                                        <h2 className="text-2xl font-semibold text-white">
                                            {banner.title}
                                        </h2>
                                        <p className="text-sm text-white/80">
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
            <CarouselPrevious
                variant="secondary"
                size="icon"
                className="left-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 transition group-hover:opacity-100 dark:bg-[oklch(0.97_0_0)] dark:text-[oklch(0.205_0_0)] dark:hover:bg-[oklch(0.93_0_0)]"
                onClick={handleBannerPrev}
            />
            <CarouselNext
                variant="secondary"
                size="icon"
                className="right-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 transition group-hover:opacity-100 dark:bg-[oklch(0.97_0_0)] dark:text-[oklch(0.205_0_0)] dark:hover:bg-[oklch(0.93_0_0)]"
                onClick={handleBannerNext}
            />
        </Carousel>
    )
}
