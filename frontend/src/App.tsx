import { Sidebar } from "./components/Sidebar/Sidebar";
import { PdfViewer } from "./components/PdfViewer/PdfViewer";
import { Spinner } from "./components/Spinner/Spinner";
import { useFileUpload } from "./hooks/useFileUpload";
import { useDeadlineManagement } from "./hooks/useDeadlineManagement";
import { useHighlightManagement } from "./hooks/useHighlightManagement";
import { useHashNavigation } from "./hooks/useHashNavigation";
import { usePdfCallbacks } from "./hooks/usePdfCallbacks";
import type { Deadline } from "./types";

import "./App.css";
import "react-pdf-highlighter/dist/style.css";
import { primary } from "./style/constants";
import { UploadPrompt } from "./components/UploadPrompt/UploadPrompt";

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
                  // backgroundColor: "rgba(255, 255, 255, 0.8)",
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
                  backgroundColor: "#ffffff", // cover the viewer area and block view
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    backgroundColor: primary,
                    padding: "20px",
                    maxWidth: "400px",
                    textAlign: "center",
                  }}
                >
                  <h2>
                    Upload Failed
                  </h2>
                  <h3>
                    {error}
                  </h3>
                  <button onClick={resetToUpload}>
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
    </div >
  );
}
