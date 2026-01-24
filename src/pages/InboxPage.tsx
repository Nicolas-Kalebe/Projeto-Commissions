import { useMemo, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { users } from "@/data"
import {
  Bell,
  Check,
  FileText,
  Image,
  Reply,
  X,
  Search,
  Send,
  Smile,
} from "lucide-react"

type Conversation = {
  id: string
  userId: string
  lastMessage: string
  time: string
  unread: number
  status: "online" | "offline" | "ocupado"
  label?: string
}

type Message = {
  id: string
  conversationId: string
  sender: "cliente" | "artista"
  content: string
  time: string
  status?: "enviado" | "entregue" | "lido"
}

const conversations: Conversation[] = [
  {
    id: "conv-1",
    userId: "art-1",
    lastMessage: "Acabei o rascunho, posso enviar agora.",
    time: "10:42",
    unread: 2,
    status: "online",
    label: "Comissao #2841",
  },
  {
    id: "conv-2",
    userId: "cli-1",
    lastMessage: "Preciso ajustar a paleta, consigo hoje.",
    time: "Ontem",
    unread: 0,
    status: "ocupado",
    label: "Briefing atualizado",
  },
  {
    id: "conv-3",
    userId: "art-2",
    lastMessage: "Enviei o arquivo final em alta.",
    time: "Seg",
    unread: 1,
    status: "offline",
    label: "Entrega final",
  },
  {
    id: "conv-4",
    userId: "art-1",
    lastMessage: "Consigo revisar o lineart hoje a noite.",
    time: "09:12",
    unread: 0,
    status: "online",
    label: "Ajuste de pose",
  },
  {
    id: "conv-5",
    userId: "cli-1",
    lastMessage: "Pode adicionar brilho extra nos olhos?",
    time: "Ontem",
    unread: 3,
    status: "ocupado",
    label: "Detalhes finais",
  },
  {
    id: "conv-6",
    userId: "art-2",
    lastMessage: "Vou te enviar a versao com fundo escuro.",
    time: "Qui",
    unread: 0,
    status: "offline",
    label: "Variacoes",
  },
  {
    id: "conv-7",
    userId: "art-1",
    lastMessage: "Tenho agenda livre para nova comissao.",
    time: "Ter",
    unread: 1,
    status: "online",
    label: "Novo pedido",
  },
  {
    id: "conv-8",
    userId: "cli-1",
    lastMessage: "Fechado, pode seguir com a entrega.",
    time: "Seg",
    unread: 0,
    status: "offline",
    label: "Aprovado",
  },
]

const messages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    sender: "artista",
    content: "Oi! Tudo certo com o briefing que voce enviou?",
    time: "09:58",
    status: "lido",
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    sender: "cliente",
    content:
      "Sim! Quero manter o fundo mais claro e adicionar flores neon.",
    time: "10:05",
    status: "lido",
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    sender: "artista",
    content:
      "Perfeito. Vou enviar o rascunho ainda hoje para sua aprovacao.",
    time: "10:16",
    status: "lido",
  },
  {
    id: "msg-4",
    conversationId: "conv-1",
    sender: "artista",
    content: "Acabei o rascunho, posso enviar agora.",
    time: "10:42",
    status: "entregue",
  },
  {
    id: "msg-5",
    conversationId: "conv-1",
    sender: "cliente",
    content: "Pode sim! Estou online.",
    time: "10:44",
    status: "enviado",
  },
]

const statusMap = {
  online: { label: "Online", color: "bg-emerald-500" },
  offline: { label: "Offline", color: "bg-muted-foreground/40" },
  ocupado: { label: "Ocupado", color: "bg-amber-500" },
}

export function InboxPage() {
  const [search, setSearch] = useState("")
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "")
  const [inboxView, setInboxView] = useState<"all" | "unread">("all")
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const messageRef = useRef<HTMLTextAreaElement | null>(null)

  const userMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    []
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const viewFiltered =
      inboxView === "unread"
        ? conversations.filter((conversation) => conversation.unread > 0)
        : conversations
    if (!term) return viewFiltered
    return viewFiltered.filter((conversation) => {
      const user = userMap.get(conversation.userId)
      return (
        user?.nome.toLowerCase().includes(term) ||
        conversation.lastMessage.toLowerCase().includes(term) ||
        conversation.label?.toLowerCase().includes(term)
      )
    })
  }, [inboxView, search, userMap])

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ??
    conversations[0]
  const activeUser = activeConversation
    ? userMap.get(activeConversation.userId)
    : undefined
  const activeMessages = messages.filter(
    (message) => message.conversationId === activeConversation?.id
  )

  return (
    <section className="grid h-[calc(100svh-3.5rem-2rem)] gap-6 px-4 py-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="flex h-full flex-col overflow-hidden border-border/70 bg-card/90">
        <div className="space-y-3 border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Inbox
              </p>
              <h2 className="text-lg font-semibold">Mensagens</h2>
            </div>
            <div className="flex items-center rounded-full border border-border/70 bg-muted/30 p-1">
              <Button
                variant={inboxView === "all" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 rounded-full px-3 text-xs"
                onClick={() => setInboxView("all")}
              >
                Inbox
              </Button>
              <Button
                variant={inboxView === "unread" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 rounded-full px-3 text-xs"
                onClick={() => setInboxView("unread")}
              >
                Nao lidas
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar conversas"
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-3">
            {filtered.map((conversation) => {
              const user = userMap.get(conversation.userId)
              const isActive = conversation.id === activeId
              const status = statusMap[conversation.status]
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setActiveId(conversation.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    isActive
                      ? "border-primary/50 bg-primary/5"
                      : "border-transparent hover:border-border/70 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="size-10">
                          <AvatarImage src={user?.avatarUrl} alt={user?.nome} />
                          <AvatarFallback>
                            {user?.nome.slice(0, 2).toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${status.color}`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {user?.nome ?? "Usuario"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
                      <span>{conversation.time}</span>
                      {conversation.unread > 0 && (
                        <Badge className="h-5 px-2">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {conversation.label && (
                    <div className="mt-2">
                      <Badge variant="secondary">{conversation.label}</Badge>
                    </div>
                  )}
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                Nenhuma conversa encontrada.
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      <Card className="flex h-full flex-col overflow-hidden border-border/70 bg-card/95">
        <div className="border-b px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-11">
                <AvatarImage src={activeUser?.avatarUrl} alt={activeUser?.nome} />
                <AvatarFallback>
                  {activeUser?.nome.slice(0, 2).toUpperCase() ?? "US"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  {activeUser?.nome ?? "Selecionar conversa"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={`inline-flex h-2.5 w-2.5 rounded-full ${statusMap[activeConversation?.status ?? "offline"].color}`}
                  />
                  {statusMap[activeConversation?.status ?? "offline"].label}
                  <Separator orientation="vertical" className="h-3" />
                  <span>Ultima atividade: 2 min</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Detalhes">
                <FileText className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="border-b px-4 py-3 text-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">Status: Em producao</Badge>
            <Badge variant="outline">Entrega: 3 dias</Badge>
            <Badge variant="outline">Valor: R$ 320</Badge>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              Ver resumo
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-6 px-4 py-6">
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                Hoje
              </Badge>
            </div>
            {activeMessages.map((message) => {
              const isSender = message.sender === "cliente"
              return (
                <div
                  key={message.id}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div className="group relative max-w-[72%]">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className={`absolute -top-3 ${
                        isSender ? "-left-3" : "-right-3"
                      } size-7 opacity-0 shadow-sm transition hover:scale-105 group-hover:opacity-100`}
                      onClick={() => setReplyTo(message)}
                      aria-label="Responder mensagem"
                    >
                      <Reply className="size-3.5" />
                    </Button>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isSender
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/60 text-foreground"
                      } ${
                        replyTo?.id === message.id
                          ? "ring-2 ring-primary/40"
                          : ""
                      }`}
                    >
                      <p>{message.content}</p>
                      <div
                        className={`mt-2 flex items-center justify-end gap-2 text-[11px] ${
                          isSender ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        <span>{message.time}</span>
                        {message.status && (
                          <span className="inline-flex items-center gap-1">
                            {message.status === "lido" && <Check className="size-3" />}
                            {message.status === "entregue" && (
                              <Check className="size-3 opacity-80" />
                            )}
                            {message.status === "enviado" && (
                              <Check className="size-3 opacity-50" />
                            )}
                            {message.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Separator className="flex-1" />
              Artista esta digitando...
              <Separator className="flex-1" />
            </div>
          </div>
        </ScrollArea>
        <div className="border-t bg-card/80 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2 pb-3">
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
              Marcar como resolvido
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
              Salvar referencia
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
              Solicitar ajuste
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {replyTo && (
              <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
                <div className="min-w-0 border-l-2 border-primary/60 pl-2">
                  <p className="font-semibold text-foreground">
                    Respondendo a mensagem
                  </p>
                  <p className="truncate text-muted-foreground">
                    {replyTo.content}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setReplyTo(null)}
                  aria-label="Cancelar resposta"
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}
            <div className="flex items-end gap-3">
              <Textarea
                ref={messageRef}
                rows={1}
                placeholder="Digite sua mensagem"
                className="min-h-12 resize-none overflow-hidden"
                onInput={(event) => {
                  const target = event.currentTarget
                  target.style.height = "auto"
                  target.style.height = `${target.scrollHeight}px`
                }}
              />
              <Button className="h-12 w-12 p-0">
                <Send className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Button variant="ghost" size="icon" aria-label="Anexar imagem">
                <Image className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Anexar arquivo">
                <FileText className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Emojis">
                <Smile className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
