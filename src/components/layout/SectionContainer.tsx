import type { ReactElement, ReactNode } from "react";

import styles from "@/components/layout/SectionContainer.module.css";
import { Pencil as PencilIcon } from "@/components/ui/Icons";
import { useAppStore } from "@/stores/useAppStore";
import type { EditMode } from "@/types/types";

interface MainContainerProps {
  isCurrentUser?: boolean;
  onClick?: () => void;
  title?: string;
  children: ReactNode;
  currentEditMode: EditMode;
}

export default function SectionContainer({
  onClick,
  title,
  children,
  currentEditMode,
}: MainContainerProps): ReactElement {
  const { editMode } = useAppStore();
  const isEdit = currentEditMode === editMode;

  return (
    <section className={styles.container}>
      <div
        className={`${styles.titleWrap} ${!title ? styles["-noTitle"] : ""}`}
      >
        {title && <h2 className={styles.title}>{title}</h2>}
        {!isEdit && (
          <div className={styles.buttonWrap}>
            <button
              className={styles.button}
              data-type="button-edit"
              onClick={onClick}
              disabled={editMode !== "none" && editMode !== currentEditMode}
            >
              <PencilIcon />
              Edit
            </button>
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
