import { useMemo, useState, type FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authService } from "@/services/authService"
import { ApiError } from "@/lib/apiClient"

interface CompleteSignupPageProps {
  onLogin: () => void
}

const validarSenha = (senha: string): string | null => {
  if (senha.length < 8 || senha.length > 20) return "Senha deve ter entre 8 e 20 caracteres."
  if (!/[A-Z]/.test(senha)) return "Senha deve ter pelo menos uma letra maiúscula."
  if (!/[^A-Za-z0-9]/.test(senha)) return "Senha deve ter pelo menos um símbolo."
  return null
}

export function CompleteSignupPage({ onLogin: _onLogin }: CompleteSignupPageProps) {
  void _onLogin
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [nomePerfil, setNomePerfil] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  const senhaErro = senha ? validarSenha(senha) : null
  const senhaCheck = {
    tamanho: senha.length >= 8 && senha.length <= 20,
    maiuscula: /[A-Z]/.test(senha),
    simbolo: /[^A-Za-z0-9]/.test(senha),
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!email || !senha || !nomePerfil || !dataNascimento) {
      setError("Preencha todos os campos obrigatórios.")
      return
    }
    const senhaInvalida = validarSenha(senha)
    if (senhaInvalida) {
      setError(senhaInvalida)
      return
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.")
      return
    }

    setSubmitting(true)
    try {
      await authService.cadastrar({
        email: email.trim(),
        senha,
        nomePerfil: nomePerfil.trim(),
        dataNascimento,
      })
      navigate(`/cadastro/confirmar?email=${encodeURIComponent(email.trim())}`)
    } catch (e) {
      const err = e as ApiError
      setError(err.message || "Não foi possível completar o cadastro.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-lg">
        <Card className="border-border/50 shadow-xl dark:bg-zinc-900/50 dark:backdrop-blur-xl">
          <CardHeader className="text-center pt-10">
            <CardTitle className="text-2xl font-bold tracking-tight">Criar conta</CardTitle>
            <CardDescription>
              Crie sua conta com e-mail e senha. Você receberá um código de 6 dígitos para confirmar.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erro no cadastro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form className="grid gap-4" onSubmit={handleSubmit}>
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
                <Label htmlFor="nomePerfil">Nome de perfil</Label>
                <Input
                  id="nomePerfil"
                  placeholder="seu_username"
                  value={nomePerfil}
                  onChange={(e) => setNomePerfil(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Este será seu @ no sistema.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataNascimento">Data de nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  max={today}
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  autoComplete="new-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <ul className="text-xs space-y-1 mt-1">
                  <li className={senhaCheck.tamanho ? "text-green-600" : "text-muted-foreground"}>
                    {senhaCheck.tamanho ? "OK" : "-"} 8 a 20 caracteres
                  </li>
                  <li className={senhaCheck.maiuscula ? "text-green-600" : "text-muted-foreground"}>
                    {senhaCheck.maiuscula ? "OK" : "-"} pelo menos 1 letra maiúscula
                  </li>
                  <li className={senhaCheck.simbolo ? "text-green-600" : "text-muted-foreground"}>
                    {senhaCheck.simbolo ? "OK" : "-"} pelo menos 1 símbolo
                  </li>
                </ul>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={submitting || !!senhaErro}>
                {submitting ? "Enviando..." : "Criar conta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-center text-sm text-muted-foreground pb-6">
            Já tem conta?&nbsp;
            <Link to="/login" className="underline hover:text-primary">
              Entrar
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
