import type { ReactElement } from "react";

import classes from "@/components/ui/BottomSheet.module.css";
import Button from "@/components/ui/Button";

interface BottomSheetProps {
  children: ReactElement;
  isOpen: boolean;
  onClose: () => void;
}

export default function BottomSheet({
  children,
  isOpen,
  onClose,
}: BottomSheetProps): ReactElement | null {
  return (
    <>
      <div
        className={`${classes.bottomSheet} ${isOpen ? classes.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Dialog"
      >
        <div className={classes.container} id="Dialog">
          {children}
          <Button
            className={classes.button}
            variant="solid"
            onClick={onClose}
            style={{ marginTop: 20 }}
          >
            Close
          </Button>
        </div>
      </div>
      <div
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        className={`${classes.backdrop} ${isOpen ? classes.show : ""}`}
        role="presentation"
      />
    </>
  );
}
