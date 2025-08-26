import { primary } from "../../style/constants";

const ErrorOverlay = ({ error, resetToUpload }: { error: string; resetToUpload: () => void }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff", // cover the viewer area and block view
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: primary,
          padding: "20px",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2>
          Upload Failed
        </h2>
        <h3>
          {error}
        </h3>
        <button onClick={resetToUpload}>
          Try Again
        </button>
      </div>
    </div>
  )
}

export default ErrorOverlay;