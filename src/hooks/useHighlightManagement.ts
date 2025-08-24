import type { ScaledPosition } from "react-pdf-highlighter";
import { updateHighlight as updateHighlightUtil } from "../utils/highlightUtils";
import type { Deadline } from "../types";

export const useHighlightManagement = (
  deadlines: Deadline[],
  setDeadlines: React.Dispatch<React.SetStateAction<Deadline[]>>
) => {
  const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<{ text?: string; image?: string }>,
  ) => {
    updateHighlightUtil(highlightId, position, content, setDeadlines);
  };

  // Compute highlights array from deadlines for PdfHighlighter
  const highlights = deadlines
    .filter(deadline => deadline.highlight)
    .map(deadline => deadline.highlight!);

  return {
    updateHighlight,
    highlights,
  };
};
