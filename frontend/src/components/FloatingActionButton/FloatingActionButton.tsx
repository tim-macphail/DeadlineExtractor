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
          boxShadow: "0 4px 10px black",
          opacity: disabled ? 0.6 : 1,
          transition: "all 0.2s ease",
        }}
        disabled={disabled}
        onClick={onClick}
      >
        ⮕
      </button>
    </div>
  );
};
