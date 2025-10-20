import type { ReactElement, ReactNode } from "react";

import classes from "@/components/ui/ErrorText.module.css";

interface ErrorTextProps {
  children: ReactNode;
}

export default function ErrorText({ children }: ErrorTextProps): ReactElement {
  return <p className={classes.errorText}>{children}</p>;
}
