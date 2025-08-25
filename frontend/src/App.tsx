import { Sidebar } from "./Sidebar";
import { UploadPrompt } from "./UploadPrompt";
import { PdfViewer } from "./components/PdfViewer";
import { Spinner } from "./Spinner";
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

  // File upload management
  const {
    url,
    isDragOver,
    isLoading,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleUploadClick,
    resetToUpload,
    error,
  } = useFileUpload(setDeadlines);

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
            <PdfViewer
              url={url}
              highlights={highlights}
              onScrollChange={resetHash}
              onScrollRef={handleScrollRef}
              onSelectionFinished={handleSelectionFinished}
              onHighlightTransform={handleHighlightTransform}
            />
            {isLoading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
              >
                <Spinner />
              </div>
            )}
            {error && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fee",
                    border: "2px solid #fcc",
                    borderRadius: "8px",
                    padding: "20px",
                    maxWidth: "400px",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <div
                    style={{
                      color: "#c33",
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    ⚠️ Upload Failed
                  </div>
                  <div
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      lineHeight: "1.4",
                      marginBottom: "15px",
                    }}
                  >
                    {error}
                  </div>
                  <button
                    onClick={() => {
                      // Clear the error by resetting to upload state
                      resetToUpload();
                    }}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
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
