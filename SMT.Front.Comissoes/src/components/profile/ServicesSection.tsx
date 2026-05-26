import { PriceSheetRow } from "@/components/profile/PriceSheetRow"
import { OwnerPriceSheetRow } from "@/components/profile/OwnerPriceSheetRow"
import type { PriceSheet, User } from "@/types"

type ServicesSectionProps = {
  activePriceSheets: PriceSheet[]
  canEditProfile: boolean
  isOwnerProfile: boolean
  serviceGalleries: string[][]
  artist: User
  onAddService: () => void
  onRequestCommission: (price: number) => void
}

export function ServicesSection({
  activePriceSheets,
  canEditProfile,
  isOwnerProfile,
  serviceGalleries,
  artist,
  onAddService,
  onRequestCommission,
}: ServicesSectionProps) {
  const addServiceCard = (
    <button
      type="button"
      className="group flex min-h-[220px] w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-500/60 bg-card/40 text-muted-foreground transition hover:border-zinc-700/70 hover:text-foreground dark:border-border/60 dark:hover:border-foreground/40"
      onClick={onAddService}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-zinc-500/60 text-3xl font-semibold dark:border-border/60">
          +
        </div>
        <span className="text-sm font-semibold">
          Adicionar serviço
        </span>
      </div>
    </button>
  )

  if (activePriceSheets.length > 0) {
    return (
      <div className="space-y-4">
        {canEditProfile ? addServiceCard : null}
        {activePriceSheets.map((sheet, index) =>
          isOwnerProfile ? (
            <OwnerPriceSheetRow
              key={sheet.id}
              sheet={sheet}
              images={serviceGalleries[index] ?? []}
            />
          ) : (
            <PriceSheetRow
              key={sheet.id}
              sheet={sheet}
              images={serviceGalleries[index] ?? []}
              artist={artist}
              onRequest={onRequestCommission}
            />
          )
        )}
      </div>
    )
  }

  if (canEditProfile) {
    return (
      <div className="space-y-4">
        {addServiceCard}
        <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-6 text-center text-sm text-muted-foreground">
          Nenhum serviço cadastrado ainda.
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-6 text-center text-sm text-muted-foreground">
      Nenhum serviço cadastrado ainda.
    </div>
  )
}
