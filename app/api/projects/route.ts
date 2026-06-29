import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId! },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, status: true, createdAt: true, updatedAt: true },
  });

  return Response.json(projects);
}

export async function POST(request: Request) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let name: string | undefined;
  let id: string | undefined;
  try {
    const body = await request.json();
    name = typeof body?.name === "string" ? body.name.trim() : undefined;
    id = typeof body?.id === "string" ? body.id.trim() || undefined : undefined;
  } catch {
    // body is optional; missing or non-JSON body is fine
  }

  const project = await prisma.project.create({
    data: {
      ...(id ? { id } : {}),
      ownerId: userId!,
      name: name || "Untitled Project",
    },
    select: { id: true, name: true, status: true, createdAt: true, updatedAt: true },
  });

  return Response.json(project, { status: 201 });
}
