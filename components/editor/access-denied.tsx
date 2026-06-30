import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-base text-center">
      <Lock className="h-8 w-8 text-copy-muted" />
      <h1 className="text-xl font-semibold text-copy-primary">Access Denied</h1>
      <p className="max-w-sm text-sm text-copy-secondary">
        This project doesn&apos;t exist or you don&apos;t have permission to view it.
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link href="/editor">Back to Projects</Link>
      </Button>
    </div>
  )
}
