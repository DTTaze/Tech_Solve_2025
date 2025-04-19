const SelectField = ({
  id,
  label,
  value,
  onChange,
  error,
  options = [],
  required = false,
}) => {
  return (
    <div className="input-field">
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`input-element ${error ? "border-red-500" : ""}`}
        required={required}
      >
        <option value="" disabled hidden></option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default SelectField;
