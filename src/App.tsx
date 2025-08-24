import { useState, useEffect, useCallback, useRef } from "react";

import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
} from "react-pdf-highlighter";
import type {
  Content,
  IHighlight,
  ScaledPosition,
} from "react-pdf-highlighter";

import { Sidebar } from "./Sidebar";
import { Spinner } from "./Spinner";
import { UpsertDeadlineForm } from "./UpsertDeadlineForm";
import { UploadPrompt } from "./UploadPrompt";
import { testHighlights as _testHighlights } from "./test-highlights";

import "./style/App.css";
import "react-pdf-highlighter/dist/style.css";

export interface Deadline {
  id: string;
  name: string;
  date: string;
  description?: string;
  highlightId: string;
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text} Yeah yeah
    </div>
  ) : null;



export function App() {
  const [url, setUrl] = useState<string>("");
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);
  const [deadlines, setDeadlines] = useState<Array<Deadline>>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline>();
  const [showEditForm, setShowEditForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
      setHighlights([]); // Reset highlights for new document
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    const pdfFile = files.find(file => file.type === "application/pdf");

    if (pdfFile) {
      handleFileUpload(pdfFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const resetToUpload = () => {
    setUrl("");
    setHighlights([]);
    setDeadlines([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const scrollViewerTo = useRef((_highlight: IHighlight) => { });

  const scrollToHighlightFromHash = useCallback(() => {
    const id = parseIdFromHash();
    if (!id) {
      return;
    }
    const highlight = getHighlightById(id);

    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  }, [highlights]);

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

  const getHighlightById = (id: string) => {
    const highlight = highlights.find((highlight) => highlight.id === id);

    if (!highlight) {
      console.log("Highlight not found");
    }
    return highlight;
  };

  const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>,
  ) => {
    console.log("Updating highlight", highlightId, position, content);
    setHighlights((prevHighlights) =>
      prevHighlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
            id,
            position: { ...originalPosition, ...position },
            content: { ...originalContent, ...content },
            ...rest,
          }
          : h;
      }),
    );
  };

  const handleScrollRef = (scrollTo: (highlight: IHighlight) => void) => {
    scrollViewerTo.current = scrollTo;
    scrollToHighlightFromHash();
  };



  const addDeadline = (deadlineData: { name: string; date: string; description?: string }, highlightId: string) => {
    const newDeadline: Deadline = {
      id: getNextId(),
      name: deadlineData.name,
      date: deadlineData.date,
      description: deadlineData.description,
      highlightId: highlightId,
    };
    setDeadlines((prevDeadlines) => [newDeadline, ...prevDeadlines]);
  };

  const addStandaloneDeadline = (deadlineData: { name: string; date: string; description?: string }) => {
    const newDeadline: Deadline = {
      id: getNextId(),
      name: deadlineData.name,
      date: deadlineData.date,
      description: deadlineData.description,
      highlightId: "", // No highlight associated
    };
    setDeadlines((prevDeadlines) => [newDeadline, ...prevDeadlines]);
    setShowAddForm(false); // Hide the form after adding
    setShowEditForm(false); // Also hide edit form if it's open
  };

  const deleteDeadline = (deadlineId: string) => {
    setDeadlines((prevDeadlines) =>
      prevDeadlines.filter(deadline => deadline.id !== deadlineId)
    );
    // Also remove the associated highlight
    setHighlights((prevHighlights) =>
      prevHighlights.filter(highlight => {
        const associatedDeadline = deadlines.find(d => d.id === deadlineId);
        return associatedDeadline ? highlight.id !== associatedDeadline.highlightId : true;
      })
    );
  };

  const updateDeadline = (deadlineId: string, deadlineData: { name: string; date: string; description?: string }) => {
    setDeadlines((prevDeadlines) =>
      prevDeadlines.map(deadline =>
        deadline.id === deadlineId
          ? { ...deadline, ...deadlineData }
          : deadline
      )
    );

    // Also update the associated highlight comment
    setHighlights((prevHighlights) =>
      prevHighlights.map(highlight => {
        const associatedDeadline = deadlines.find(d => d.id === deadlineId);
        if (associatedDeadline && highlight.id === associatedDeadline.highlightId) {
          const deadlineText = `${deadlineData.name} - ${new Date(deadlineData.date).toLocaleString()}`;
          return {
            ...highlight,
            comment: {
              text: deadlineText,
              emoji: "⏰"
            }
          };
        }
        return highlight;
      })
    );
  };

  const handleShowEditForm = (show: boolean, deadline?: Deadline) => {
    setShowEditForm(show);
    setEditingDeadline(deadline);
    if (!show) {
      setEditingDeadline(undefined);
    }
  };

  const handleSelectionFinished = (
    position: ScaledPosition,
    content: { text?: string; image?: string },
    hideTipAndSelection: () => void,
    transformSelection: () => void,
  ) => (
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

        // Add highlight to state
        setHighlights((prevHighlights) => [newHighlight, ...prevHighlights]);

        // Create and add deadline
        addDeadline(deadlineData, newHighlightId);

        hideTipAndSelection();
      }} />
  );

  const handleHighlightTransform = (
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
        onChange={(boundingRect) => {
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
        onMouseOver={(popupContent) =>
          setTip(highlight, (_highlight) => popupContent)
        }
        onMouseOut={hideTip}
        key={index}
      >
        {component}
      </Popup>
    );
  };

  const handleDeadlineClick = (deadline: Deadline) => {
    const highlight = highlights.find(h => h.id === deadline.highlightId);
    if (highlight && scrollViewerTo.current) {
      scrollViewerTo.current(highlight);
    }
  }

  const handleAIScan = () => {
    // TODO: Implement AI scan functionality
    console.log("AI Scan button clicked");
    alert("AI Scan functionality will be implemented here");
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        deadlines={deadlines}
        highlights={highlights}
        resetToUpload={resetToUpload}
        onDeadlineClick={handleDeadlineClick}
        onDeleteDeadline={deleteDeadline}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddDeadline={addStandaloneDeadline}
        editingDeadline={editingDeadline}
        showEditForm={showEditForm}
        onShowEditForm={handleShowEditForm}
        onUpdateDeadline={updateDeadline}
      />
      <div
        style={{
          height: "100vh",
          width: "75vw",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {url ? (
          <>
            {/* Floating AI Scan Button */}
            <button
              onClick={handleAIScan}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                margin: 'auto',
                zIndex: 1000,
                padding: "12px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              AI Scan
            </button>

            <PdfLoader url={url} beforeLoad={<Spinner />}>
              {(pdfDocument) => (
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={(event) => event.altKey}
                  onScrollChange={resetHash}
                  scrollRef={handleScrollRef}
                  onSelectionFinished={handleSelectionFinished}
                  highlightTransform={handleHighlightTransform}
                  highlights={highlights}
                />
              )}
            </PdfLoader>
          </>
        ) : (
          <UploadPrompt
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileSelect={handleFileSelect}
            fileInputRef={fileInputRef}
            onUploadClick={handleUploadClick}
          />
        )}
      </div>
    </div>
  );
}
