"use client"

import { X, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { type MockProject } from "@/lib/mock-projects"

interface ProjectSidebarProps {
  isOpen: boolean
  projects: MockProject[]
  onClose: () => void
  onCreateProject: () => void
  onRenameProject: (project: MockProject) => void
  onDeleteProject: (project: MockProject) => void
}

export function ProjectSidebar({
  isOpen,
  projects,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const myProjects = projects.filter((p) => p.owned)
  const sharedProjects = projects.filter((p) => !p.owned)

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
          <Tabs defaultValue="my-projects" className="flex h-full flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="mt-4 flex-1 overflow-y-auto">
              {myProjects.length === 0 ? (
                <p className="text-center text-sm text-copy-muted">No projects yet</p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {myProjects.map((project) => (
                    <li
                      key={project.id}
                      className="group flex items-center justify-between rounded-xl px-2 py-1.5 hover:bg-elevated"
                    >
                      <span className="truncate text-sm text-copy-primary">
                        {project.name}
                      </span>
                      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
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
                      className="flex items-center rounded-xl px-2 py-1.5 hover:bg-elevated"
                    >
                      <span className="truncate text-sm text-copy-primary">
                        {project.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="shrink-0 border-t border-border p-3">
          <Button
            variant="outline"
            className="w-full gap-2"
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
