import type { ReactElement } from "react";

import classes from "@/components/ui/Chip.module.css";

interface ChipProps {
  variant?: "solid" | "contained";
  label: string;
  onClick?: () => void;
}

export default function Chip({
  label,
  onClick,
  variant = "contained",
}: ChipProps): ReactElement {
  return (
    <div
      className={`${classes.chip} ${classes[`-${variant}`]} ${onClick ? classes["-clickable"] : ""}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
}
