"use client"

import { useState, useEffect, useCallback } from "react"
import { Link2, X, Check, UserPlus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CollaboratorInfo } from "@/app/api/projects/[projectId]/collaborators/route"

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  projectId: string
  projectName: string
  isOwner: boolean
}

function RoleBadge({ role }: { role: CollaboratorInfo["role"] }) {
  if (role === "owner") {
    return (
      <span className="rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
        Owner
      </span>
    )
  }
  return (
    <span className="rounded-full border border-border bg-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-copy-muted">
      Collaborator
    </span>
  )
}

function CollaboratorAvatar({ info }: { info: CollaboratorInfo }) {
  const initial = (info.name ?? info.email).charAt(0).toUpperCase()
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-elevated text-xs font-semibold text-copy-secondary">
      {info.imageUrl ? (
        <img src={info.imageUrl} alt={info.name ?? info.email} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  )
}

export function ShareDialog({ open, onClose, projectId, projectName, isOwner }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchCollaborators = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`)
      if (res.ok) {
        const data = await res.json()
        setCollaborators(data.collaborators ?? [])
      }
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (open) {
      fetchCollaborators()
      setInviteEmail("")
      setInviteError(null)
    }
  }, [open, fetchCollaborators])

  async function handleInvite() {
    const email = inviteEmail.trim().toLowerCase()
    if (!email) return
    setIsInviting(true)
    setInviteError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setInviteError(data.error ?? "Something went wrong")
        return
      }
      setCollaborators((prev) => [...prev, data.collaborator])
      setInviteEmail("")
    } finally {
      setIsInviting(false)
    }
  }

  async function handleRemove(email: string) {
    setRemovingEmail(email)
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      )
      if (!res.ok) return
      setCollaborators((prev) => prev.filter((c) => c.email !== email))
    } finally {
      setRemovingEmail(null)
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const total = collaborators.length

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md gap-0 p-0" showCloseButton={false}>
        <DialogHeader className="gap-1 border-b border-border px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-sm font-semibold text-copy-primary">
                Share project
              </DialogTitle>
              <p className="text-xs text-copy-muted">
                Invite collaborators, copy the workspace link, and manage access.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-0.5 shrink-0 text-copy-muted hover:text-copy-primary transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col">
          {/* Workspace link card */}
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-elevated px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-copy-primary">Workspace link</p>
                <p className="text-[11px] text-copy-muted">
                  Share a direct link with teammates after you grant them access.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 text-xs"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-state-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5" />
                    Copy link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Invite section — owner only */}
          {isOwner && (
            <div className="border-b border-border px-5 py-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-copy-muted">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <Input
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value)
                      setInviteError(null)
                    }}
                    onKeyDown={(e) => e.key === "Enter" && !isInviting && handleInvite()}
                    disabled={isInviting}
                    className="pl-8 text-sm"
                  />
                </div>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || isInviting}
                  size="sm"
                  className="gap-1.5 bg-brand text-base hover:bg-brand/90 shrink-0"
                >
                  {isInviting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  Invite
                </Button>
              </div>
              {inviteError && (
                <p className="mt-2 text-xs text-destructive">{inviteError}</p>
              )}
            </div>
          )}

          {/* People with access */}
          <div className="px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-copy-secondary">People with access</p>
              {total > 0 && (
                <span className="text-[11px] text-copy-muted">{total} total</span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-copy-muted" />
              </div>
            ) : collaborators.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {collaborators.map((info) => (
                  <li key={info.email} className="flex items-center gap-3 rounded-xl border border-border bg-elevated px-3 py-2.5">
                    <CollaboratorAvatar info={info} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        {info.name && (
                          <span className="truncate text-sm font-medium text-copy-primary">
                            {info.name}
                          </span>
                        )}
                        <RoleBadge role={info.role} />
                      </div>
                      <span className="truncate text-[11px] text-copy-muted">{info.email}</span>
                    </div>
                    {isOwner && info.role === "collaborator" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemove(info.email)}
                        disabled={removingEmail === info.email}
                        className="h-7 w-7 shrink-0 text-copy-muted hover:text-destructive"
                        aria-label={`Remove ${info.email}`}
                      >
                        {removingEmail === info.email ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        )}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-copy-muted">No people with access yet.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
