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
import ErrorOverlay from "./components/ErrorOverlay/ErrorOverlay";
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";

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
          height: "100%",
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", bottom: "40px", right: "40px" }}>
          <button style={{
            height: "80px",
            width: "80px",
            borderRadius: "50%",
            textAlign: "center",
            fontSize: "40px",
          }}
            disabled={deadlines.length === 0}>
            ⮕
          </button>
        </div>
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
              <LoadingOverlay />
            )}
            {error && <ErrorOverlay error={error} resetToUpload={resetToUpload} />}
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
