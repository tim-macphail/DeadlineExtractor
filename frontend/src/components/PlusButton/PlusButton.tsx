interface PlusButtonProps {
  onClick: () => void;
}

export function PlusButton({ onClick }: PlusButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007bff",
        border: "none",
        color: "white",
        fontSize: "24px",
        cursor: "pointer",
        margin: "16px",
        boxShadow: "0 2px 6px black",
      }}
    >
      +
    </button>
  );
}
