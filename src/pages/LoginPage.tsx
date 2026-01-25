import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface LoginPageProps {
    onLogin: () => void
}

import { useNavigate } from "react-router-dom"

export function LoginPage({ onLogin }: LoginPageProps) {
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleLogin = (provider: string) => {
        setLoadingProvider(provider)
        console.log(`Logging in with ${provider}`)
        // Simulate network delay
        setTimeout(() => {
            onLogin()
            setLoadingProvider(null)
            navigate('/') // Redirect to home on success
        }, 1500)
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-md">
                <div className="flex flex-col gap-6">
                    <Card className="border-border/50 shadow-xl dark:bg-zinc-900/50 dark:backdrop-blur-xl">
                        <CardHeader className="text-center pt-10">
                            <div className="mx-auto mb-4 flex h-[150px] w-[150px] items-center justify-center rounded-xl bg-muted/50 border-2 border-dashed border-muted-foreground/20">
                                <span className="text-sm text-muted-foreground font-semibold">LOGO 150x150</span>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
                            <CardDescription>
                                Entre com sua conta para continuar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Button variant="outline" className="w-full relative py-5 font-semibold" onClick={() => handleLogin('google')} disabled={!!loadingProvider}>
                                    {loadingProvider === 'google' ? (
                                        <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center">
                                            <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                            </svg>
                                        </div>
                                    )}
                                    Continuar com Google
                                </Button>
                                <Button variant="outline" className="w-full relative py-5 font-semibold" onClick={() => handleLogin('microsoft')} disabled={!!loadingProvider}>
                                    {loadingProvider === 'microsoft' ? (
                                        <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center">
                                            <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="microsoft" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path fill="currentColor" d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"></path>
                                            </svg>
                                        </div>
                                    )}
                                    Continuar com Microsoft
                                </Button>
                                <Button variant="outline" className="w-full relative py-5 font-semibold" onClick={() => handleLogin('apple')} disabled={!!loadingProvider}>
                                    {loadingProvider === 'apple' ? (
                                        <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center">
                                            <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                                <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"></path>
                                            </svg>
                                        </div>
                                    )}
                                    Continuar com Apple
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center text-center text-sm text-muted-foreground pb-6">
                            Não tem uma conta?&nbsp;
                            <a href="#" className="underline hover:text-primary">
                                Cadastre-se
                            </a>
                        </CardFooter>
                    </Card>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                        Ao clicar em continuar, você concorda com nossos <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}
