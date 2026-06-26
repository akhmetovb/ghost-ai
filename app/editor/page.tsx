import { EditorLayout } from "@/components/editor/editor-layout"

export default function EditorPage() {
  return (
    <EditorLayout>
      <div className="flex flex-1 items-center justify-center">
        <span className="text-copy-muted">Canvas goes here</span>
      </div>
    </EditorLayout>
  )
}
