import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Pencil } from "lucide-react"
import type { ProfileDraft, SocialLinkKey } from "@/types/profile"

type EditProfileDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileDraft: ProfileDraft | null
  initials: string
  profileHasChanges: boolean
  isUploadingCover: boolean
  isSavingProfile: boolean
  onSave: () => void
  onDraftCoverChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDraftAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUpdateDraft: (partial: Partial<ProfileDraft>) => void
  onUpdateDraftSocial: (key: SocialLinkKey, value: string) => void
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profileDraft,
  initials,
  profileHasChanges,
  isUploadingCover,
  isSavingProfile,
  onSave,
  onDraftCoverChange,
  onDraftAvatarChange,
  onUpdateDraft,
  onUpdateDraftSocial,
}: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-4xl overflow-hidden border border-border bg-background p-0 text-foreground shadow-xl">
        <div className="flex h-[86vh] flex-col">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Atualize os dados visiveis do seu perfil.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {profileDraft ? (
              <div className="space-y-8">
                <section className="space-y-4">
                  <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
                    <div className="relative aspect-[16/7] w-full">
                      {profileDraft.coverUrl ? (
                        <img
                          src={profileDraft.coverUrl}
                          alt="Preview da capa"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                          Sem capa
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--overlay-strong)] via-[color:var(--overlay-faint)] to-transparent" />
                      <div className="absolute right-4 top-4 flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="gap-2"
                          onClick={() =>
                            document.getElementById("draft-cover-input")?.click()
                          }
                        >
                          <Pencil className="h-4 w-4" />
                          Editar capa
                        </Button>
                        <Input
                          id="draft-cover-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onDraftCoverChange}
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-6 right-6 z-20">
                      <div className="relative">
                        <Avatar className="h-40 w-40 border-4 border-background">
                          <AvatarImage
                            src={profileDraft.avatarUrl}
                            alt={profileDraft.displayName}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="secondary"
                          className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                          onClick={() =>
                            document.getElementById("draft-avatar-input")?.click()
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Input
                          id="draft-avatar-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onDraftAvatarChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 pt-10 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        Capa do perfil
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Use o botao "Editar capa" para trocar a imagem.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">
                        Foto de perfil
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Use o botao sobre o avatar para trocar a imagem.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="text-sm font-semibold uppercase text-muted-foreground">
                    Identidade
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-display-name" className="text-muted-foreground">
                        Nome de exibicao
                      </Label>
                      <Input
                        id="profile-display-name"
                        value={profileDraft.displayName}
                        onChange={(event) =>
                          onUpdateDraft({ displayName: event.target.value })
                        }
                        className="bg-background/60"
                        placeholder="Ex: Camila Araujo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-pronouns" className="text-muted-foreground">
                        Pronomes
                      </Label>
                      <Select
                        value={profileDraft.pronounsBadge}
                        onValueChange={(value) => onUpdateDraft({ pronounsBadge: value })}
                      >
                        <SelectTrigger
                          id="profile-pronouns"
                          className="bg-background/60"
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ele/dele">Ele/dele</SelectItem>
                          <SelectItem value="Ela/dela">Ela/dela</SelectItem>
                          <SelectItem value="Elu/Delu">Elu/Delu</SelectItem>
                          <SelectItem value="Prefiro não informar">
                            Prefiro não informar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-role" className="text-muted-foreground">
                        Cargo
                      </Label>
                      <Select
                        value={profileDraft.roleBadge}
                        onValueChange={(value) => onUpdateDraft({ roleBadge: value })}
                      >
                        <SelectTrigger
                          id="profile-role"
                          className="bg-background/60"
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ilustradora">Ilustradora</SelectItem>
                          <SelectItem value="Ilustrador">Ilustrador</SelectItem>
                          <SelectItem value="Designer">Designer</SelectItem>
                          <SelectItem value="Concept artist">Concept artist</SelectItem>
                          <SelectItem value="Animadora">Animadora</SelectItem>
                          <SelectItem value="Modeladora 3D">Modeladora 3D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-delivery" className="text-muted-foreground">
                        Prazo medio de entrega
                      </Label>
                      <Select
                        value={profileDraft.deliveryBadge}
                        onValueChange={(value) => onUpdateDraft({ deliveryBadge: value })}
                      >
                        <SelectTrigger
                          id="profile-delivery"
                          className="bg-background/60"
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3 dias">1-3 dias</SelectItem>
                          <SelectItem value="1 semana">1 semana</SelectItem>
                          <SelectItem value="2-3 semanas">2-3 semanas</SelectItem>
                          <SelectItem value="1 mes">1 mes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                <Separator />

                <section className="space-y-4">
                  <div className="text-sm font-semibold uppercase text-muted-foreground">
                    Bio e estilo
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-bio" className="text-muted-foreground">
                      Bio
                    </Label>
                    <Textarea
                      id="profile-bio"
                      value={profileDraft.bio}
                      onChange={(event) => onUpdateDraft({ bio: event.target.value })}
                      rows={4}
                      className="bg-background/60"
                      placeholder="Conte um pouco sobre voce e o seu trabalho."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-style" className="text-muted-foreground">
                      Sobre o estilo
                    </Label>
                    <Textarea
                      id="profile-style"
                      value={profileDraft.styleDescription}
                      onChange={(event) =>
                        onUpdateDraft({ styleDescription: event.target.value })
                      }
                      rows={4}
                      className="bg-background/60"
                      placeholder="Descreva sua abordagem, tecnicas e referencias."
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-style-tags" className="text-muted-foreground">
                        Tags de estilo
                      </Label>
                      <Input
                        id="profile-style-tags"
                        value={profileDraft.styleTags}
                        onChange={(event) =>
                          onUpdateDraft({ styleTags: event.target.value })
                        }
                        className="bg-background/60"
                        placeholder="Ex: Lineart, Cores pasteis, Chibi"
                      />
                    </div>
                  </div>
                </section>

                <Separator />

                <section className="space-y-4">
                  <div className="text-sm font-semibold uppercase text-muted-foreground">
                    Redes sociais
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-twitter" className="text-muted-foreground">
                        Twitter/X
                      </Label>
                      <Input
                        id="profile-twitter"
                        value={profileDraft.socialLinks.twitter}
                        onChange={(event) =>
                          onUpdateDraftSocial("twitter", event.target.value)
                        }
                        className="bg-background/60"
                        placeholder="seuusuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-instagram" className="text-muted-foreground">
                        Instagram
                      </Label>
                      <Input
                        id="profile-instagram"
                        value={profileDraft.socialLinks.instagram}
                        onChange={(event) =>
                          onUpdateDraftSocial("instagram", event.target.value)
                        }
                        className="bg-background/60"
                        placeholder="seuusuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-tiktok" className="text-muted-foreground">
                        TikTok
                      </Label>
                      <Input
                        id="profile-tiktok"
                        value={profileDraft.socialLinks.tiktok}
                        onChange={(event) =>
                          onUpdateDraftSocial("tiktok", event.target.value)
                        }
                        className="bg-background/60"
                        placeholder="seuusuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-youtube" className="text-muted-foreground">
                        YouTube
                      </Label>
                      <Input
                        id="profile-youtube"
                        value={profileDraft.socialLinks.youtube}
                        onChange={(event) =>
                          onUpdateDraftSocial("youtube", event.target.value)
                        }
                        className="bg-background/60"
                        placeholder="seuusuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-twitch" className="text-muted-foreground">
                        Twitch
                      </Label>
                      <Input
                        id="profile-twitch"
                        value={profileDraft.socialLinks.twitch}
                        onChange={(event) =>
                          onUpdateDraftSocial("twitch", event.target.value)
                        }
                        className="bg-background/60"
                        placeholder="seuusuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-artstation" className="text-muted-foreground">
                        ArtStation
                      </Label>
                      <Input
                        id="profile-artstation"
                        value={profileDraft.socialLinks.artstation}
                        onChange={(event) =>
                          onUpdateDraftSocial("artstation", event.target.value)
                        }
                        className="bg-background/60"
                        placeholder="seuusuario"
                      />
                    </div>
                  </div>
                </section>
              </div>
            ) : null}
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`ml-auto inline-flex ${!profileHasChanges ? "cursor-pointer" : ""}`}>
                    <Button
                      className={`${!profileHasChanges ? "opacity-60" : ""}`}
                      onClick={onSave}
                      disabled={isUploadingCover || isSavingProfile || !profileHasChanges}
                    >
                      {isUploadingCover || isSavingProfile ? "Salvando..." : "Salvar"}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!profileHasChanges ? (
                  <TooltipContent>Sem alteracoes para salvar.</TooltipContent>
                ) : null}
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
