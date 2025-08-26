import { Spinner } from "../Spinner/Spinner";

const LoadingOverlay = () => {
  return (<div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <Spinner />
  </div>);
}

export default LoadingOverlay;