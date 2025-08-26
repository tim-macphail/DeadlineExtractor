import React from "react";
import {
  AreaHighlight,
  Highlight,
  Popup,
} from "react-pdf-highlighter";
import type {
  ScaledPosition,
} from "react-pdf-highlighter";

import { HighlightPopup } from "../components/HighlightPopup/HighlightPopup";

export interface UsePdfCallbacksProps {
  updateHighlight: (highlightId: string, position: Partial<ScaledPosition>, content: Partial<{ text?: string; image?: string }>) => void;
  addDeadlineWithHighlightAndEdit: (position: ScaledPosition, content: { text?: string; image?: string }) => void;
}

export const usePdfCallbacks = ({ updateHighlight, addDeadlineWithHighlightAndEdit }: UsePdfCallbacksProps) => {
  const handleSelectionFinished = React.useCallback((
    position: ScaledPosition,
    content: { text?: string; image?: string },
    hideTipAndSelection: () => void,
    transformSelection: () => void,
  ) => {
    return (
      <button
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() => {
          addDeadlineWithHighlightAndEdit(position, content);
          hideTipAndSelection();
          transformSelection();
        }}
      >
        Add deadline
      </button>
    );
  }, [addDeadlineWithHighlightAndEdit]);

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
