import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { categoryFilters } from "@/data"

type FeedCategoriesProps = {
    activeCategory: string
    onCategoryChange: (category: string) => void
}

export function FeedCategories({ activeCategory, onCategoryChange }: FeedCategoriesProps) {

    return (
        <div className="space-y-4">
            <div className="group categories-full-bleed mx-auto w-full max-w-6xl overflow-hidden">
                <Carousel opts={{ align: "start", slidesToScroll: 'auto' }} className="w-full">
                    <CarouselContent className="categories-carousel-content gap-3">
                        {categoryFilters.map((filter) => {
                            const isActive = activeCategory === filter.key
                            return (
                                <CarouselItem
                                    key={filter.key}
                                    className="categories-carousel-item basis-auto"
                                >
                                    <button
                                        type="button"
                                        className={cn(
                                            "flex shrink-0 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition",
                                            "bg-muted/40 hover:bg-muted",
                                            isActive && "border-primary/30 bg-muted text-foreground"
                                        )}
                                        onClick={() => onCategoryChange(filter.key)}
                                    >
                                        <span className="flex size-5 items-center justify-center text-foreground">
                                            <span className="material-symbols-rounded text-[16px] leading-none">
                                                {filter.icon}
                                            </span>
                                        </span>
                                        <span>{filter.label}</span>
                                    </button>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    <CarouselPrevious
                        variant="ghost"
                        size="icon-sm"
                        className="left-0 top-1/2 -translate-y-1/2 rounded-full border border-black/20 bg-black/60 text-white shadow-sm opacity-0 transition hover:bg-black/70 hover:text-white group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none disabled:opacity-0 dark:border-white/20 dark:bg-white/70 dark:text-black dark:hover:bg-white/80 dark:hover:text-black"
                    />
                    <CarouselNext
                        variant="ghost"
                        size="icon-sm"
                        className="right-0 top-1/2 -translate-y-1/2 rounded-full border border-black/20 bg-black/60 text-white shadow-sm opacity-0 transition hover:bg-black/70 hover:text-white group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none disabled:opacity-0 dark:border-white/20 dark:bg-white/70 dark:text-black dark:hover:bg-white/80 dark:hover:text-black"
                    />
                </Carousel>
            </div>
        </div>
    )
}
