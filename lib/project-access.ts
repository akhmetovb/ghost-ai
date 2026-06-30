import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface CurrentIdentity {
  userId: string
  primaryEmail: string | null
}

export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  return {
    userId,
    primaryEmail: user?.emailAddresses[0]?.emailAddress ?? null,
  }
}

export async function getProjectWithAccess(
  projectId: string,
  userId: string,
  userEmail: string | null
): Promise<{ id: string; name: string; isOwner: boolean } | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })

  if (!project) return null

  if (project.ownerId === userId) return { id: project.id, name: project.name, isOwner: true }

  if (userEmail) {
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_collaboratorEmail: {
          projectId: project.id,
          collaboratorEmail: userEmail,
        },
      },
    })
    if (collaborator) return { id: project.id, name: project.name, isOwner: false }
  }

  return null
}
