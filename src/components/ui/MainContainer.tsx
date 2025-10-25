import type { ReactElement, ReactNode } from "react";

import classes from "@/components/ui/MainContainer.module.css";

interface MainContainerProps {
  children: ReactNode;
  className?: string;
  id: string;
}

export default function MainContainer({
  children,
  id,
  className,
}: MainContainerProps): ReactElement {
  return (
    <main id={id} className={`${classes.main}  ${className ?? ""}`}>
      {children}
    </main>
  );
}
