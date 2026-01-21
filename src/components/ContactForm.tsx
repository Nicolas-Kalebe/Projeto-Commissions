import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  return (
    <section id="contato" className="scroll-mt-24">
      <Card className="shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle>Vamos conversar</CardTitle>
          <p className="text-sm text-muted-foreground">
            Conte sobre o seu produto e retornaremos em ate 24 horas.
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="voce@email.com" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" placeholder="Nome da empresa" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Descreva seus objetivos"
                rows={5}
              />
            </div>
            <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Ao enviar, voce concorda com nossa politica de privacidade.
              </p>
              <Button type="submit">Enviar mensagem</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
