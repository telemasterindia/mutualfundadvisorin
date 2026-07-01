import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-10">
        <Link href="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-2xl gradient-bg shadow-glow">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </span>
          WealthMaster India
        </Link>

        <div className="glass w-full rounded-3xl p-8 shadow-elegant">
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Secured by 256-bit encryption
        </p>
      </div>
    </div>
  );
}

export function Field({ id, label, icon: Icon, error, ...rest }: any) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
      </Label>
      <div className="relative mt-1.5">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input id={id} className={`h-11 ${Icon ? "pl-9" : ""}`} {...rest} />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function PrimaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full rounded-xl gradient-bg text-primary-foreground shadow-glow hover:opacity-95"
      {...rest}
    >
      {children}
    </Button>
  );
}

export function GoogleButton({
  onClick,
  label = "Continue with Google",
}: {
  onClick?: () => void;
  label?: string;
}) {
  return (
    <Button type="button" variant="outline" className="w-full h-11 rounded-xl" onClick={onClick}>
      <GoogleIcon className="mr-2 h-4 w-4" /> {label}
    </Button>
  );
}

export function Divider({ children = "or" }: { children?: React.ReactNode }) {
  return (
    <div className="relative my-2 text-center">
      <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
      <span className="relative bg-card px-3 text-xs text-muted-foreground">{children}</span>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
