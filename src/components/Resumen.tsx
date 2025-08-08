interface Props {
  content: string
  loading: boolean
  error: string | null
}

export default function Resumen({ content, loading, error }: Props) {
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-muted-foreground">Generando resumen…</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-destructive">{error}</span>
      </div>
    )
  }
  return (
    <div className="w-full h-full p-3 overflow-auto">
      {content ? (
        <pre className="whitespace-pre-wrap text-sm">{content}</pre>
      ) : (
        <span className="text-muted-foreground">Aquí irá el resumen…</span>
      )}
    </div>
  )
}