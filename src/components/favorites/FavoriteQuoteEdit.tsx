import { useCallback, useEffect, useMemo } from "react";
import type { ChangeEvent, ReactElement } from "react";

import TextInput from "../ui/TextInput";
import classes from "@/components/favorites/Favorite.module.css";
import FavoriteQuoteView from "@/components/favorites/FavoriteQuoteView";
import SectionContainer from "@/components/layout/SectionContainer";
import { Actions } from "@/components/ui/Actions";
import ErrorText from "@/components/ui/ErrorText";
import TextArea from "@/components/ui/TextArea";
import { FAVORITES_MAP } from "@/config/constants";
import useFavoriteQuote from "@/hooks/useFavoriteQuote";
import { useAppStore } from "@/stores/useAppStore";
import type { FavoriteQuote } from "@/types/types";
import { debounce } from "@/utils/debounce";
import { handleApiError } from "@/utils/useErrorHandler";
import { validateQuote, validateQuoteTitle } from "@/utils/validate";

interface FavoriteQuoteEditProps {
  userId: string | undefined;
  userFavQuote: FavoriteQuote;
}

export default function FavoriteQuoteEdit({
  userId,
  userFavQuote,
}: FavoriteQuoteEditProps): ReactElement | null {
  const { handleEditMode, editMode, showToast } = useAppStore();

  const quoteData = useFavoriteQuote({
    item: userFavQuote,
    userId,
    isValid: true,
  });

  // update inputQuote
  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      quoteData.handleResetError();

      // if empty
      if (value === "") {
        quoteData.handleEdit({
          ...quoteData.state.favQuote,
          [name]: "",
        } as unknown as FavoriteQuote);
        return;
      }

      // validate
      if (name === "text") {
        const errorText = value ? validateQuote(value) : null;
        if (errorText) {
          quoteData.handleError({ text: errorText });
        } else {
          quoteData.handleClearError("text");
        }
      }
      if (name === "title") {
        const errorText = value ? validateQuoteTitle(value) : null;
        if (errorText) {
          quoteData.handleError({ title: errorText });
        } else {
          quoteData.handleClearError("title");
        }
      }

      quoteData.handleEdit({
        ...quoteData.state.favQuote,
        [name]: value,
      } as unknown as FavoriteQuote);
    },
    [quoteData]
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
    if (quoteData.state.favQuote.title && !quoteData.state.favQuote.text) {
      quoteData.handleError({ text: "Quote field is required" });
      return;
    }
    try {
      await quoteData.handleSave(userId as string);
      showToast(`Favorite quote updated!`, "success");
      handleEditMode("none");
    } catch (error) {
      handleApiError(error, "Save quote");
    }
  };

  const key = "quote";

  return (
    <SectionContainer
      currentEditMode={key}
      onClick={() => handleEditMode(key)}
      title={FAVORITES_MAP[key].title}
    >
      {editMode === key ? (
        <>
          <p className={classes.quoteCaution}>
            Type your favorite quote from movies.
          </p>
          <div className={classes.quoteInputWrap}>
            <label className={classes.quoteLabel}>Quote:</label>
            <TextArea
              placeholder="Type quote ..."
              name="text"
              value={quoteData.state.favQuote.text}
              onChange={(e) => handleOnChange(e)}
              ariaLabel="Enter your favorite quote from movies"
              ariaDescribedby="quote-instructions"
            />
            {quoteData.state.error.text && (
              <ErrorText>{quoteData.state.error.text}</ErrorText>
            )}
          </div>
          <div className={classes.quoteInputWrap}>
            <label htmlFor="title" className={classes.quoteLabel}>
              Movie Title:
            </label>
            <TextInput
              placeholder="Type title of quote"
              id="title"
              name="title"
              defaultValue={quoteData.state.favQuote.title}
              onChange={(e) => handleOnChange(e)}
            />
            {quoteData.state.error.title && (
              <ErrorText>{quoteData.state.error.title}</ErrorText>
            )}
          </div>
          <Actions
            onCancel={() => {
              quoteData.handleReset();
              handleEditMode("none");
            }}
            onSave={() => onSave()}
            disableSave={!quoteData.state.isValid}
          />
        </>
      ) : (
        <FavoriteQuoteView item={quoteData.state.favQuote} />
      )}
    </SectionContainer>
  );
}
