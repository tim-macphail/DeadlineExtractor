import {
  PdfHighlighter,
  PdfLoader,
} from "react-pdf-highlighter";
import type {
  IHighlight,
  ScaledPosition,
} from "react-pdf-highlighter";
import { Spinner } from "../Spinner";

interface PdfViewerProps {
  url: string;
  highlights: IHighlight[];
  onScrollChange: () => void;
  onScrollRef: (scrollTo: (highlight: IHighlight) => void) => void;
  onSelectionFinished: (
    position: ScaledPosition,
    content: { text?: string; image?: string },
    hideTipAndSelection: () => void,
    transformSelection: () => void,
  ) => React.JSX.Element;
  onHighlightTransform: (
    highlight: any,
    index: number,
    setTip: (highlight: any, callback: (highlight: any) => React.JSX.Element) => void,
    hideTip: () => void,
    viewportToScaled: (rect: any) => any,
    screenshot: (position: any) => string,
    isScrolledTo: boolean,
  ) => React.JSX.Element;
}

export const PdfViewer = ({
  url,
  highlights,
  onScrollChange,
  onScrollRef,
  onSelectionFinished,
  onHighlightTransform,
}: PdfViewerProps) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "75vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <PdfLoader url={url} beforeLoad={<Spinner />}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(event) => event.altKey}
            onScrollChange={onScrollChange}
            scrollRef={onScrollRef}
            onSelectionFinished={onSelectionFinished}
            highlightTransform={onHighlightTransform}
            highlights={highlights}
          />
        )}
      </PdfLoader>
    </div>
  );
};
