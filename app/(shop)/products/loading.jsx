import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]  w-full items-center justify-center">
      <LoadingSpinner className="h-8 w-8 text-muted-foreground" />
    </div>
  );
}
