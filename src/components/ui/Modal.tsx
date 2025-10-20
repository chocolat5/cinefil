import type { ReactElement } from "react";

import { Close as CloseIcon } from "@/components/ui/Icons";
import classes from "@/components/ui/Modal.module.css";

interface ModalProps {
  children: ReactElement;
  title: string;
  isOpen: boolean;
  onClose?: () => void;
}

export default function Modal({
  children,
  title,
  isOpen,
  onClose,
}: ModalProps): ReactElement | null {
  return isOpen ? (
    <aside
      className={classes.modal}
      data-modal="open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(e) => {
        if (e.key === "Escape" && onClose) {
          onClose();
        }
      }}
      tabIndex={-1}
    >
      <div className={classes.container}>
        <div className={classes.header}>
          <h2 className={classes.title} id="modal-title">
            {title}
          </h2>
          <button
            className={classes.button}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </aside>
  ) : null;
}
