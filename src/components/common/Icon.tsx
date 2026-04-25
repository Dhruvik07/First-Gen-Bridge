interface IconProps {
  /** The Material Symbols icon name, e.g. "dashboard", "groups", "search" */
  name: string;
  /** Icon size in pixels (defaults to 24) */
  size?: number;
  /** Whether to use the filled variant (defaults to false) */
  filled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export default function Icon({
  name,
  size = 24,
  filled = false,
  className = "",
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
