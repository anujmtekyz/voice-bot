import { AppShell } from "@/components/layout/app-shell"
import { TicketList } from "@/components/tickets/ticket-list"

export default function TicketsPage() {
  return (
    <AppShell>
      <TicketList />
    </AppShell>
  )
}
