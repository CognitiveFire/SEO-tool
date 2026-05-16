import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  /** "full" = icon + wordmark, "icon" = icon only, "wordmark" = text only */
  variant?: "full" | "icon" | "wordmark";
}

export function Logo({ className, variant = "full" }: LogoProps) {
  return (
    <svg
      aria-label="Apriil Signal Room"
      className={cn("overflow-visible", className)}
      fill="none"
      role="img"
      viewBox="0 0 320 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon — open-room bracket with bar-chart bars */}
      {variant !== "wordmark" && (
        <g>
          {/* Outer bracket: left vertical, bottom horizontal, right vertical (open top-right) */}
          <line stroke="currentColor" strokeLinecap="square" strokeWidth="5" x1="10" x2="10" y1="8" y2="72" />
          <line stroke="currentColor" strokeLinecap="square" strokeWidth="5" x1="10" x2="74" y1="72" y2="72" />
          <line stroke="currentColor" strokeLinecap="square" strokeWidth="5" x1="74" x2="74" y1="72" y2="20" />

          {/* Bar chart bars inside — left-to-right: short, medium, tall */}
          <line stroke="currentColor" strokeLinecap="square" strokeWidth="5" x1="26" x2="26" y1="60" y2="72" />
          <line stroke="currentColor" strokeLinecap="square" strokeWidth="5" x1="42" x2="42" y1="46" y2="72" />
          <line stroke="currentColor" strokeLinecap="square" strokeWidth="5" x1="58" x2="58" y1="30" y2="72" />
        </g>
      )}

      {/* Wordmark */}
      {variant !== "icon" && (
        <g transform={variant === "full" ? "translate(90, 0)" : "translate(0, 0)"}>
          {/* APRIIL — bold, wide tracking */}
          <text
            dominantBaseline="auto"
            fill="currentColor"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontSize="38"
            fontWeight="700"
            letterSpacing="4"
            x="0"
            y="52"
          >
            APRIIL
          </text>
          {/* SIGNAL ROOM — lighter weight, wider tracking */}
          <text
            dominantBaseline="auto"
            fill="currentColor"
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontSize="13.5"
            fontWeight="400"
            letterSpacing="6"
            x="2"
            y="72"
          >
            SIGNAL ROOM
          </text>
        </g>
      )}
    </svg>
  );
}
