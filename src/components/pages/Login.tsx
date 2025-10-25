import { useState } from "react";
import type { FormEvent, ReactElement } from "react";

import { navigate } from "astro:transitions/client";

import classes from "@/components/pages/Login.module.css";
import Button from "@/components/ui/Button";
import ErrorText from "@/components/ui/ErrorText";
import TextInput from "@/components/ui/TextInput";
import type { ApiError } from "@/types/types";
import { loginApi } from "@/utils/api";
import { verifyLoginCode } from "@/utils/auth";
import { getErrorMessage } from "@/utils/helpers";
import { handleApiError } from "@/utils/useErrorHandler";
import { validateEmail } from "@/utils/validate";

type Status = "idle" | "loading" | "sent" | "verifying" | "error";

export default function Login(): ReactElement {
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputLoginCode, setInputLoginCode] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>("");

  // for sending verification code
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    // check email
    const error = validateEmail(inputEmail);
    if (error) {
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
      setStatus("error");
      setError(error);
      return true;
    }

    // send magic link
    try {
      await loginApi(inputEmail);
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      const apiError = error as ApiError;
      setError(getErrorMessage(apiError));
    }
  }

  // for logging in
  async function startFetching(loginCode: number) {
    try {
      const data = await verifyLoginCode(loginCode);
      if (data?.needsRegistration) {
        sessionStorage.setItem("registrationEmail", data.email as string);
        // redirect to register for new user
        navigate(`/register`, { history: "replace" });
      } else {
        // redirect to profile for login
        navigate(`/${data?.userId}`, { history: "replace" });
      }
    } catch (error) {
      handleApiError(error, "send login");
      setStatus("error");
    }
  }

  // for entering verification code
  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const codeAsNumber = Number(inputLoginCode);
    if (!codeAsNumber || isNaN(codeAsNumber) || inputLoginCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setStatus("verifying");

    try {
      // login
      await startFetching(codeAsNumber);
    } catch (error) {
      handleApiError(error, "verify login code");
      setStatus("error");
    }
  }

  const renderBody = () => {
    switch (status) {
      case "idle": {
        return (
          <>
            <h2 className={classes.title}>Login</h2>
            <p className={classes.bodyText}>
              We'll email you a 6-digit code for a password-free log in.
            </p>
            <form onSubmit={(event) => onSubmit(event)}>
              <TextInput
                name="email"
                type="email"
                value={inputEmail}
                placeholder="type your email to login..."
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  if (error) setError("");
                }}
              />
              {error && <ErrorText>{error}</ErrorText>}
              <Button
                className={classes.button}
                type="submit"
                disabled={inputEmail === ""}
              >
                Send email
              </Button>
            </form>
          </>
        );
      }
      case "loading": {
        return (
          <>
            <h2 className={classes.title}>Sending email...</h2>
            <p className={classes.bodyText}>
              Please wait while we send the link to your email.
              <br />
              This may take a few seconds.
            </p>
          </>
        );
      }
      case "sent": {
        return (
          <>
            <h2 className={classes.title}>Check your email</h2>
            <p className={classes.bodyText}>
              We sent a code to <br />
              {inputEmail}
              <br />
              Enter that code to log in or sign up.
            </p>
            <form onSubmit={(event) => onLogin(event)}>
              <TextInput
                name="loginCode"
                type="number"
                pattern="[0-9]*"
                inputType="numeric"
                value={inputLoginCode}
                placeholder="Enter verification code"
                onChange={(e) => {
                  setInputLoginCode(e.target.value);
                }}
              />
              {error && <ErrorText>{error}</ErrorText>}
              <Button
                className={classes.button}
                type="submit"
                disabled={inputLoginCode === undefined}
              >
                Continue
              </Button>
            </form>
          </>
        );
      }
      case "verifying": {
        return (
          <>
            <h2 className={classes.title}>Verifying ...</h2>
            <p className={classes.bodyText}>
              Please wait while we log you in ...
            </p>
          </>
        );
      }
      case "error": {
        return (
          <>
            <h2 className={classes.title}>Login failed. </h2>
            <p className={classes.bodyText}>
              Please check your email and try again.
            </p>
            <ErrorText>{error}</ErrorText>
            <Button
              className={classes.button}
              variant="outlined"
              onClick={() => {
                setStatus("idle");
                setError("");
              }}
            >
              Retry
            </Button>
          </>
        );
      }
      default: {
        throw new Error(error || "Unknown error");
      }
    }
  };

  return <>{renderBody()}</>;
}
