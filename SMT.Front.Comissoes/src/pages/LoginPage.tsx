import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { API_ROUTES } from "@/constants/apiRoutes"

interface LoginPageProps {
    onLogin: () => void
}

import { useNavigate } from "react-router-dom"

type GoogleCredentialResponse = {
    credential?: string
}

type GoogleCredentialPayload = {
    email?: string
    picture?: string
    name?: string
}

const decodeJwtPayload = (token: string): GoogleCredentialPayload | null => {
    try {
        const payload = token.split(".")[1]
        if (!payload) return null
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
        return JSON.parse(atob(padded)) as GoogleCredentialPayload
    } catch {
        return null
    }
}

export function LoginPage({ onLogin }: LoginPageProps) {
    const navigate = useNavigate()

    const handleMockLogin = () => {
        onLogin()
        navigate("/inicio")
    }

    useEffect(() => {
    const getClientId = () =>
        document.querySelector('meta[name="google-signin-client_id"]')?.getAttribute("content") || "";

    const renderGoogleButton = () => {
        const google = (window as any).google;
        // Se o google ou o accounts ainda não existem, paramos aqui
        if (!google?.accounts?.id) return;

        const clientId = getClientId();
        const container = document.getElementById("google-signin");
        
        if (!container || container.childElementCount > 0) return;

        google.accounts.id.initialize({
            client_id: clientId,
            use_fedcm_for_prompt: false, // Ajuda a silenciar aquele erro 403
            callback: async (response: GoogleCredentialResponse) => {
                if (response?.credential) {
                    await fetch(API_ROUTES.Auth.validarTokenGoogle, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tokenGoogle: response.credential }),
                    })
                    const payload = decodeJwtPayload(response.credential);
                    if (payload?.email) localStorage.setItem("google_email", payload.email);
                    if (payload?.picture) localStorage.setItem("google_photo", payload.picture);
                    if (payload?.name) localStorage.setItem("google_name", payload.name);
                }
                onLogin();
                navigate("/inicio");
            },
        });

        google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            width: 320,
        });
    };

    // 1. Tenta renderizar imediatamente (caso o script já tenha carregado)
    renderGoogleButton();

    // 2. Se o script ainda não carregou, adicionamos um listener para quando ele carregar
    const script = document.getElementById("google-gsi");
    if (script) {
        script.addEventListener("load", renderGoogleButton);
    }

    return () => {
        if (script) {
            script.removeEventListener("load", renderGoogleButton);
        }
    };
}, [navigate, onLogin]);

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
                                <div className="flex justify-center">
                                    <div id="google-signin"></div>
                                </div>
                                <Button variant="secondary" onClick={handleMockLogin}>
                                    Entrar com usuário de teste
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
