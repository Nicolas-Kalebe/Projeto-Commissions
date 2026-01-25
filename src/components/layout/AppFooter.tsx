import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Facebook,
    Github,
    Instagram,
    Twitter,
    Youtube,
} from "lucide-react"

export function AppFooter() {
    return (
        <footer className="w-full bg-muted/30 border-t">
            <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <div className="mb-4 flex h-[150px] w-[150px] items-center justify-center rounded-xl bg-muted/50 border-2 border-dashed border-muted-foreground/20">
                            <span className="text-sm text-muted-foreground font-semibold">LOGO 150x150</span>
                        </div>
                        <p className="max-w-xs text-sm text-muted-foreground">
                            A plataforma definitiva para artistas e criadores gerenciarem suas comissões com segurança e estilo.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                <Instagram className="h-4 w-4" />
                                <span className="sr-only">Instagram</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                <Twitter className="h-4 w-4" />
                                <span className="sr-only">Twitter</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                <Youtube className="h-4 w-4" />
                                <span className="sr-only">YouTube</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                <Facebook className="h-4 w-4" />
                                <span className="sr-only">Facebook</span>
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold">Produto</h3>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-foreground">Funcionalidades</a>
                            <a href="#" className="hover:text-foreground">Preços</a>
                            <a href="#" className="hover:text-foreground">Para Artistas</a>
                            <a href="#" className="hover:text-foreground">Para Clientes</a>
                            <a href="#" className="hover:text-foreground">Roadmap</a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold">Empresa</h3>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-foreground">Sobre nós</a>
                            <a href="#" className="hover:text-foreground">Carreiras</a>
                            <a href="#" className="hover:text-foreground">Blog</a>
                            <a href="#" className="hover:text-foreground">Contato</a>
                            <a href="#" className="hover:text-foreground">Parceiros</a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold">Legal & Suporte</h3>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-foreground">Termos de uso</a>
                            <a href="#" className="hover:text-foreground">Privacidade</a>
                            <a href="#" className="hover:text-foreground">Diretrizes</a>
                            <a href="#" className="hover:text-foreground">Central de Ajuda</a>
                            <a href="#" className="hover:text-foreground">Status</a>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        &copy; 2024 Projeto Comissões. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-sm items-center space-x-2 flex">
                            <Input type="email" placeholder="Assine nossa newsletter" className="h-9 md:w-[200px] lg:w-[300px]" />
                            <Button type="submit" size="sm">Assinar</Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
