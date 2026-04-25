import Icon from "./Icon";

export type TagChipVariant = "primary" | "secondary" | "surface" | "custom";

export interface TagChipProps {
  label: string;
  icon?: string;
  variant?: TagChipVariant;
  bgColor?: string;
  textColor?: string;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles: Record<Exclude<TagChipVariant, "custom">, string> = {
  primary:
    "bg-primary-fixed text-on-primary-fixed border border-outline-variant",
  secondary:
    "bg-secondary-fixed text-on-secondary-fixed border border-outline-variant",
  surface:
    "bg-surface-container-high text-on-surface border border-outline-variant",
};

export default function TagChip({
  label,
  icon,
  variant = "surface",
  bgColor,
  textColor,
  onDismiss,
  className = "",
}: TagChipProps) {
  const colorClasses =
    variant === "custom" ? "" : variantStyles[variant];

  const customStyle =
    variant === "custom"
      ? { backgroundColor: bgColor, color: textColor }
      : undefined;

  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-label-sm font-medium flex items-center gap-1",
        colorClasses,
        variant === "custom" ? "border border-outline-variant" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={customStyle}
    >
      {icon && <Icon name={icon} size={14} />}
      {label}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-0.5 hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-full"
          aria-label={`Remove ${label}`}
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </span>
  );
}
