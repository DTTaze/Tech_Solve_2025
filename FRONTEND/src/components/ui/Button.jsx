import "../../styles/components/Button.css";

export default function Button({ text, disabled = false, onClick, width, padding, fontSize }) {
  return (
    <button
      className="submit-button"
      disabled={disabled}
      onClick={onClick}
      style={{ width, padding, fontSize }}
    >
      {text}
    </button>
  );
}