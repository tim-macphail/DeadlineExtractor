import React from "react";
import {
  AreaHighlight,
  Highlight,
  Popup,
} from "react-pdf-highlighter";
import type {
  IHighlight,
  ScaledPosition,
} from "react-pdf-highlighter";

import { HighlightPopup } from "../components/HighlightPopup/HighlightPopup";
import { getNextId } from "../utils/helpers";
import { UpsertDeadlineForm } from "../components/UpsertDeadlineForm/UpsertDeadlineForm";

export interface UsePdfCallbacksProps {
  addDeadline: (deadlineData: { name: string; date: string; description?: string }, highlight: IHighlight) => void;
  updateHighlight: (highlightId: string, position: Partial<ScaledPosition>, content: Partial<{ text?: string; image?: string }>) => void;
}

export const usePdfCallbacks = ({ addDeadline, updateHighlight }: UsePdfCallbacksProps) => {
  const handleSelectionFinished = React.useCallback((
    position: ScaledPosition,
    content: { text?: string; image?: string },
    hideTipAndSelection: () => void,
    transformSelection: () => void,
  ) => {
    return (
      <UpsertDeadlineForm
        onClose={hideTipAndSelection}
        onOpen={transformSelection}
        onAdd={(deadlineData: { name: string; date: string; description?: string }) => {
          // Create highlight first
          const newHighlightId = getNextId();
          const deadlineText = `${deadlineData.name} - ${new Date(deadlineData.date).toLocaleString()}`;

          const newHighlight: IHighlight = {
            id: newHighlightId,
            content,
            position,
            comment: {
              text: deadlineText,
              emoji: "⏰"
            }
          };

          // Create and add deadline with embedded highlight
          addDeadline(deadlineData, newHighlight);

          hideTipAndSelection();
        }}
      />
    );
  }, [addDeadline]);

  const handleHighlightTransform = React.useCallback((
    highlight: any,
    index: number,
    setTip: (highlight: any, callback: (highlight: any) => React.JSX.Element) => void,
    hideTip: () => void,
    viewportToScaled: (rect: any) => any,
    screenshot: (position: any) => string,
    isScrolledTo: boolean,
  ) => {
    const isTextHighlight = !highlight.content?.image;

    const component = isTextHighlight ? (
      <Highlight
        isScrolledTo={isScrolledTo}
        position={highlight.position}
        comment={highlight.comment}
      />
    ) : (
      <AreaHighlight
        isScrolledTo={isScrolledTo}
        highlight={highlight}
        onChange={(boundingRect: any) => {
          updateHighlight(
            highlight.id,
            { boundingRect: viewportToScaled(boundingRect) },
            { image: screenshot(boundingRect) },
          );
        }}
      />
    );

    return (
      <Popup
        popupContent={<HighlightPopup {...highlight} />}
        onMouseOver={(popupContent: React.JSX.Element) =>
          setTip(highlight, (_highlight: any) => popupContent)
        }
        onMouseOut={hideTip}
        key={index}
      >
        {component}
      </Popup>
    );
  }, [updateHighlight]);

  return {
    handleSelectionFinished,
    handleHighlightTransform,
  };
};
