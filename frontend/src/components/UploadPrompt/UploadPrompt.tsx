import React from "react";
import { primary, secondary } from "../../style/constants";
import DocumentIcon from "../../icons/Document";

interface UploadPromptProps {
  isDragOver: boolean;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
}

export function UploadPrompt({
  isDragOver,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileSelect,
  fileInputRef,
  onUploadClick,
}: UploadPromptProps) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDragOver ? secondary : primary,
        textAlign: "center",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={onFileSelect}
        style={{ display: "none" }}
      />

      <DocumentIcon />

      <h2>
        Upload a PDF Document
      </h2>

      <p style={{ maxWidth: "90%" }}>
        Drag and drop a PDF file here, or click the button below to select a file from your computer.
      </p>

      <button onClick={onUploadClick}>
        Choose PDF File
      </button>
    </div>
  );
}
