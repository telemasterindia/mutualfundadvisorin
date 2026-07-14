const DEFAULT_LOCAL_ORIGIN = "http://localhost:3000";

export function getAppOrigin() {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredOrigin) {
    return configuredOrigin.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return DEFAULT_LOCAL_ORIGIN;
}

export function getAuthCallbackUrl(nextPath: string) {
  const safeNextPath =
    nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard";

  return `${getAppOrigin()}/auth/callback?next=${encodeURIComponent(safeNextPath)}`;
}
