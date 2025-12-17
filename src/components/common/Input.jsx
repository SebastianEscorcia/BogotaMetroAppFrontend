export const Input = ({
  icon,
  type = "text",
  name,
  value,
  onChange,
  className = "",
  placeholder,
  required,
  options,
  children,
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {icon && <span className="icon">{icon}</span>}
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          {...props}
        />
      )}
    </div>
  );
};
