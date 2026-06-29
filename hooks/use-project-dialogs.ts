"use client"

import { useState } from "react"
import { type MockProject, MOCK_PROJECTS, slugify } from "@/lib/mock-projects"

type DialogType = "create" | "rename" | "delete" | null

export function useProjectDialogs() {
  const [projects, setProjects] = useState<MockProject[]>(MOCK_PROJECTS)
  const [dialog, setDialog] = useState<DialogType>(null)
  const [targetProject, setTargetProject] = useState<MockProject | null>(null)
  const [nameValue, setNameValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function openCreate() {
    setNameValue("")
    setTargetProject(null)
    setDialog("create")
  }

  function openRename(project: MockProject) {
    setNameValue(project.name)
    setTargetProject(project)
    setDialog("rename")
  }

  function openDelete(project: MockProject) {
    setTargetProject(project)
    setDialog("delete")
  }

  function close() {
    setDialog(null)
    setTargetProject(null)
    setNameValue("")
  }

  function handleCreate() {
    if (isLoading || !nameValue.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      const newProject: MockProject = {
        id: Date.now().toString(),
        name: nameValue.trim(),
        slug: slugify(nameValue),
        owned: true,
      }
      setProjects((prev) => [...prev, newProject])
      setIsLoading(false)
      close()
    }, 400)
  }

  function handleRename() {
    if (isLoading || !nameValue.trim() || !targetProject) return
    setIsLoading(true)
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === targetProject.id
            ? { ...p, name: nameValue.trim(), slug: slugify(nameValue) }
            : p
        )
      )
      setIsLoading(false)
      close()
    }, 400)
  }

  function handleDelete() {
    if (isLoading || !targetProject) return
    setIsLoading(true)
    setTimeout(() => {
      setProjects((prev) => prev.filter((p) => p.id !== targetProject.id))
      setIsLoading(false)
      close()
    }, 400)
  }

  return {
    projects,
    dialog,
    targetProject,
    nameValue,
    setNameValue,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    handleCreate,
    handleRename,
    handleDelete,
  }
}
