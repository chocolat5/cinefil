import type { ReactElement, ReactNode } from "react";

import classes from "@/components/ui/Button.module.css";

interface LinkButtonProps {
  children: string | ReactNode;
  variant?: "contained" | "outlined";
  href: string;
  ariaLabel: string;
}

export default function LinkButton({
  children,
  variant = "contained",
  href,
  ariaLabel,
}: LinkButtonProps): ReactElement {
  return (
    <a
      className={`${classes.button} ${classes[`-${variant}`]}`}
      href={href}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
