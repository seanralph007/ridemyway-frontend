import "./LoadingScreen.css";

export default function LoadingScreen(props) {
  return (
    <div className="loading-container">
      <div className="car"></div>
      <p>{props.text}</p>
    </div>
  );
}
