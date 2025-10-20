import { useCallback, useEffect, useMemo } from "react";
import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import FavoriteTheatersView from "@/components/favorites/FavoriteTheatersView";
import SectionContainer from "@/components/layout/SectionContainer";
import { Actions } from "@/components/ui/Actions";
import ErrorText from "@/components/ui/ErrorText";
import TextArea from "@/components/ui/TextArea";
import { FAVORITES_MAP } from "@/config/constants";
import useFavoriteTheaters from "@/hooks/useFavoriteTheaters";
import { useAppStore } from "@/stores/useAppStore";
import { debounce } from "@/utils/debounce";
import { handleApiError } from "@/utils/useErrorHandler";
import { validateTheaterName } from "@/utils/validate";

interface FavoriteTheatersEditProps {
  userId: string | undefined;
  userFavTheaters: string[];
}

export default function FavoriteTheatersEdit({
  userId,
  userFavTheaters,
}: FavoriteTheatersEditProps): ReactElement | null {
  const max = 3;

  const { handleEditMode, editMode, showToast } = useAppStore();
  const theaterData = useFavoriteTheaters({
    items: userFavTheaters,
    userId,
    error: "Oops! You can choose 3 cinemas.",
    isValid: true,
  });

  // update inputTheaters
  const handleOnChange = useCallback(
    (value: string) => {
      theaterData.handleResetError();
      // if textarea is empty
      if (value === "") {
        theaterData.handleEdit([]);
        return;
      }

      // if textarea has value
      const newTheaters = value.split(",").filter((theater) => theater.trim());

      // check max
      if (newTheaters.length > max) {
        theaterData.handleError();
        return;
      }

      // validate
      const invalidTheater = newTheaters
        .filter((theater) => theater.trim()) // except empty letters
        .find((theater) => validateTheaterName(theater.trim()) !== null);
      if (invalidTheater) {
        theaterData.handleError(
          validateTheaterName(invalidTheater.trim()) as string
        );
      }

      theaterData.handleEdit(value.split(","));
    },
    [theaterData]
  );

  const debounceHandleOnChange = useMemo(() => {
    return debounce(handleOnChange, 300);
  }, [handleOnChange]);

  // clean up debounce
  useEffect(() => {
    return () => {
      debounceHandleOnChange.cancel();
    };
  }, [debounceHandleOnChange]);

  const onSave = async () => {
    try {
      await theaterData.handleSave(userId as string);
    } catch (error) {
      handleApiError(error, "save theaters");
    } finally {
      showToast(`Top 3 theaters updated!`, "success");
      handleEditMode("none");
    }
  };

  const key = "theaters";

  return (
    <SectionContainer
      currentEditMode={key}
      onClick={() => handleEditMode(key)}
      title={FAVORITES_MAP[key].title}
    >
      {editMode === key ? (
        <>
          <p className={classes.theaterCaution}>
            Up to 3 cinemas, separated by commas (e.g., BFI IMAX, AMC Lincoln
            Square)
          </p>
          <TextArea
            placeholder="Type theater name ..."
            name="theaters"
            value={theaterData.state.favTheaters.join(",")}
            onChange={(e) => handleOnChange(e.target.value)}
            ariaLabel="Enter your favorite movie theaters, separated by commas"
            ariaDescribedby="theater-instructions"
          />
          {theaterData.state.error && (
            <ErrorText>{theaterData.state.error}</ErrorText>
          )}
          <Actions
            onCancel={() => handleEditMode("none")}
            onSave={() => onSave()}
            disableSave={!theaterData.state.isValid}
          />
        </>
      ) : (
        <FavoriteTheatersView items={theaterData.state.favTheaters} />
      )}
    </SectionContainer>
  );
}
