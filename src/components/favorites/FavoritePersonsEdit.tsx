import type { ReactElement } from "react";

import {
  FavoritePersonsView,
  Person,
  SearchPerson,
} from "@/components/favorites";
import classes from "@/components/favorites/Favorite.module.css";
import SectionContainer from "@/components/layout/SectionContainer";
import { Actions } from "@/components/ui/Actions";
import NoResult from "@/components/ui/NoResult";
import { FAVORITES_MAP } from "@/config/constants";
import useFavoritePersons from "@/hooks/useFavoritePersons";
import { useAppStore } from "@/stores/useAppStore";
import type { FavoritePerson, PersonType } from "@/types/types";
import { handleApiError } from "@/utils/useErrorHandler";

interface FavoritePersonsEditProps {
  userId: string;
  type: PersonType;
  userFavPersons: FavoritePerson[];
}

export default function FavoritePersonsEdit({
  userId,
  type,
  userFavPersons,
}: FavoritePersonsEditProps): ReactElement {
  const { handleEditMode, editMode, showToast } = useAppStore();
  const data = useFavoritePersons({
    items: userFavPersons,
    userId: userId as string,
    itemsKey: FAVORITES_MAP[type].itemsKey,
    error: `You really like this ${FAVORITES_MAP[type].name}! But it’s already selected.`,
    isValid: true,
  });

  const onSave = async () => {
    try {
      await data.handleSave(userId);
      data.handleResetError();
    } catch (error) {
      handleApiError(error, `save ${type}`);
    } finally {
      showToast(`Favorite ${type} updated!`, "success");
      handleEditMode("none");
    }
  };

  const emptyNum = 3 - data.state.items.length;

  return (
    <SectionContainer
      currentEditMode={type}
      onClick={() => handleEditMode(type)}
      title={FAVORITES_MAP[type].title}
    >
      {editMode === type ? (
        <>
          {data.state.items.length > 1 && (
            <p className={classes.personDescription}>
              You can change the order with drag and drop
            </p>
          )}
          {data.state.items.length > 0 ? (
            <div className={classes.personContainer}>
              {data.state.items.map((item) => (
                <Person
                  key={item.id}
                  id={item.id}
                  order={item.displayOrder as number}
                  name={item.name}
                  profilePath={item.profilePath}
                  isEdit
                  onDelete={data.handleDelete}
                  onReorder={data.handleReorder}
                />
              ))}
              {emptyNum > 0 &&
                Array.from({ length: emptyNum }).map((_, i) => (
                  <div key={i} className={classes.personBlank}></div>
                ))}
            </div>
          ) : (
            <NoResult name={FAVORITES_MAP[type].itemsKey} />
          )}
          <Actions
            disableAdd={emptyNum === 0}
            disableSave={!data.state.isValid}
            onAdd={() => data.setIsOpen(true)}
            onCancel={() => handleEditMode("none")}
            onSave={() => onSave()}
          />
          <SearchPerson
            department={FAVORITES_MAP[type].department}
            isOpen={data.isOpen}
            onClose={() => {
              data.handleResetError();
              data.setIsOpen(false);
            }}
            onAdd={data.handleAdd}
            onResetError={data.handleResetError}
            error={data.state.error}
          />
        </>
      ) : (
        <FavoritePersonsView
          items={data.state.items}
          itemsKey={FAVORITES_MAP[type].itemsKey}
        />
      )}
    </SectionContainer>
  );
}
