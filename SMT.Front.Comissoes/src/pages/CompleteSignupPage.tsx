import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { API_ROUTES } from "@/constants/apiRoutes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CompleteSignupPageProps {
  onLogin: () => void
}

export function CompleteSignupPage({ onLogin }: CompleteSignupPageProps) {
  const navigate = useNavigate()
  const [nomePerfil, setNomePerfil] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tokenGoogle = localStorage.getItem("google_token") ?? ""
  const googleName = localStorage.getItem("google_name") ?? ""
  const googleEmail = localStorage.getItem("google_email") ?? ""
  const googlePhoto = localStorage.getItem("google_photo") ?? ""

  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  useEffect(() => {
    if (!tokenGoogle) {
      navigate("/login", { replace: true })
    }
  }, [navigate, tokenGoogle])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!nomePerfil.trim() || !dataNascimento || !tokenGoogle) {
      setError("Preencha todos os campos obrigatórios antes de continuar.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(API_ROUTES.Usuario.cadastrarUsuario, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomePerfil: nomePerfil.trim(),
          dataNascimento,
          tokenGoogle,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        const mensagem = body?.mensagem ?? "Nao foi possivel completar o cadastro."
        setError(mensagem)
        return
      }

      localStorage.removeItem("google_token")
      onLogin()
      navigate("/inicio", { replace: true })
    } catch {
      setError("Nao foi possivel conectar ao servidor.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-lg">
        <Card className="border-border/50 shadow-xl dark:bg-zinc-900/50 dark:backdrop-blur-xl">
          <CardHeader className="text-center pt-10">
            <div className="mx-auto mb-4 flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
              {googlePhoto ? (
                <img src={googlePhoto} alt={googleName || "Usuario"} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm text-muted-foreground font-semibold">Perfil</span>
              )}
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Finalize seu cadastro</CardTitle>
            <CardDescription>
              Informe seu nome de perfil e data de nascimento para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {(googleName || googleEmail) && (
              <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-sm">
                {googleName && <p className="font-semibold text-foreground">{googleName}</p>}
                {googleEmail && <p className="text-muted-foreground">{googleEmail}</p>}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erro no cadastro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="nomePerfil">Nome de perfil</Label>
                <Input
                  id="nomePerfil"
                  name="nomePerfil"
                  placeholder="seu_username"
                  value={nomePerfil}
                  onChange={(event) => setNomePerfil(event.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Este sera seu @ no sistema. Use algo simples e unico.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dataNascimento">Data de nascimento</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  max={today}
                  value={dataNascimento}
                  onChange={(event) => setDataNascimento(event.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Concluir cadastro"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-center text-xs text-muted-foreground pb-6">
            Ao continuar, voce confirma que os dados acima estao corretos.
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
