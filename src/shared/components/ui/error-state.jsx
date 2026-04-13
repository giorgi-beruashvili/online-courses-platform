export function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
  action = null,
}) {
  return (
    <div className="state-card">
      <h3 className="state-card-title">{title}</h3>
      <p className="state-card-text">{message}</p>
      {action ? <div className="state-actions">{action}</div> : null}
    </div>
  );
}
