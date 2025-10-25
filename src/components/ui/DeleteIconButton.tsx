import type { ReactElement } from "react";

import classes from "@/components/ui/Button.module.css";
import { Minus } from "@/components/ui/Icons";

interface DeleteIconButtonProps {
  onClick: () => void;
}

export default function DeleteIconButton({
  onClick,
}: DeleteIconButtonProps): ReactElement {
  return (
    <button
      className={classes.buttonDelete}
      onClick={onClick}
      aria-label="Delete item"
    >
      <Minus fontSize="16px" />
    </button>
  );
}
