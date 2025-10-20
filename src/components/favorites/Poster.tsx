import type { DragEvent, ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import DeleteIconButton from "@/components/ui/DeleteIconButton";
import NameText from "@/components/ui/NameText";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import type { FavoriteMovie } from "@/types/types";
import { getPosterURL } from "@/utils/tmdb";

interface PosterProps {
  className?: string;
  onDelete?: (id: number) => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  isEdit: boolean;
  order: number;
}

export default function Poster({
  className,
  id,
  order,
  title,
  posterPath,
  year,
  onDelete,
  onReorder,
  isEdit,
}: FavoriteMovie & PosterProps): ReactElement {
  const dnd = useDragAndDrop();
  return (
    <div className={`${classes.poster} ${className || ""}`}>
      {isEdit && !!onDelete && (
        <button className={classes.posterButtonDelete}>
          <DeleteIconButton onClick={() => onDelete(id)} />
        </button>
      )}
      <div
        className={classes.posterContainer}
        draggable={isEdit}
        onDragStart={(e: DragEvent<HTMLDivElement>) => {
          if (!isEdit) return;
          dnd.onDragStart(e, order);
        }}
        onDrop={(e) => {
          if (!isEdit || !onReorder) return;
          dnd.onDrop(e, order, onReorder);
        }}
        onDragOver={(e) => {
          if (!isEdit) return;
          dnd.onDragOver(e);
        }}
      >
        <img
          className={classes.posterImage}
          src={getPosterURL(posterPath)}
          alt={title}
          fetchPriority={order < 3 ? "high" : undefined}
        />
      </div>
      <NameText className={classes.posterTitle}>{title}</NameText>
      <p className={classes.posterYear}>{year}</p>
    </div>
  );
}
