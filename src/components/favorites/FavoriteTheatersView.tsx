import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import NoResult from "@/components/ui/NoResult";

interface FavoriteTheatersViewProps {
  items: string[];
}

export default function FavoriteTheatersView({
  items,
}: FavoriteTheatersViewProps): ReactElement {
  return (
    <div className={classes.theaterContainer}>
      {items.length > 0 ? (
        items.map((item, index) => (
          <p key={`${item}-${index}`} className={classes.theaterText}>
            {item}
          </p>
        ))
      ) : (
        <NoResult name="theaters" />
      )}
    </div>
  );
}
