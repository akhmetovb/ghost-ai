export interface MockProject {
  id: string
  name: string
  slug: string
  owned: boolean
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: "1", name: "E-commerce Platform", slug: "e-commerce-platform", owned: true },
  { id: "2", name: "Auth Service", slug: "auth-service", owned: true },
  { id: "3", name: "Analytics Dashboard", slug: "analytics-dashboard", owned: false },
]
