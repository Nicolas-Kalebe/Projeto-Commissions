import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ModerationReport } from "@/types"

type DashboardPageProps = {
  moderationReports: ModerationReport[]
}

export function DashboardPage({ moderationReports }: DashboardPageProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Painel interno
          </p>
          <h2 className="text-xl font-semibold">Painel Administrativo</h2>
        </div>
        <Button variant="outline" size="sm">
          Ver relatÃ‡Ã¼rios
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Volume Transacionado", value: "R$ 82.450,00" },
          { label: "Receita (Taxas)", value: "R$ 8.245,00" },
          { label: "Disputas Abertas", value: "12" },
        ].map((metric) => (
          <Card key={metric.label} className="border-border/60 bg-card/95">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <p className="text-2xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 bg-card/95">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Lista de ModeraÃ‡ÃµÃ‡Å“o
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ConteÃ‡Â§do</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">AÃ‡ÃµÃ‡Ã¦es</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moderationReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.conteudo}</TableCell>
                  <TableCell>{report.motivo}</TableCell>
                  <TableCell>{report.autor}</TableCell>
                  <TableCell>
                    <Badge
                      variant={report.status === "novo" ? "default" : "outline"}
                    >
                      {report.status === "novo" ? "Novo" : "Revisado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        Ignorar
                      </Button>
                      <Button variant="destructive" size="sm">
                        Banir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
