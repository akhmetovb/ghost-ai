import { Cpu, Users, FileText } from "lucide-react"

const features = [
  {
    icon: Cpu,
    name: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Users,
    name: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    name: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen font-sans bg-base">
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-surface border-r border-border px-14 py-12">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-brand" />
          <span className="font-semibold text-copy-primary tracking-tight">Ghost AI</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-[22rem]">
          <h1 className="text-4xl font-bold text-copy-primary leading-tight tracking-tight">
            Design systems at the speed of thought.
          </h1>
          <p className="mt-4 text-base text-copy-secondary leading-relaxed">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>
          <ul className="mt-10 space-y-6">
            {features.map(({ icon: Icon, name, description }) => (
              <li key={name} className="flex gap-4">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-subtle border border-border">
                  <Icon className="h-5 w-5 text-copy-muted" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-copy-primary">{name}</p>
                  <p className="mt-0.5 text-sm text-copy-muted leading-relaxed">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-copy-faint">© 2026 Ghost AI. All rights reserved.</p>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
