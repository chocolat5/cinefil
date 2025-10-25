import type { ReactElement } from "react";

import { Close as CloseIcon } from "@/components/ui/Icons";
import classes from "@/components/ui/Toast.module.css";
import { useAppStore } from "@/stores/useAppStore";

export default function Toast(): ReactElement | null {
  const { toast, closeToast } = useAppStore();
  return toast.isVisible ? (
    <div className={`${classes.toast} ${classes[`-${toast.type}`]}`}>
      <div className={classes.toastBody}>{toast.message}</div>
      <button className={classes.button} onClick={() => closeToast()}>
        <CloseIcon />
      </button>
    </div>
  ) : null;
}
