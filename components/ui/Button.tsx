import type { ButtonHTMLAttributes, CSSProperties, PropsWithChildren } from "react";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variantStyles: Record<NonNullable<Props["variant"]>, CSSProperties> = {
  primary: {
    background: "var(--primary)",
    border: "1px solid var(--primary)",
    color: "#fff"
  },
  secondary: {
    background: "#edf8fb",
    border: "1px solid #c8eaf1",
    color: "#045e70"
  },
  ghost: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text)"
  }
};

export function Button({ children, style, variant = "primary", ...props }: Props) {
  return (
    <button
      {...props}
      style={{
        borderRadius: 10,
        padding: "0.65rem 1rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 160ms ease",
        ...variantStyles[variant],
        ...style
      }}
    >
      {children}
    </button>
  );
}
