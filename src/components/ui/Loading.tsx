import type { ReactElement } from "react";

import classes from "@/components/ui/Loading.module.css";

export default function Loading(): ReactElement {
  return <div className={classes.loading} />;
}
