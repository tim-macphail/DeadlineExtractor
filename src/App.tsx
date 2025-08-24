import React from "react";
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
import { HighlightPopup } from "./components/HighlightPopup";
import { useFileUpload } from "./hooks/useFileUpload";
import { useDeadlineManagement } from "./hooks/useDeadlineManagement";
import { useHighlightManagement } from "./hooks/useHighlightManagement";
import { useHashNavigation } from "./hooks/useHashNavigation";
import { getNextId, parseIdFromHash, resetHash } from "./utils/helpers";
import type { Deadline, DeadlineData } from "./types";

import "./style/App.css";
import "react-pdf-highlighter/dist/style.css";

// Re-export Deadline type for other files that import it
export type { Deadline };

export function App() {
  // File upload management
  const {
    url,
    setUrl,
    isDragOver,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleUploadClick,
    resetToUpload,
  } = useFileUpload();

  // Deadline management
  const {
    deadlines,
    setDeadlines,
    showAddForm,
    setShowAddForm,
    editingDeadline,
    showEditForm,
    addDeadline,
    addStandaloneDeadline,
    deleteDeadline,
    updateDeadline,
    handleShowEditForm,
    resetDeadlines,
  } = useDeadlineManagement();

  // Highlight management
  const { updateHighlight, highlights } = useHighlightManagement(
    deadlines,
    setDeadlines
  );

  // Hash navigation
  const { handleScrollRef, scrollToDeadline, resetHash } = useHashNavigation(deadlines);

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

        // Create and add deadline with embedded highlight
        addDeadline(deadlineData, newHighlight);

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
    scrollToDeadline(deadline.id);
  };

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
