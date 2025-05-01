import "../../styles/components/Button.css";

export default function Button({ text, disabled = false }) {
  return (
    <button 
      className="submit-button"
      disabled={disabled}
    >
      {text}
    </button>
  );
}