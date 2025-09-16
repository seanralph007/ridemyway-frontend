export default function ValidationError({ message }) {
  if (!message) return null;
  return <p style={{ color: "red" }}>{message}</p>;
}
