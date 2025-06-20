import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Skeleton pour les tableaux
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 w-24" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={`row-${i}`} className="flex gap-4">
          {[...Array(columns)].map((_, j) => (
            <Skeleton key={`cell-${i}-${j}`} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skeleton pour les cartes en grille
export function GridSkeleton({ 
  items = 3, 
  columns = 3, 
  cardHeight = "h-32" 
}: { 
  items?: number; 
  columns?: number; 
  cardHeight?: string;
}) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-${columns}`}>
      {[...Array(items)].map((_, i) => (
        <Skeleton key={i} className={`${cardHeight} w-full rounded-lg`} />
      ))}
    </div>
  );
}

// Skeleton pour les cartes avec contenu
export function CardSkeleton({ 
  items = 3, 
  columns = 3 
}: { 
  items?: number; 
  columns?: number;
}) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-${columns}`}>
      {[...Array(items)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton pour les listes
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton pour les formulaires
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

// Skeleton pour les détails d'un élément
export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

// Skeleton pour les statistiques/dashboard
export function StatsSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(items)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 