"use client"

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  isAiSidebarOpen: boolean
  onSidebarToggle: () => void
  onAiSidebarToggle: () => void
  onShareClick: () => void
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  isAiSidebarOpen,
  onSidebarToggle,
  onAiSidebarToggle,
  onShareClick,
}: WorkspaceNavbarProps) {
  return (
    <nav className="fixed top-0 right-0 left-0 z-40 flex h-12 items-center border-b border-border bg-surface px-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="h-8 w-8 text-copy-muted hover:text-copy-primary"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-copy-primary">{projectName}</span>
          <span className="text-[10px] leading-tight text-copy-muted">Workspace</span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-copy-muted hover:text-copy-primary"
          onClick={onShareClick}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          onClick={onAiSidebarToggle}
          size="sm"
          className={`gap-1.5 rounded-full px-3 ${
            isAiSidebarOpen
              ? "bg-brand text-base hover:bg-brand/90"
              : "bg-brand/15 text-brand hover:bg-brand/25"
          }`}
          aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
        >
          <Sparkles className="h-4 w-4" />
          AI
        </Button>
        <UserButton />
      </div>
    </nav>
  )
}
