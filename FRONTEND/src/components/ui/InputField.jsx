import React from "react";
import "../../styles/components/InputField.css";

const InputField = ({ id, label, type = "text", value, onChange, error, suffix }) => {
  return (
    <div className="input-field">
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required
          placeholder=" "
          className={`input-element pr-10 ${error ? "border-red-500" : ""}`} 
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-blue-600">
            {suffix}
          </div>
        )}
        <label className="label" htmlFor={id}>{label}</label>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default InputField;
