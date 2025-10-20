import type { ReactElement } from "react";

import classes from "@/components/ui/Actions.module.css";
import Button from "@/components/ui/Button";
import { Plus as PlusIcon } from "@/components/ui/Icons";

interface ActionsProps {
  disableAdd?: boolean;
  disableSave: boolean;
  onAdd?: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function Actions({
  disableAdd,
  disableSave,
  onAdd,
  onCancel,
  onSave,
}: ActionsProps): ReactElement {
  return (
    <div className={classes.buttonWrap}>
      {onAdd && !disableAdd && (
        <Button
          className={classes.addButton}
          variant="outlined"
          onClick={onAdd}
        >
          <PlusIcon className={classes.addIcon} />
          Add
        </Button>
      )}
      <Button variant="solid" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSave} disabled={disableSave}>
        Save
      </Button>
    </div>
  );
}
