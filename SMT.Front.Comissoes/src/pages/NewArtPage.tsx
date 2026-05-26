import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function NewArtPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Novo projeto
        </p>
        <h1 className="text-2xl font-semibold">Criar nova arte</h1>
      </div>
      <Card className="border-border/60 bg-card/95">
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Título</p>
              <Input placeholder="Ex: Retrato futurista" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Preço base</p>
              <Input placeholder="R$ 120,00" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Categoria</p>
              <Select defaultValue="ilustracao">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ilustracao">Ilustração</SelectItem>
                  <SelectItem value="pixel">Pixel Art</SelectItem>
                  <SelectItem value="3d">3D Render</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Nível de conteúdo</p>
              <Select defaultValue="seguro">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seguro">Seguro</SelectItem>
                  <SelectItem value="sensivel">Sensível</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Descrição</p>
            <Textarea placeholder="Descreva seu projeto e referências" />
          </div>
          <Button className="w-full">Publicar arte</Button>
        </CardContent>
      </Card>
    </section>
  )
}
