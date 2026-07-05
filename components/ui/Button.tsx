import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  id?: string;
}

export default function Button({
  children, variant = "primary", href, onClick, disabled, type = "button", className = "", id,
}: ButtonProps) {
  const base = variant === "primary" ? "btn-primary" : "btn-outline";
  const cls  = `${base} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  if (href) {
    return (
      <Link href={href} id={id} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button id={id} type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
