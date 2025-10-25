import type { ReactElement, ReactNode } from "react";

import classes from "@/components/ui/SocialIconLink.module.css";

interface SocialIconLinkProps {
  children: ReactNode;
  href: string;
  ariaLabel: string;
}

export default function SocialIconLink({
  href,
  children,
  ariaLabel,
}: SocialIconLinkProps): ReactElement {
  return (
    <a
      className={classes.socialLink}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
