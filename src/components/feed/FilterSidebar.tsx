import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { categoryFilters } from "@/data"
import { Input } from "@/components/ui/input"

type FilterSidebarProps = {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: FilterState) => void
}

export type FilterState = {
    priceRange: [number, number]
    sortBy: string
    categories: string[]
}

export function FilterSidebar({ isOpen, onClose, onApply }: FilterSidebarProps) {
    const [priceRange, setPriceRange] = useState<[number, number]>([50, 5000])
    const [sortBy, setSortBy] = useState("relevancia")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [categorySearch, setCategorySearch] = useState("")

    const toggleCategory = (categoryKey: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryKey)
                ? prev.filter((c) => c !== categoryKey)
                : [...prev, categoryKey]
        )
    }

    const filteredCategories = categoryFilters
        .filter((c) => c.key !== "categorias")
        .filter((c) => c.label.toLowerCase().includes(categorySearch.toLowerCase()))
        .sort((a, b) => a.label.localeCompare(b.label))

    const handleApply = () => {
        onApply({
            priceRange,
            sortBy,
            categories: selectedCategories,
        })
        onClose()
    }

    const handleClear = () => {
        setPriceRange([50, 5000])
        setSortBy("relevancia")
        setSelectedCategories([])
        setCategorySearch("")
    }

    const isDirty =
        priceRange[0] !== 50 ||
        priceRange[1] !== 5000 ||
        sortBy !== "relevancia" ||
        selectedCategories.length > 0

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Filtros de Busca</SheetTitle>
                    <SheetDescription>
                        Refine sua busca para encontrar a arte perfeita.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 space-y-8 py-6 overflow-hidden flex flex-col">
                    {/* Preço */}
                    <div className="space-y-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Faixa de Preço</Label>
                            <span className="text-sm text-muted-foreground">
                                R$ {priceRange[0]} - R$ {priceRange[1] === 5000 ? "5000+" : priceRange[1]}
                            </span>
                        </div>
                        <Slider
                            defaultValue={[50, 5000]}
                            max={5000}
                            min={50}
                            step={50}
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            className="py-2"
                        />
                    </div>

                    {/* Ordenação */}
                    <div className="space-y-2 shrink-0">
                        <Label className="text-base font-semibold">Ordenar por</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a ordem" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="relevancia">Relevância</SelectItem>
                                <SelectItem value="popularidade">Popularidade (Likes)</SelectItem>
                                <SelectItem value="recentes">Mais Recentes</SelectItem>
                                <SelectItem value="menor_preco">Menor Preço</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Categorias com Busca e Scroll */}
                    <div className="space-y-3 flex flex-col min-h-0">
                        <Label className="text-base font-semibold">Tipos de Arte</Label>
                        <Input
                            placeholder="Buscar categorias..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="h-8 text-sm"
                        />
                        <div className="min-h-0 flex-1 overflow-y-auto custom-scroll pr-3 -mr-3">
                            <div className="grid grid-cols-2 gap-3 gap-x-4 pt-2 pb-4 px-1">
                                {filteredCategories.map((category) => {
                                    const isSelected = selectedCategories.includes(category.key)
                                    return (
                                        <div
                                            key={category.key}
                                            className="flex items-start space-x-2"
                                        >
                                            <Checkbox
                                                id={category.key}
                                                checked={isSelected}
                                                onCheckedChange={() => toggleCategory(category.key)}
                                                className="mt-0.5"
                                            />
                                            <Label
                                                htmlFor={category.key}
                                                className="text-sm font-normal leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                                            >
                                                {category.label}
                                            </Label>
                                        </div>
                                    )
                                })}
                                {filteredCategories.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic w-full text-center py-4 col-span-2">
                                        Nenhuma categoria encontrada.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <SheetFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-2">
                    <Button variant="outline" type="button" onClick={handleClear} className="w-full sm:w-auto" disabled={!isDirty}>
                        Limpar
                    </Button>
                    <div className="flex flex-1 gap-2">
                        <Button variant="ghost" onClick={onClose} className="flex-1">
                            Cancelar
                        </Button>
                        <Button onClick={handleApply} className="flex-1" disabled={!isDirty}>
                            Aplicar{selectedCategories.length > 0 ? ` (${selectedCategories.length})` : ""}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
