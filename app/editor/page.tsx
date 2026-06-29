"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from "@/components/editor/project-dialogs"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { Button } from "@/components/ui/button"

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const {
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
  } = useProjectDialogs()

  return (
    <div className="relative flex h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((v) => !v)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        projects={projects}
        onClose={() => setIsSidebarOpen(false)}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <main className="flex flex-1 items-center justify-center pt-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold text-copy-primary">
            Create a project or open an existing one
          </h1>
          <p className="max-w-sm text-sm text-copy-secondary">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button onClick={openCreate} className="mt-2 gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </main>

      <CreateProjectDialog
        open={dialog === "create"}
        nameValue={nameValue}
        isLoading={isLoading}
        onNameChange={setNameValue}
        onSubmit={handleCreate}
        onClose={close}
      />

      <RenameProjectDialog
        open={dialog === "rename"}
        targetProject={targetProject}
        nameValue={nameValue}
        isLoading={isLoading}
        onNameChange={setNameValue}
        onSubmit={handleRename}
        onClose={close}
      />

      <DeleteProjectDialog
        open={dialog === "delete"}
        targetProject={targetProject}
        isLoading={isLoading}
        onConfirm={handleDelete}
        onClose={close}
      />
    </div>
  )
}
