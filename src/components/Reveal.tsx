import type { CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

type Variant = "fade-in" | "fade-in-left" | "fade-in-right" | "scale-in" | "line-reveal";

type RevealProps = {
  children?: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
};

export function Reveal({
  children,
  className = "",
  variant = "fade-in",
  delay = 0,
}: RevealProps) {
  const ref = useScrollReveal<HTMLDivElement>();
  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}s` }
    : undefined;

  return (
    <div ref={ref} className={`${variant} h-full ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
