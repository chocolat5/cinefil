import type { ReactElement } from "react";

import classes from "@/components/ui/NoResult.module.css";

interface NoResultProps {
  name: string;
}

export default function NoResult({ name }: NoResultProps): ReactElement {
  return (
    <h2 className={classes.text}>No {name} added yet. Add some favorites.</h2>
  );
}
