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

import { Sidebar } from "./Sidebar";
import { UpsertDeadlineForm } from "./UpsertDeadlineForm";
import { UploadPrompt } from "./UploadPrompt";
import { HighlightPopup } from "./components/HighlightPopup";
import { PdfViewer } from "./components/PdfViewer";
import { useFileUpload } from "./hooks/useFileUpload";
import { useDeadlineManagement } from "./hooks/useDeadlineManagement";
import { useHighlightManagement } from "./hooks/useHighlightManagement";
import { useHashNavigation } from "./hooks/useHashNavigation";
import { getNextId } from "./utils/helpers";
import type { Deadline } from "./types";

import "./style/App.css";
import "react-pdf-highlighter/dist/style.css";

// Re-export Deadline type for other files that import it
export type { Deadline };

export function App() {
  // File upload management
  const {
    url,
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
          <PdfViewer
            url={url}
            highlights={highlights}
            onScrollChange={resetHash}
            onScrollRef={handleScrollRef}
            onSelectionFinished={handleSelectionFinished}
            onHighlightTransform={handleHighlightTransform}
            onAIScan={handleAIScan}
          />
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
