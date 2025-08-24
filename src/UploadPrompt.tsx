import React from "react";

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
        onChange={onFileSelect}
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
        onClick={onUploadClick}
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
  );
}
