import type { ChangeEvent, ReactElement } from "react";

import classes from "@/components/ui/Forms.module.css";

interface TextAreaProps {
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  ariaLabel: string;
  ariaDescribedby: string;
  required?: boolean;
}

export default function TextArea({
  placeholder,
  name,
  value,
  onChange,
  ariaLabel,
  ariaDescribedby,
}: TextAreaProps): ReactElement {
  return (
    <textarea
      className={classes.textarea}
      rows={5}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
    />
  );
}
