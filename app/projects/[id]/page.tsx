import { AppShell } from "@/components/layout/app-shell"
import { ProjectDetail } from "@/components/projects/project-detail"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <ProjectDetail id={params.id} />
    </AppShell>
  )
}
