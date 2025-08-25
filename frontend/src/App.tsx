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
import Modal from "./components/Modal/Modal";
import { UpsertDeadlineForm } from "./components/UpsertDeadlineForm/UpsertDeadlineForm";
import { useState } from "react";
import { DeadlineCalendar } from "./components/DeadlineCalendar/DeadlineCalendar";
import PreviewModalContent from "./components/PreviewModalContent/PreviewModalContent";

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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleOpenEditModal = (deadline: Deadline) => {
    handleShowEditForm(true, deadline);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    handleShowEditForm(false);
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
        onEditDeadline={handleOpenEditModal}
      />
      <div
        style={{
          height: "100%",
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", bottom: "40px", right: "40px", zIndex: 900 }}>
          <button
            style={{
              border: "none",
              backgroundColor: "#007bff",
              height: "80px",
              width: "80px",
              borderRadius: "50%",
              textAlign: "center",
              fontSize: "40px",
              cursor: "pointer",
              color: "white",
              boxShadow: "0 4px 10px black",
            }}
            disabled={deadlines.length === 0}
            onClick={handleOpenModal}
          >
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
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <PreviewModalContent deadlines={deadlines} />
        </Modal>

        <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
          <UpsertDeadlineForm
            isEditing={true}
            editingDeadline={editingDeadline}
            onAdd={() => {}} // Not used in edit mode
            onClose={handleCloseEditModal}
            onOpen={() => {}}
            onUpdate={(deadlineId, deadlineData) => {
              updateDeadline(deadlineId, deadlineData);
              handleCloseEditModal();
            }}
          />
        </Modal>
      </div>
    </div >
  );
}
