import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/app/generated/prisma/client"
import type { NextRequest } from "next/server"

export interface CollaboratorInfo {
  email: string
  name: string | null
  imageUrl: string | null
  role: "owner" | "collaborator"
}

type ClerkUser = Awaited<ReturnType<typeof currentUser>>

function normalizedUserEmails(user: ClerkUser): string[] {
  return (
    user?.emailAddresses.map((e) => e.emailAddress.trim().toLowerCase()).filter(Boolean) ?? []
  )
}

async function enrichEmails(emails: string[]): Promise<Omit<CollaboratorInfo, "role">[]> {
  if (emails.length === 0) return []

  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({ emailAddress: emails, limit: 100 })

  const byEmail = new Map(
    users.map((u) => [
      u.emailAddresses.find((e) => emails.includes(e.emailAddress))?.emailAddress ?? "",
      u,
    ])
  )

  return emails.map((email) => {
    const user = byEmail.get(email)
    if (!user) return { email, name: null, imageUrl: null }
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null
    return { email, name: fullName, imageUrl: user.imageUrl || null }
  })
}

async function getOwnerInfo(ownerId: string): Promise<Omit<CollaboratorInfo, "role">> {
  const client = await clerkClient()
  const user = await client.users.getUser(ownerId)
  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    ""
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null
  return { email: primaryEmail, name: fullName, imageUrl: user.imageUrl || null }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      collaborators: { select: { collaboratorEmail: true }, orderBy: { createdAt: "asc" } },
    },
  })
  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const isOwner = project.ownerId === userId
  if (!isOwner) {
    const user = await currentUser()
    const userEmails = normalizedUserEmails(user)
    const isCollaborator = userEmails.some((e) =>
      project.collaborators.some((c) => c.collaboratorEmail === e)
    )
    if (!isCollaborator) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const collaboratorEmails = project.collaborators.map((c) => c.collaboratorEmail)

  const [ownerBase, enrichedCollaborators] = await Promise.all([
    getOwnerInfo(project.ownerId),
    enrichEmails(collaboratorEmails),
  ])

  const collaborators: CollaboratorInfo[] = [
    { ...ownerBase, role: "owner" },
    ...enrichedCollaborators.map((c) => ({ ...c, role: "collaborator" as const })),
  ]

  return Response.json({ collaborators })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })
  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }
  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  let email: string | undefined
  try {
    const body = await request.json()
    if (typeof body?.email === "string") email = body.email.trim().toLowerCase()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Valid email is required" }, { status: 400 })
  }

  const owner = await currentUser()
  if (normalizedUserEmails(owner).includes(email)) {
    return Response.json({ error: "Owner already has access" }, { status: 400 })
  }

  try {
    await prisma.projectCollaborator.create({
      data: { projectId, collaboratorEmail: email },
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return Response.json({ error: "Already a collaborator" }, { status: 409 })
    }
    throw e
  }

  const [enriched] = await enrichEmails([email])
  const collaborator: CollaboratorInfo = { ...enriched, role: "collaborator" }
  return Response.json({ collaborator }, { status: 201 })
}
