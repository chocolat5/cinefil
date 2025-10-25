import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import Person from "@/components/favorites/Person";
import NoResult from "@/components/ui/NoResult";
import type { FavoritePerson } from "@/types/types";

interface FavoritePersonsViewProps {
  items: FavoritePerson[];
  itemsKey: "favActors" | "favDirectors";
}

export default function FavoritePersonsView({
  itemsKey,
  items,
}: FavoritePersonsViewProps): ReactElement {
  return (
    <>
      {items.length > 0 ? (
        <div className={classes.personContainer}>
          {items.map((item) => (
            <Person
              key={item.id}
              id={item.id}
              order={item.displayOrder as number}
              name={item.name}
              profilePath={item.profilePath}
              isEdit={false}
            />
          ))}
        </div>
      ) : (
        <NoResult name={itemsKey === "favActors" ? "actors" : "directors"} />
      )}
    </>
  );
}
