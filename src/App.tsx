import { Sidebar } from "./Sidebar";
import { UploadPrompt } from "./UploadPrompt";
import { PdfViewer } from "./components/PdfViewer";
import { useFileUpload } from "./hooks/useFileUpload";
import { useDeadlineManagement } from "./hooks/useDeadlineManagement";
import { useHighlightManagement } from "./hooks/useHighlightManagement";
import { useHashNavigation } from "./hooks/useHashNavigation";
import { usePdfCallbacks } from "./hooks/usePdfCallbacks";
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

  // PDF callbacks
  const { handleSelectionFinished, handleHighlightTransform } = usePdfCallbacks({
    addDeadline,
    updateHighlight,
  });

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
