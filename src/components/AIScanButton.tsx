interface AIScanButtonProps {
  onClick: () => void;
}

export const AIScanButton = ({ onClick }: AIScanButtonProps) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      top: "20px",
      right: "20px",
      margin: 'auto',
      zIndex: 1000,
      padding: "12px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    }}
  >
    AI Scan
  </button>
);
