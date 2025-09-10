import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface HomeCardItem {
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
  isLoading: boolean;
}

export function HomeCard({
  title,
  icon: Icon,
  count,
  isLoading,
  description,
}: Readonly<HomeCardItem>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {isLoading ? <Skeleton className="h-6 w-16" /> : count}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
