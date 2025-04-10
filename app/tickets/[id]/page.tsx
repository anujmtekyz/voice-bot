import { AppShell } from "@/components/layout/app-shell"
import { TicketDetail } from "@/components/tickets/ticket-detail"

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <TicketDetail id={params.id} />
    </AppShell>
  )
}
