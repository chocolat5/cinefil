import type { DragEvent, ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import DeleteIconButton from "@/components/ui/DeleteIconButton";
import NameText from "@/components/ui/NameText";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import type { FavoritePerson } from "@/types/types";
import { getPosterURL } from "@/utils/tmdb";

interface PersonProps {
  onDelete?: (id: number) => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  isEdit: boolean;
  order: number;
}

export default function Person({
  id,
  name,
  profilePath,
  order,
  isEdit,
  onDelete,
  onReorder,
}: FavoritePerson & PersonProps): ReactElement {
  const dnd = useDragAndDrop();
  return (
    <div className={classes.person}>
      <div className={classes.personImageWrap}>
        {isEdit && !!onDelete && (
          <div className={classes.personButtonDelete}>
            <DeleteIconButton onClick={() => onDelete(id)} />
          </div>
        )}
        <div
          className={classes.personImageContainer}
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
            className={classes.personImage}
            src={getPosterURL(profilePath)}
            alt={name}
          />
        </div>
      </div>
      <NameText>{name}</NameText>
    </div>
  );
}
