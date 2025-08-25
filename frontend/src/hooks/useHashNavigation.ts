import { useEffect, useRef, useCallback } from "react";
import type { IHighlight } from "react-pdf-highlighter";
import { parseIdFromHash, resetHash } from "../utils/helpers";

export const useHashNavigation = (deadlines: Array<{ id: string; highlight?: IHighlight }>) => {
  const scrollViewerTo = useRef((_highlight: IHighlight) => { });

  const scrollToHighlightFromHash = useCallback(() => {
    const id = parseIdFromHash();
    if (!id) {
      return;
    }
    const highlight = getHighlightById(id, deadlines);

    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  }, [deadlines]);

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false,
      );
    };
  }, [scrollToHighlightFromHash]);

  const getHighlightById = (id: string, deadlines: Array<{ id: string; highlight?: IHighlight }>) => {
    const deadline = deadlines.find((deadline) => deadline.highlight?.id === id);
    const highlight = deadline?.highlight;

    if (!highlight) {
      console.log("Highlight not found");
    }
    return highlight;
  };

  const handleScrollRef = (scrollTo: (highlight: IHighlight) => void) => {
    scrollViewerTo.current = scrollTo;
    scrollToHighlightFromHash();
  };

  const scrollToDeadline = (deadlineId: string) => {
    const deadline = deadlines.find(d => d.id === deadlineId);
    if (deadline?.highlight && scrollViewerTo.current) {
      scrollViewerTo.current(deadline.highlight);
    }
  };

  return {
    handleScrollRef,
    scrollToDeadline,
    resetHash,
  };
};
