import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import NoResult from "@/components/ui/NoResult";
import type { FavoriteQuote } from "@/types/types";

interface FavoriteQuoteViewProps {
  item: FavoriteQuote;
}

export default function FavoriteQuoteView({
  item,
}: FavoriteQuoteViewProps): ReactElement {
  return (
    <div className={classes.quoteContainer}>
      {item.text ? (
        <>
          <p className={classes.quoteText}>{item.text}</p>
          {item.title && (
            <p className={classes.quoteTitle}>&#9472; {item.title}</p>
          )}
        </>
      ) : (
        <NoResult name="Quote" />
      )}
    </div>
  );
}
