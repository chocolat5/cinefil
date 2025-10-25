import {
  Suspense,
  lazy,
  useCallback,
  useReducer,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, ReactElement } from "react";

import SectionContainer from "@/components/layout/SectionContainer";
import classes from "@/components/profile/Profile.module.css";
import ProfileView from "@/components/profile/ProfileView";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/ErrorText";
import * as Icon from "@/components/ui/Icons";
import Modal from "@/components/ui/Modal";
import TextArea from "@/components/ui/TextArea";
import TextInput from "@/components/ui/TextInput";
import { useAppStore } from "@/stores/useAppStore";
import type { Profile } from "@/types/types";
import { updateProfileApi } from "@/utils/api";
import { profileReducer } from "@/utils/profileReducer";
import { handleApiError } from "@/utils/useErrorHandler";
import {
  validateBio,
  validateBlueskyId,
  validateDisplayName,
  validateSocialAccountId,
  validateUrl,
} from "@/utils/validate";

const BottomSheet = lazy(() => import("@/components/ui/BottomSheet"));

interface ProfileEditProps {
  userId: string;
  userProfile: Profile;
}

export default function ProfileEdit({
  userId,
  userProfile,
}: ProfileEditProps): ReactElement {
  const [state, dispatch] = useReducer(profileReducer, {
    profile: userProfile,
    error: {},
    isValid: true,
  });
  const { showToast, editMode, handleEditMode } = useAppStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputProfile, setInputProfile] = useState<Profile>(state.profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleError = (error: { [key: string]: string }) => {
    dispatch({
      type: "error",
      error,
    });
  };

  const handleClearError = useCallback((field: string) => {
    dispatch({
      type: "clear",
      field,
    });
  }, []);

  const handleResetError = useCallback(() => {
    dispatch({
      type: "reset",
    });
  }, []);

  const handleDisplayNameOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setInputProfile({ ...inputProfile, [name]: value });

      // validate
      const errorText = validateDisplayName(value);
      if (errorText) {
        handleError({ displayName: errorText });
        return false;
      } else {
        handleClearError("displayName");
      }
    },
    [handleClearError, inputProfile]
  );

  const handleBioOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setInputProfile({ ...inputProfile, [name]: value });

      // validate
      const errorText = validateBio(value);
      if (errorText) {
        handleError({ bio: errorText });
        return false;
      } else {
        handleClearError("bio");
      }
    },
    [handleClearError, inputProfile]
  );

  const handleAvatarOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleClearError("avatar");
      if (!e.target.files) return false;
      const file = e.target.files[0];
      if (file.size > 2 * 1000 * 1024) {
        handleError({ avatar: "File with maximum size of 2MB is allowed" });
        e.target.value = "";
        return false;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Str = reader.result as string;
        setInputProfile({ ...inputProfile, avatar: base64Str });
      };
      reader.readAsDataURL(file);

      setIsOpen(false);
    },
    [handleClearError, inputProfile]
  );

  // delete avatar
  const handleAvatarDelete = async () => {
    try {
      if (userId) {
        await updateProfile({
          ...inputProfile,
          avatar: "",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      handleApiError(error, "delete avatar");
    }
  };

  const handleSocialLinksOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      // validate URL
      if (name === "website") {
        const errorText = value ? validateUrl(value) : null;
        if (errorText) {
          handleError({ website: errorText });
        } else {
          handleClearError("website");
        }
      }

      // validate Bluesky
      if (name === "bsky") {
        const errorText = value ? validateBlueskyId(value) : null;
        if (errorText) {
          handleError({ bsky: errorText });
        } else {
          handleClearError("bsky");
        }
      }

      if (name !== "website" && name !== "bsky") {
        const errorText = value ? validateSocialAccountId(value) : null;
        if (errorText) {
          handleError({ [name]: errorText });
        } else {
          handleClearError(name);
        }
      }

      setInputProfile({
        ...inputProfile,
        socialLinks: { ...inputProfile.socialLinks, [name]: value },
      });
    },
    [inputProfile, handleClearError]
  );

  const updateProfile = useCallback(async (profile: Profile) => {
    const previousProfile = profile;
    try {
      // update UI
      dispatch({
        type: "edit",
        profile: profile,
      });
    } catch (error) {
      // rollback
      dispatch({ type: "edit", profile: previousProfile });

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: { fetch: `Profile save failed, ${errorMessage}` },
      });
      throw error;
    }
  }, []);

  // save profile
  const onSave = async () => {
    const previousProfile = inputProfile;
    try {
      // fetch API
      await updateProfileApi(userId, inputProfile);
      // update UI
      dispatch({ type: "edit", profile: inputProfile });

      // reset
      dispatch({ type: "reset" });
      showToast("Profile updated!", "success");
      handleEditMode("none");
    } catch (error) {
      // rollback
      dispatch({ type: "edit", profile: previousProfile });

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: { fetch: `Profile save failed, ${errorMessage}` },
      });
    }
  };

  return (
    <SectionContainer
      currentEditMode="profile"
      isCurrentUser
      onClick={() => handleEditMode("profile")}
    >
      <ProfileView userProfile={state.profile} />
      <Modal
        isOpen={editMode === "profile"}
        onClose={() => {
          handleEditMode("none");
          setInputProfile(state.profile);
          handleResetError();
        }}
        title="Edit Profile"
      >
        <>
          <div className={classes.profile}>
            <button
              className={classes.avatarButton}
              onClick={() => setIsOpen(true)}
            >
              <Avatar
                url={inputProfile.avatar}
                alt={inputProfile.displayName}
                clickable
              />
            </button>
            <div>
              <label className={classes.label} htmlFor="displayName">
                Display name
              </label>
              <TextInput
                id="displayName"
                name="displayName"
                placeholder="Type your display name ..."
                value={inputProfile.displayName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDisplayNameOnChange(e)
                }
                autoFocus
              />
              {state.error.displayName && (
                <ErrorText>{state.error.displayName}</ErrorText>
              )}
            </div>
            <div>
              <label className={classes.label}>Discription (max 150)</label>
              <TextArea
                name="bio"
                placeholder="Type your bio ..."
                value={inputProfile.bio ?? ""}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleBioOnChange(e)
                }
                ariaLabel=""
                ariaDescribedby=""
              />
              {state.error.bio && <ErrorText>{state.error.bio}</ErrorText>}
            </div>
            <div>
              <div>
                <label className={classes.label}>Social media account</label>
                <p className={classes.description}>
                  Type username without "@" except website.
                </p>
              </div>
              <div className={classes.socialLinks}>
                <div>
                  <label className={classes.label} htmlFor="letterboxd">
                    <Icon.Letterboxd />
                    Letterboxd
                  </label>
                  <TextInput
                    className={classes.textInput}
                    id="letterboxd"
                    name="letterboxd"
                    placeholder="type without @"
                    value={inputProfile.socialLinks.letterboxd ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSocialLinksOnChange(e)
                    }
                  />
                  {state.error.letterboxd && (
                    <ErrorText>{state.error.letterboxd}</ErrorText>
                  )}
                </div>
                <div>
                  <label className={classes.label} htmlFor="twitter">
                    <Icon.Twitter />X (Twitter)
                  </label>
                  <TextInput
                    className={classes.textInput}
                    id="twitter"
                    name="twitter"
                    placeholder="type without @"
                    value={inputProfile.socialLinks.twitter ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSocialLinksOnChange(e)
                    }
                  />
                  {state.error.twitter && (
                    <ErrorText>{state.error.twitter}</ErrorText>
                  )}
                </div>
                <div>
                  <label className={classes.label} htmlFor="bsky">
                    <Icon.Bluesky />
                    Bluesky
                  </label>
                  <TextInput
                    className={classes.textInput}
                    id="bsky"
                    name="bsky"
                    placeholder="type without @"
                    value={inputProfile.socialLinks.bsky ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSocialLinksOnChange(e)
                    }
                  />
                  {state.error.bsky && (
                    <ErrorText>{state.error.bsky}</ErrorText>
                  )}
                </div>
                <div>
                  <label className={classes.label} htmlFor="instagram">
                    <Icon.Instagram />
                    Instagram
                  </label>
                  <TextInput
                    className={classes.textInput}
                    id="instagram"
                    name="instagram"
                    placeholder="type without @"
                    value={inputProfile.socialLinks.instagram ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSocialLinksOnChange(e)
                    }
                  />
                  {state.error.instagram && (
                    <ErrorText>{state.error.instagram}</ErrorText>
                  )}
                </div>
                <div>
                  <label className={classes.label} htmlFor="filmarks">
                    <Icon.Filmarks />
                    Filmarks
                  </label>
                  <TextInput
                    className={classes.textInput}
                    id="filmarks"
                    name="filmarks"
                    placeholder="type without @"
                    value={inputProfile.socialLinks.filmarks ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSocialLinksOnChange(e)
                    }
                  />
                  {state.error.filmarks && (
                    <ErrorText>{state.error.filmarks}</ErrorText>
                  )}
                </div>
                <div>
                  <label className={classes.label} htmlFor="website">
                    <Icon.Link />
                    Your website URL
                  </label>
                  <TextInput
                    className={classes.textInput}
                    id="website"
                    name="website"
                    placeholder="https://example.com"
                    value={inputProfile.socialLinks.website ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSocialLinksOnChange(e)
                    }
                  />
                  {state.error.website && (
                    <ErrorText>{state.error.website}</ErrorText>
                  )}
                </div>
              </div>
            </div>
            <Button
              className={classes.editButton}
              onClick={() => onSave()}
              disabled={!state.isValid}
            >
              Finish edit
            </Button>
          </div>

          <Suspense fallback={null}>
            <BottomSheet
              isOpen={isOpen}
              onClose={() => {
                handleClearError("avatar");
                setIsOpen(false);
              }}
            >
              <>
                <input
                  ref={fileInputRef}
                  name="avatar"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleAvatarOnChange(e)
                  }
                />
                {state.error.avatar && (
                  <ErrorText>{state.error.avatar}</ErrorText>
                )}
                {inputProfile.avatar && (
                  <Button
                    className={classes.removeButton}
                    variant="outlined"
                    onClick={() => {
                      setIsOpen(false);
                      setInputProfile({ ...inputProfile, avatar: "" });
                      handleAvatarDelete();
                    }}
                  >
                    Remove Avatar
                  </Button>
                )}
              </>
            </BottomSheet>
          </Suspense>
        </>
      </Modal>
    </SectionContainer>
  );
}
