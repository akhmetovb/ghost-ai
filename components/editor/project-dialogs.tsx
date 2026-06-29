"use client"

import { useEffect, useRef } from "react"
import { slugify, type MockProject } from "@/lib/mock-projects"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@radix-ui/react-dialog"

// ── Create ──────────────────────────────────────────────────────────────────

interface CreateProjectDialogProps {
  open: boolean
  nameValue: string
  isLoading: boolean
  onNameChange: (v: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function CreateProjectDialog({
  open,
  nameValue,
  isLoading,
  onNameChange,
  onSubmit,
  onClose,
}: CreateProjectDialogProps) {
  const slug = slugify(nameValue)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Give your architecture workspace a name.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="My Project"
            value={nameValue}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            autoFocus
          />
          <p className="min-h-4 text-xs text-copy-muted">
            {slug ? (
              <>
                Slug:{" "}
                <span className="font-mono text-copy-secondary">{slug}</span>
              </>
            ) : null}
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onSubmit}
            disabled={!nameValue.trim() || isLoading}
          >
            {isLoading ? "Creating…" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Rename ───────────────────────────────────────────────────────────────────

interface RenameProjectDialogProps {
  open: boolean
  targetProject: MockProject | null
  nameValue: string
  isLoading: boolean
  onNameChange: (v: string) => void
  onSubmit: () => void
  onClose: () => void
}

export function RenameProjectDialog({
  open,
  targetProject,
  nameValue,
  isLoading,
  onNameChange,
  onSubmit,
  onClose,
}: RenameProjectDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          {targetProject && (
            <DialogDescription>
              Renaming &ldquo;{targetProject.name}&rdquo;
            </DialogDescription>
          )}
        </DialogHeader>
        <Input
          ref={inputRef}
          placeholder="Project name"
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onSubmit}
            disabled={!nameValue.trim() || isLoading}
          >
            {isLoading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Delete ───────────────────────────────────────────────────────────────────

interface DeleteProjectDialogProps {
  open: boolean
  targetProject: MockProject | null
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteProjectDialog({
  open,
  targetProject,
  isLoading,
  onConfirm,
  onClose,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          {targetProject && (
            <DialogDescription>
              Are you sure you want to delete &ldquo;{targetProject.name}&rdquo;?
              This cannot be undone.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
