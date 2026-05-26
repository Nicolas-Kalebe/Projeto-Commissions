import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState, type FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authService } from "@/services/authService"
import { ApiError } from "@/lib/apiClient"

interface LoginPageProps {
  onLogin: () => void
}

type GoogleCredentialResponse = { credential?: string }
type GoogleAccountsId = {
  initialize: (config: {
    client_id: string
    use_fedcm_for_prompt?: boolean
    callback: (response: GoogleCredentialResponse) => void | Promise<void>
  }) => void
  renderButton: (parent: HTMLElement, options: { theme: string; size: string; width: number }) => void
}
type GoogleClient = { accounts?: { id?: GoogleAccountsId } }

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmitLocal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authService.loginLocal({ email: email.trim(), senha })
      onLogin()
      navigate("/inicio", { replace: true })
    } catch (e) {
      const err = e as ApiError
      if (err.status === 403 && err.codigo === "E0006") {
        setError("E-mail ainda não confirmado. Verifique sua caixa de entrada ou solicite um novo código.")
      } else {
        setError(err.message || "Não foi possível autenticar.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const getClientId = () =>
      document.querySelector('meta[name="google-signin-client_id"]')?.getAttribute("content") || ""

    const renderGoogleButton = () => {
      const google = (window as Window & { google?: GoogleClient }).google
      if (!google?.accounts?.id) return
      const container = document.getElementById("google-signin")
      if (!container || container.childElementCount > 0) return

      google.accounts.id.initialize({
        client_id: getClientId(),
        use_fedcm_for_prompt: false,
        callback: async (response: GoogleCredentialResponse) => {
          if (!response?.credential) return
          try {
            await authService.loginGoogle(response.credential)
            onLogin()
            navigate("/inicio", { replace: true })
          } catch (e) {
            const err = e as ApiError
            setError(err.message || "Não foi possível autenticar com Google.")
          }
        },
      })

      google.accounts.id.renderButton(container, { theme: "outline", size: "large", width: 320 })
    }

    renderGoogleButton()
    const script = document.getElementById("google-gsi")
    if (script) script.addEventListener("load", renderGoogleButton)
    return () => {
      if (script) script.removeEventListener("load", renderGoogleButton)
    }
  }, [navigate, onLogin])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <Card className="border-border/50 shadow-xl dark:bg-zinc-900/50 dark:backdrop-blur-xl">
          <CardHeader className="text-center pt-10">
            <div className="mx-auto mb-4 flex h-[150px] w-[150px] items-center justify-center rounded-xl bg-muted/50 border border-muted-foreground/10 p-4">
              <img src="/logo-korart.svg" alt="Logo Korart" className="h-full w-full object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
            <CardDescription>Entre com sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form className="grid gap-3" onSubmit={handleSubmitLocal}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div id="google-signin"></div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-center text-sm text-muted-foreground pb-6">
            Não tem uma conta?&nbsp;
            <Link to="/cadastro" className="underline hover:text-primary">
              Cadastre-se
            </Link>
          </CardFooter>
        </Card>
        <div className="mt-4 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>.
        </div>
      </div>
    </div>
  )
}
