import type { IHighlight, ScaledPosition } from "react-pdf-highlighter";
import type { Deadline } from "../types";

export const updateHighlight = (
  highlightId: string,
  position: Partial<ScaledPosition>,
  content: Partial<{ text?: string; image?: string }>,
  deadlines: Deadline[],
  setDeadlines: React.Dispatch<React.SetStateAction<Deadline[]>>
) => {
  console.log("Updating highlight", highlightId, position, content);
  setDeadlines((prevDeadlines) =>
    prevDeadlines.map((deadline) => {
      if (deadline.highlight?.id === highlightId) {
        const updatedHighlight = {
          ...deadline.highlight,
          position: { ...deadline.highlight.position, ...position },
          content: { ...deadline.highlight.content, ...content },
        };
        return { ...deadline, highlight: updatedHighlight };
      }
      return deadline;
    }),
  );
};
