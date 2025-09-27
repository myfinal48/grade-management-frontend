"use client"

export function StudentGradesHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Mes Notes</h2>
        <p className="text-muted-foreground">Consultez vos notes et votre progression</p>
      </div>
    </div>
  )
}
