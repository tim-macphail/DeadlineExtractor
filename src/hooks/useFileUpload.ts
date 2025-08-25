import { useState, useRef } from "react";

export const useFileUpload = (onApiComplete?: (deadlines: any[]) => void) => {
  const [url, setUrl] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiCall = async (file: File) => {
    setIsLoading(true);


    // GET http://localhost:8000/api/document
    const response = await fetch("http://localhost:8000/api/document");
    const apiResponse = await response.json();

    setIsLoading(false);

    // Call the callback with the mock deadlines
    if (onApiComplete) {
      onApiComplete(apiResponse);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);

      // Trigger mock API call after setting the URL
      apiCall(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    const pdfFile = files.find(file => file.type === "application/pdf");

    if (pdfFile) {
      handleFileUpload(pdfFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const resetToUpload = () => {
    setUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    url,
    setUrl,
    isDragOver,
    isLoading,
    fileInputRef,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleUploadClick,
    resetToUpload,
  };
};
