import type { ReactElement, ReactNode } from "react";

import styles from "@/components/layout/SectionContainer.module.css";

interface SectionContainerViewProps {
  title?: string;
  children: ReactNode;
}

export default function SectionContainerView({
  title,
  children,
}: SectionContainerViewProps): ReactElement {
  return (
    <section className={styles.container}>
      {title && (
        <div className={styles.titleWrap}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}
