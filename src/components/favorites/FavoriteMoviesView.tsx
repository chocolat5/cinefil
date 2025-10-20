import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import Poster from "@/components/favorites/Poster";
import NoResult from "@/components/ui/NoResult";
import type { FavoriteMovie } from "@/types/types";

interface FavoriteMoviesViewProps {
  items: FavoriteMovie[];
}

export default function FavoriteMoviesView({
  items,
}: FavoriteMoviesViewProps): ReactElement {
  return (
    <>
      {items.length > 0 ? (
        <div className={classes.movieContainerView}>
          {items.map((item) => (
            <Poster
              key={item.id}
              className={classes.moviePoster}
              id={item.id}
              order={item.displayOrder as number}
              title={item.title}
              posterPath={item.posterPath}
              year={item.year}
              isEdit={false}
            />
          ))}
        </div>
      ) : (
        <NoResult name="films" />
      )}
    </>
  );
}
