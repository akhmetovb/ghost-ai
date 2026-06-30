import { redirect } from "next/navigation"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"
import { getCurrentIdentity, getProjectWithAccess } from "@/lib/project-access"
import { getProjectsForUser } from "@/lib/projects"

export default async function EditorRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params

  const identity = await getCurrentIdentity()
  if (!identity) {
    redirect("/sign-in")
  }

  const project = await getProjectWithAccess(roomId, identity.userId, identity.primaryEmail)
  if (!project) {
    return <AccessDenied />
  }

  const { owned, shared } = await getProjectsForUser()

  return (
    <WorkspaceShell
      project={project}
      ownedProjects={owned}
      sharedProjects={shared}
    />
  )
}
