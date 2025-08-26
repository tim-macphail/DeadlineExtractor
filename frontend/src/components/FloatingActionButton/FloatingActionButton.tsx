import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <div style={{ position: "absolute", bottom: "40px", right: "40px", zIndex: 900 }}>
      <button
        style={{
          border: "none",
          backgroundColor: disabled ? "#6c757d" : "#007bff",
          height: "80px",
          width: "80px",
          borderRadius: "50%",
          textAlign: "center",
          fontSize: "40px",
          cursor: disabled ? "not-allowed" : "pointer",
          color: "white",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.7)",
          opacity: disabled ? 0.6 : 1,
        }}
        disabled={disabled}
        onClick={onClick}
      >
        🗓️
      </button>
    </div>
  );
};
