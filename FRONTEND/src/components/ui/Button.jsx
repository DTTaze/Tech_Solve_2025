import "../../styles/components/Button.css";

export default function Button({ text, disabled = false, onClick }) {
  return (
    <button 
      className="submit-button"
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}