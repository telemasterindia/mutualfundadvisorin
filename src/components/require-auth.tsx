import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/use-auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            {loading ? "Checking your session..." : "Redirecting to login..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
