import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import Chip from "@/components/ui/Chip";
import NoResult from "@/components/ui/NoResult";
import type { FavoriteGenre } from "@/types/types";
import { getGenreName } from "@/utils/genres";

interface FavoriteGenresViewProps {
  items: FavoriteGenre[];
}

export default function FavoriteGenresView({
  items,
}: FavoriteGenresViewProps): ReactElement {
  return (
    <div className={classes.chipContainer}>
      {items.length > 0 ? (
        <div className={classes.chipWrap}>
          {items.map((item) => (
            <Chip key={item.id} label={getGenreName(item.id)} />
          ))}
        </div>
      ) : (
        <NoResult name="genres" />
      )}
    </div>
  );
}
