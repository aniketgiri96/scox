import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function InputField({ label, ...props }: InputProps) {
  return (
    <label className="stack" style={{ gap: "0.35rem" }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      <input
        {...props}
        style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "0.7rem 0.8rem",
          fontSize: 14,
          outline: "none",
          ...props.style
        }}
      />
    </label>
  );
}

export function TextareaField({ label, ...props }: TextareaProps) {
  return (
    <label className="stack" style={{ gap: "0.35rem" }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      <textarea
        {...props}
        style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "0.7rem 0.8rem",
          fontSize: 14,
          minHeight: 140,
          outline: "none",
          resize: "vertical",
          ...props.style
        }}
      />
    </label>
  );
}
