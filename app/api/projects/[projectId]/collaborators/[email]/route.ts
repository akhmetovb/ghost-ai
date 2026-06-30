import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { NextRequest } from "next/server"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string; email: string }> }
) {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId, email: rawEmail } = await params
  const email = decodeURIComponent(rawEmail).toLowerCase()

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

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: { projectId_collaboratorEmail: { projectId, collaboratorEmail: email } },
  })
  if (!collaborator) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.projectCollaborator.delete({
    where: { projectId_collaboratorEmail: { projectId, collaboratorEmail: email } },
  })

  return new Response(null, { status: 204 })
}
