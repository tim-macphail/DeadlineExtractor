import { Sidebar } from "./components/Sidebar/Sidebar";
import { PdfViewer } from "./components/PdfViewer/PdfViewer";
import { TopBar } from "./components/TopBar/TopBar";
import { FloatingActionButton } from "./components/FloatingActionButton/FloatingActionButton";
import { useFileUpload } from "./hooks/useFileUpload";
import { useDeadlineHighlightManagement } from "./hooks/useDeadlineHighlightManagement";
import { useHashNavigation } from "./hooks/useHashNavigation";
import { usePdfCallbacks } from "./hooks/usePdfCallbacks";
import type { Deadline } from "./types";
import type { ScaledPosition } from "react-pdf-highlighter";

import "./App.css";
import "react-pdf-highlighter/dist/style.css";
import { UploadPrompt } from "./components/UploadPrompt/UploadPrompt";
import ErrorOverlay from "./components/ErrorOverlay/ErrorOverlay";
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";
import Modal from "./components/Modal/Modal";
import { EditDeadlineForm } from "./components/EditDeadlineForm/EditDeadlineForm";
import { useState } from "react";
import PreviewModalContent from "./components/PreviewModalContent/PreviewModalContent";

export function App() {
  // Combined deadline and highlight management
  const {
    deadlines,
    setDeadlines,
    editingDeadline,
    deleteDeadline,
    updateDeadline,
    updateHighlight,
    handleShowEditForm,
    addDeadlineWithHighlightAndEdit,
    addStandaloneDeadlineAndEdit,
    highlights,
  } = useDeadlineHighlightManagement();

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

  // Hash navigation
  const { handleScrollRef, resetHash } = useHashNavigation(deadlines);

  // PDF callbacks
  const handleAddDeadlineWithHighlightAndEdit = (position: ScaledPosition, content: { text?: string; image?: string }) => {
    addDeadlineWithHighlightAndEdit(position, content, handleOpenEditModal);
  };

  const { handleSelectionFinished, handleHighlightTransform } = usePdfCallbacks({
    updateHighlight,
    addDeadlineWithHighlightAndEdit: handleAddDeadlineWithHighlightAndEdit,
  });

  // Modal state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const handleOpenModal = () => setIsPreviewModalOpen(true);
  const handleClosePreviewModal = () => setIsPreviewModalOpen(false);

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

  // Handler for adding standalone deadline and opening edit modal
  const handleAddStandaloneDeadlineAndEdit = () => {
    addStandaloneDeadlineAndEdit(handleOpenEditModal);
  };

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          deadlines={deadlines}
          onDeleteDeadline={deleteDeadline}
          onEditDeadline={handleOpenEditModal}
          onAddStandaloneDeadlineAndEdit={handleAddStandaloneDeadlineAndEdit}
        />
        <div
          style={{
            // height: "100%",
            flex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <FloatingActionButton
            onClick={handleOpenModal}
            disabled={deadlines.length === 0}
          />
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
          <Modal isOpen={isPreviewModalOpen} onClose={handleClosePreviewModal}>
            <PreviewModalContent deadlines={deadlines} />
          </Modal>

          <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
            <EditDeadlineForm
              editingDeadline={editingDeadline}
              onAdd={() => { }} // Not used in edit mode
              onClose={handleCloseEditModal}
              onOpen={() => { }}
              onUpdate={(deadlineId, deadlineData) => {
                updateDeadline(deadlineId, deadlineData);
                handleCloseEditModal();
              }}
            />
          </Modal>
        </div>
      </div>
    </div >
  );
}
