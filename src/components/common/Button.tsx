"use client";

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import Icon from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: "left" | "right";
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-container text-white hover:bg-primary transition-colors",
  secondary:
    "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim transition-colors",
  outline:
    "bg-surface border border-outline text-on-surface hover:bg-surface-container-high transition-colors",
  text: "text-primary-container hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "py-1.5 px-3 text-label-sm",
  md: "py-2 px-4 text-label-bold",
  lg: "py-3 px-6 text-body-md",
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      loading = false,
      disabled,
      children,
      className = "",
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={[
          "rounded-lg font-semibold min-h-[44px]",
          "flex items-center justify-center gap-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {loading && <Spinner />}
        {!loading && icon && iconPosition === "left" && (
          <Icon name={icon} size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <Icon name={icon} size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
