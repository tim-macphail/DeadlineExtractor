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
import { AddDeadlineForm } from "./AddDeadlineForm";
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

  const handleSelectionFinished = (
    position: ScaledPosition,
    content: { text?: string; image?: string },
    hideTipAndSelection: () => void,
    transformSelection: () => void,
  ) => (
    <AddDeadlineForm
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

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        deadlines={deadlines}
        highlights={highlights}
        resetToUpload={resetToUpload}
        onDeadlineClick={(deadline) => {
          const highlight = highlights.find(h => h.id === deadline.highlightId);
          if (highlight && scrollViewerTo.current) {
            scrollViewerTo.current(highlight);
          }
        }}
        onDeleteDeadline={deleteDeadline}
        showAddForm={showAddForm}
        onShowAddForm={setShowAddForm}
        onAddDeadline={addStandaloneDeadline}
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
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: isDragOver ? "3px dashed #007bff" : "3px dashed #ccc",
              borderRadius: "8px",
              backgroundColor: isDragOver ? "#f0f8ff" : "#fafafa",
              transition: "all 0.3s ease",
              padding: "1rem",
              textAlign: "center",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            <div style={{ marginBottom: "1.5rem", flexShrink: 0 }}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#666", marginBottom: "0.5rem" }}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            </div>

            <h3 style={{
              marginBottom: "1rem",
              color: "#333",
              fontSize: "1.5rem",
              flexShrink: 0
            }}>
              Upload a PDF Document
            </h3>

            <p style={{
              marginBottom: "2rem",
              color: "#666",
              maxWidth: "90%",
              fontSize: "1rem",
              flexShrink: 0
            }}>
              Drag and drop a PDF file here, or click the button below to select a file from your computer.
            </p>

            <button
              onClick={handleUploadClick}
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
              }}
            >
              Choose PDF File
            </button>

            <p style={{
              marginTop: "1rem",
              color: "#999",
              fontSize: "14px",
              flexShrink: 0
            }}>
              Only PDF files are supported
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
