export default function InputField({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  className = "input",
  required = false,
}) {
  return (
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
}
