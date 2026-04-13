export function EmptyState({
  title = "No data found",
  message = "",
  action = null,
}) {
  return (
    <div className="state-card">
      <h3 className="state-card-title">{title}</h3>
      {message ? <p className="state-card-text">{message}</p> : null}
      {action ? <div className="state-actions">{action}</div> : null}
    </div>
  );
}
