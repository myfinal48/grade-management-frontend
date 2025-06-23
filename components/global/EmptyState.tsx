import { cn } from "@/lib/utils";
import { LucideIcon, Info } from "lucide-react";

interface EmptyStateProps {
  className?: string;
  icon?: LucideIcon;
  title?: string;
  message?: string;
}

export const EmptyState = ({
  className,
  icon: Icon = Info,
  title = "Aucune donnée",
  message = "Aucune information à afficher pour le moment."
}: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2">{message}</p>
    </div>
  );
}; 