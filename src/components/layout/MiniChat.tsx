import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { conversations, users } from "@/data"
import {
    Maximize2,
    Search
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

type MiniChatProps = {
    onClose: () => void
}

export function MiniChat({ onClose }: MiniChatProps) {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")

    const userMap = useMemo(
        () => new Map(users.map((user) => [user.id, user])),
        []
    )

    const filteredConversations = useMemo(() => {
        const term = search.trim().toLowerCase()
        if (!term) return conversations

        return conversations.filter((conversation) => {
            const user = userMap.get(conversation.userId)
            return (
                user?.nome.toLowerCase().includes(term) ||
                conversation.lastMessage.toLowerCase().includes(term)
            )
        })
    }, [search, userMap])

    const handleOpenChat = (id: string) => {
        navigate("/inbox", { state: { conversationId: id } })
        onClose()
    }

    const handleGoToInbox = () => {
        navigate("/inbox")
        onClose()
    }

    return (
        <Card className="flex flex-col h-[500px] w-[380px] shadow-xl border-border/80 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-card z-10">
                <h3 className="font-semibold text-lg">Mensagens</h3>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={handleGoToInbox}
                        title="Expandir para Inbox"
                    >
                        <Maximize2 className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                <div className="flex flex-col h-full">
                    <div className="px-4 py-2 border-b">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Buscar pessoas..."
                                className="pl-8 h-8 text-xs bg-muted/30"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="flex flex-col">
                            {filteredConversations.map((conversation) => {
                                const user = userMap.get(conversation.userId)
                                return (
                                    <button
                                        key={conversation.id}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/40 last:border-0"
                                        onClick={() => handleOpenChat(conversation.id)}
                                    >
                                        <div className="relative">
                                            <Avatar className="size-10">
                                                <AvatarImage src={user?.avatarUrl} />
                                                <AvatarFallback>{user?.nome.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            {conversation.unread > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground border-2 border-background">
                                                    {conversation.unread}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className={cn("text-sm truncate", conversation.unread > 0 ? "font-bold" : "font-semibold")}>
                                                    {user?.nome}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                    {conversation.time}
                                                </span>
                                            </div>
                                            <p className={cn("text-xs truncate", conversation.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                                                {conversation.lastMessage}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </Card>
    )
}
