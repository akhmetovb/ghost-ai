"use client"

import { useState } from "react"
import { Compass, Bot, Sparkles } from "lucide-react"
import { WorkspaceNavbar } from "@/components/editor/workspace-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from "@/components/editor/project-dialogs"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/lib/projects"

interface WorkspaceShellProps {
  project: { id: string; name: string; isOwner: boolean }
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function WorkspaceShell({
  project,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const {
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
  } = useProjectActions()

  return (
    <div className="relative flex h-screen flex-col bg-base">
      <WorkspaceNavbar
        projectName={project.name}
        isSidebarOpen={isSidebarOpen}
        isAiSidebarOpen={isAiSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((v) => !v)}
        onAiSidebarToggle={() => setIsAiSidebarOpen((v) => !v)}
        onShareClick={() => setIsShareOpen(true)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={project.id}
        onClose={() => setIsSidebarOpen(false)}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      {/* AI sidebar */}
      <aside
        className={`fixed top-12 right-0 z-30 flex h-[calc(100vh-3rem)] w-80 flex-col border-l border-border bg-surface transition-transform duration-200 ease-in-out ${
          isAiSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div>
            <p className="text-sm font-semibold text-copy-primary">AI Copilot</p>
            <p className="text-[10px] text-copy-muted">Placeholder panel</p>
          </div>
          <Sparkles className="h-4 w-4 text-ai" />
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
          <div className="flex gap-3 rounded-2xl border border-border bg-elevated p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ai/15">
              <Bot className="h-4 w-4 text-ai-text" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-copy-primary">Chat surface pending</p>
              <p className="text-xs text-copy-secondary">
                The toggle is wired. Messaging and generation are intentionally out of scope here.
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-border p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-copy-faint">
            Future Hooks
          </p>
          <p className="text-xs text-copy-muted">
            Prompt composer, run status, and architecture guidance will attach to this sidebar.
          </p>
        </div>
      </aside>

      {/* Canvas area */}
      <main className="flex flex-1 items-center justify-center pt-12 bg-base">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-elevated">
            <Compass className="h-7 w-7 text-brand" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copy-faint">
              Workspace Shell
            </p>
            <h1 className="max-w-md text-2xl font-semibold text-copy-primary">
              Canvas and collaboration tooling land here next.
            </h1>
            <p className="max-w-sm text-sm text-copy-secondary">
              This room is ready for the shared architecture canvas, durable AI workflows, and
              real-time presence. For now, the shell is wired with project context and navigation
              only.
            </p>
          </div>
        </div>
      </main>

      <CreateProjectDialog
        open={dialog === "create"}
        nameValue={nameValue}
        roomId={roomId}
        isLoading={isLoading}
        error={dialog === "create" ? error : null}
        onNameChange={setNameValue}
        onSubmit={handleCreate}
        onClose={close}
      />
      <RenameProjectDialog
        open={dialog === "rename"}
        targetProject={targetProject}
        nameValue={nameValue}
        isLoading={isLoading}
        error={dialog === "rename" ? error : null}
        onNameChange={setNameValue}
        onSubmit={handleRename}
        onClose={close}
      />
      <DeleteProjectDialog
        open={dialog === "delete"}
        targetProject={targetProject}
        isLoading={isLoading}
        error={dialog === "delete" ? error : null}
        onConfirm={handleDelete}
        onClose={close}
      />

      <ShareDialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={project.id}
        projectName={project.name}
        isOwner={project.isOwner}
      />
    </div>
  )
}
