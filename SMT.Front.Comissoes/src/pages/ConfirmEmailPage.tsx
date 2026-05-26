import { useEffect, useState, type FormEvent } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { OtpInput } from "@/components/auth/OtpInput"
import { authService } from "@/services/authService"
import { ApiError } from "@/lib/apiClient"

interface ConfirmEmailPageProps {
  onLogin: () => void
}

const COOLDOWN_SEGUNDOS = 60

export function ConfirmEmailPage({ onLogin }: ConfirmEmailPageProps) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const emailFromQuery = params.get("email") ?? ""
  const [codigo, setCodigo] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!emailFromQuery) navigate("/cadastro", { replace: true })
  }, [emailFromQuery, navigate])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setInfo(null)
    if (codigo.length !== 6) {
      setError("Digite os 6 dígitos do código.")
      return
    }
    setSubmitting(true)
    try {
      await authService.confirmarEmail({ email: emailFromQuery, codigo })
      onLogin()
      navigate("/inicio", { replace: true })
    } catch (e) {
      const err = e as ApiError
      setError(err.message || "Não foi possível confirmar o código.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReenviar = async () => {
    if (cooldown > 0) return
    setError(null)
    setInfo(null)
    setResending(true)
    try {
      await authService.reenviarCodigo(emailFromQuery)
      setInfo("Se o e-mail estiver cadastrado e pendente, um novo código foi enviado.")
      setCooldown(COOLDOWN_SEGUNDOS)
    } catch (e) {
      const err = e as ApiError
      if (err.status === 429) {
        setError("Aguarde antes de solicitar outro código.")
        setCooldown(COOLDOWN_SEGUNDOS)
      } else {
        setError(err.message || "Não foi possível reenviar o código.")
      }
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-xl dark:bg-zinc-900/50 dark:backdrop-blur-xl">
          <CardHeader className="text-center pt-10">
            <CardTitle className="text-2xl font-bold tracking-tight">Confirme seu e-mail</CardTitle>
            <CardDescription>
              Enviamos um código de 6 dígitos para <strong>{emailFromQuery}</strong>. Ele expira em 10 minutos.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {info && !error && (
              <Alert>
                <AlertTitle>OK</AlertTitle>
                <AlertDescription>{info}</AlertDescription>
              </Alert>
            )}

            <form className="grid gap-6" onSubmit={handleSubmit}>
              <OtpInput value={codigo} onChange={setCodigo} disabled={submitting} />
              <Button type="submit" disabled={submitting || codigo.length !== 6}>
                {submitting ? "Confirmando..." : "Confirmar"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              {cooldown > 0 ? (
                <span>Reenviar em {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleReenviar}
                  disabled={resending}
                  className="underline hover:text-primary disabled:opacity-50"
                >
                  {resending ? "Reenviando..." : "Reenviar código"}
                </button>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-center text-sm text-muted-foreground pb-6">
            <Link to="/cadastro" className="underline hover:text-primary">
              Voltar
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
