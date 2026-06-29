"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { slugify } from "@/lib/utils"
import type { Project } from "@/lib/projects"

type DialogType = "create" | "rename" | "delete" | null

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

export function useProjectActions() {
  const router = useRouter()
  const pathname = usePathname()

  const [dialog, setDialog] = useState<DialogType>(null)
  const [targetProject, setTargetProject] = useState<Project | null>(null)
  const [nameValue, setNameValue] = useState("")
  const [pendingSuffix, setPendingSuffix] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const roomId = (() => {
    const slug = slugify(nameValue)
    return slug ? `${slug}-${pendingSuffix}` : pendingSuffix
  })()

  function openCreate() {
    setNameValue("")
    setTargetProject(null)
    setPendingSuffix(randomSuffix())
    setError(null)
    setDialog("create")
  }

  function openRename(project: Project) {
    setNameValue(project.name)
    setTargetProject(project)
    setError(null)
    setDialog("rename")
  }

  function openDelete(project: Project) {
    setTargetProject(project)
    setError(null)
    setDialog("delete")
  }

  function close() {
    setDialog(null)
    setTargetProject(null)
    setNameValue("")
    setPendingSuffix("")
    setError(null)
  }

  async function handleCreate() {
    if (isLoading || !nameValue.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomId, name: nameValue.trim() }),
      })
      if (!res.ok) {
        setError("Could not create project. Please try again.")
        return
      }
      const project: Project = await res.json()
      close()
      router.push(`/editor/${project.id}`)
    } catch {
      setError("Could not create project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRename() {
    if (isLoading || !nameValue.trim() || !targetProject) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue.trim() }),
      })
      if (!res.ok) {
        setError("Could not rename project. Please try again.")
        return
      }
      close()
      router.refresh()
    } catch {
      setError("Could not rename project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (isLoading || !targetProject) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        setError("Could not delete project. Please try again.")
        return
      }
      close()
      if (pathname === `/editor/${targetProject.id}`) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch {
      setError("Could not delete project. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialog,
    targetProject,
    nameValue,
    setNameValue,
    isLoading,
    error,
    roomId,
    openCreate,
    openRename,
    openDelete,
    close,
    handleCreate,
    handleRename,
    handleDelete,
  }
}
