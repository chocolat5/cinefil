import type { ReactElement, ReactNode } from "react";

import classes from "@/components/ui/NameText.module.css";

interface NameTextProps {
  className?: string;
  children: ReactNode;
}

export default function NameText({
  className,
  children,
}: NameTextProps): ReactElement {
  return <h2 className={`${classes.text} ${className}`}>{children}</h2>;
}
