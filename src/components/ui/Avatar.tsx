import type { ReactElement } from "react";

import classes from "@/components/ui/Avatar.module.css";
import * as Icon from "@/components/ui/Icons";

interface AvatarProps {
  className?: string;
  url?: string;
  alt: string;
  clickable?: boolean;
}

export default function Avatar({
  className,
  url,
  alt,
  clickable,
}: AvatarProps): ReactElement {
  return (
    <div className={`${classes.wrap} ${className || ""}`}>
      {clickable && (
        <div className={classes.iconPlus}>
          <Icon.Plus />
        </div>
      )}
      <div
        className={classes.avatar}
        style={{ cursor: clickable ? "pointer" : "default" }}
      >
        {url ? (
          <img src={url} alt={alt} fetchPriority="high" />
        ) : (
          <p className={classes.avatarBlank}>{alt.substring(0, 1)}</p>
        )}
      </div>
    </div>
  );
}
