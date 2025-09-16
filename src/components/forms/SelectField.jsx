export default function SelectField({
  name,
  value,
  onChange,
  options = [],
  className = "role",
  required = false,
}) {
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={className}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
