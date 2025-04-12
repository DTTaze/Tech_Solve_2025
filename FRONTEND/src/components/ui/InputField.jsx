import React from "react";
import "../../styles/components/InputField.css";

const InputField = ({ id, label, type = "text", value, onChange, error }) => {
  return (
    <div className="input-field">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        placeholder=" "
        className={`input-element ${error ? "border-red-500" : ""}`}
      />
      <label className="label" htmlFor={id}>{label}</label>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default InputField;