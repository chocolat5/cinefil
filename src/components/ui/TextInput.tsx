import type { ChangeEvent, HTMLInputTypeAttribute, ReactElement } from "react";

import classes from "@/components/ui/Forms.module.css";

interface TextInputProps {
  className?: string;
  id?: string;
  placeholder: string;
  value?: string;
  defaultValue?: string;
  name: string;
  inputType?: HTMLInputTypeAttribute;
  pattern?: string;
  type?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

export default function TextInput({
  className,
  id,
  placeholder,
  name,
  value,
  pattern,
  defaultValue,
  type,
  onChange,
  autoFocus,
}: TextInputProps): ReactElement {
  return (
    <input
      className={`${classes.input} ${className}`}
      id={id}
      name={name}
      type={type}
      pattern={pattern}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      autoFocus={autoFocus}
    />
  );
}
