import type { DragEvent } from "react";

export default function useDragAndDrop() {
  return {
    onDragStart: (event: DragEvent<HTMLDivElement>, index: number) => {
      event.dataTransfer.setData("text/plain", index.toString());
    },
    onDragOver: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    onDrop: (
      event: DragEvent<HTMLDivElement>,
      index: number,
      onReorder: (oldIndex: number, newIndex: number) => void
    ) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("text/plain");
      onReorder(Number(data) - 1, index - 1);
    },
  };
}
