import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorStateProps {
  className?: string;
  message?: string;
}

export const FormErrorState = ({
  className,
  message = "Une erreur est survenue"
}: FormErrorStateProps) => {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-destructive", className)}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}; 