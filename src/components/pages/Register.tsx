import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactElement } from "react";

import { navigate } from "astro:transitions/client";

import classes from "@/components/pages/Register.module.css";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/ErrorText";
import { RoundCheckCircle as CheckIcon } from "@/components/ui/Icons";
import TextInput from "@/components/ui/TextInput";
import { useAppStore } from "@/stores/useAppStore";
import { checkUserIdApi, createProfileApi, registerApi } from "@/utils/api";
import { debounce } from "@/utils/debounce";
import { validateDisplayName, validateUserId } from "@/utils/validate";

interface RegisterDataProps {
  userId: string;
  displayName: string;
}

export default function Register(): ReactElement {
  const { showToast } = useAppStore();

  const [email, setEmail] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const initialData = {
    userId: "",
    displayName: "",
  };

  async function onRegister(
    _prevState: {
      values?: RegisterDataProps;
      error: string;
    } | null,
    formData: FormData
  ) {
    const newData: RegisterDataProps = {
      userId: formData.get("userId") as string,
      displayName: formData.get("displayName") as string,
    };

    if (!email) {
      showToast("Session expired. Please log in again.", "error");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return {
        error: "Session expired",
        values: initialData,
      };
    }

    // validate displayName
    const errorDisplayName = validateDisplayName(newData.displayName);
    if (errorDisplayName) {
      return { error: errorDisplayName, values: newData };
    }

    // validate userId
    const errorUserId = validateUserId(newData.userId);
    if (errorUserId) {
      return { error: errorUserId, values: newData };
    }

    // register user
    const res = await registerApi(newData.userId, newData.displayName, email);
    if (!res || !res.success) {
      return { error: "Response error", values: newData };
    }

    // create profile
    const resProfile = await createProfileApi(newData.userId, {
      displayName: newData.displayName,
    });
    if (!resProfile.success) {
      return { error: "Response error", values: newData };
    }

    // show toast
    showToast("Welcome! Your profile is ready to ship!", "success");

    // redirect to user profile
    setTimeout(() => {
      navigate(`/${newData.userId}`, { history: "replace" });
    }, 100);

    // reset form data
    return { error: "", values: initialData };
  }

  const [state, formAction, pending] = useActionState(onRegister, {
    values: initialData,
    error: "",
  });

  const handleOnChange = useCallback(async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null);
      setIsChecking(null);
      return;
    }

    // validate userId
    const validationError = validateUserId(value);
    if (validationError) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      const available = await checkUserIdApi(value);
      setIsAvailable(available);
      setIsChecking(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const debounceHandleOnChange = useMemo(() => {
    return debounce(handleOnChange, 400);
  }, [handleOnChange]);

  // clean up debounce
  useEffect(() => {
    return () => {
      debounceHandleOnChange.cancel();
    };
  }, [debounceHandleOnChange]);

  // clean up session storage
  useEffect(() => {
    const email = sessionStorage.getItem("registrationEmail");
    if (email) {
      setEmail(email);
    }
    sessionStorage.removeItem("registrationEmail");
  }, []);

  return (
    <>
      <h2 className={classes.title}>Register</h2>
      <p className={classes.bodyText}>
        You don't have a profile yet.
        <br />
        User ID will be your profile URL (https://cinefil.me/YOURID).
        <br />
        You can't change it once you registered.
      </p>
      <form action={formAction}>
        <label htmlFor="userId" className={classes.label}>
          User ID
        </label>
        <div className={classes.inputWrap}>
          <TextInput
            className={classes.textInput}
            id="userId"
            name="userId"
            type="text"
            defaultValue={state.values.userId ?? ""}
            placeholder="type your ideal id"
            onChange={(e) => debounceHandleOnChange(e.target.value)}
          />
          {isAvailable === true && (
            <div className={classes.checkIcon}>
              <CheckIcon />
            </div>
          )}
        </div>
        {isChecking && <p className={classes.helperText}>Checking ...</p>}
        {isAvailable === false && (
          <ErrorText>
            That username is taken. How about trying a different one?
          </ErrorText>
        )}
        {state.error &&
          (state.error.includes("user") || state.error.includes("User")) && (
            <ErrorText>{state.error}</ErrorText>
          )}
        <label htmlFor="displayName" className={classes.label}>
          Display name
        </label>
        <TextInput
          id="displayName"
          name="displayName"
          type="text"
          defaultValue={state.values.displayName ?? ""}
          placeholder="type your display name"
        />
        {state.error &&
          (state.error.includes("display") ||
            state.error.includes("Display")) && (
            <ErrorText>{state.error}</ErrorText>
          )}
        <Button
          className={classes.button}
          type="submit"
          disabled={isAvailable !== true || isChecking || pending}
        >
          {pending ? "Waiting..." : "Register"}
        </Button>
      </form>
    </>
  );
}
