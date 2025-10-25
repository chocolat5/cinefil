import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";

import classes from "@/components/ui/Button.module.css";

interface ButtonProps {
  children: string | ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  variant?: "contained" | "outlined" | "solid";
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function Button({
  children,
  type,
  variant = "contained",
  onClick,
  style,
  disabled,
  className,
  ariaLabel,
}: ButtonProps): ReactElement {
  return (
    <button
      className={`${classes.button} ${className ? className : ""} ${classes[`-${variant}`]}`}
      onClick={onClick}
      type={type}
      style={style}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
