import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface Project {
  id: string
  name: string
}

export async function getProjectsForUser(): Promise<{ owned: Project[]; shared: Project[] }> {
  const { userId } = await auth()
  if (!userId) return { owned: [], shared: [] }

  const user = await currentUser()
  const userEmail = user?.emailAddresses[0]?.emailAddress ?? null

  try {
    const [owned, shared] = await Promise.all([
      prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true },
      }),
      userEmail
        ? prisma.project.findMany({
            where: { collaborators: { some: { collaboratorEmail: userEmail } } },
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true },
          })
        : Promise.resolve([]),
    ])
    return { owned, shared }
  } catch {
    return { owned: [], shared: [] }
  }
}
