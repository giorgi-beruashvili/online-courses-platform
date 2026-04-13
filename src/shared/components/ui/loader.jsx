export function Loader({ label = "Loading..." }) {
  return (
    <div className="state-card">
      <p className="state-card-text">{label}</p>
    </div>
  );
}
