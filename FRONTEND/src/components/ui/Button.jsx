import "../../styles/components/Button.css";

export default function Button({ text }) {
  return (
    <button className="submit-button">
      {text}
    </button>
  );
}
