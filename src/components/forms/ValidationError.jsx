export default function ValidationError({ message }) {
  if (!message) return null;
  return <p className="error-text">{message}</p>;
}
