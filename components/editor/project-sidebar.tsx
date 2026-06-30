"use client"

import Link from "next/link"
import { X, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { Project } from "@/lib/projects"

interface ProjectSidebarProps {
  isOpen: boolean
  ownedProjects: Project[]
  sharedProjects: Project[]
  activeProjectId?: string
  onClose: () => void
  onCreateProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

export function ProjectSidebar({
  isOpen,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const defaultTab =
    activeProjectId && !ownedProjects.some((p) => p.id === activeProjectId)
      ? "shared"
      : "my-projects"

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-12 left-0 z-30 flex h-[calc(100vh-3rem)] w-72 flex-col border-r border-border bg-surface transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold text-copy-primary">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-copy-muted hover:text-copy-primary"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-3">
          <Tabs defaultValue={defaultTab} className="flex h-full flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="mt-4 flex-1 overflow-y-auto">
              {ownedProjects.length === 0 ? (
                <p className="text-center text-sm text-copy-muted">No projects yet</p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {ownedProjects.map((project) => (
                    <li
                      key={project.id}
                      className={`group flex items-center justify-between rounded-xl hover:bg-elevated ${
                        activeProjectId === project.id ? "bg-elevated" : ""
                      }`}
                    >
                      <Link
                        href={`/editor/${project.id}`}
                        className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5"
                      >
                        {activeProjectId === project.id ? (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
                        ) : (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-transparent" />
                        )}
                        <span className={`truncate text-sm ${activeProjectId === project.id ? "font-medium text-copy-primary" : "text-copy-primary"}`}>
                          {project.name}
                        </span>
                      </Link>
                      <div className="flex shrink-0 items-center gap-0.5 pr-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onRenameProject(project)}
                          className="h-6 w-6 text-copy-muted hover:text-copy-primary"
                          aria-label={`Rename ${project.name}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDeleteProject(project)}
                          className="h-6 w-6 text-copy-muted hover:text-destructive"
                          aria-label={`Delete ${project.name}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="shared" className="mt-4 flex-1 overflow-y-auto">
              {sharedProjects.length === 0 ? (
                <p className="text-center text-sm text-copy-muted">No shared projects</p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <li
                      key={project.id}
                      className={`rounded-xl hover:bg-elevated ${
                        activeProjectId === project.id ? "bg-elevated" : ""
                      }`}
                    >
                      <Link
                        href={`/editor/${project.id}`}
                        className="flex items-center gap-2 px-2 py-1.5"
                      >
                        {activeProjectId === project.id ? (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
                        ) : (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-transparent" />
                        )}
                        <span className="truncate text-sm text-copy-primary">
                          {project.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="shrink-0 border-t border-border p-3">
          <Button
            className="w-full gap-2 bg-brand text-base hover:bg-brand/90"
            onClick={onCreateProject}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
