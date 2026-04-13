function formatSessionTypeName(name = "") {
  if (name === "in_person") return "In-person";
  if (name === "online") return "Online";
  if (name === "hybrid") return "Hybrid";
  return name;
}

export function SessionTypeCard({ sessionType, isActive, onSelect }) {
  const isFullyBooked = sessionType.availableSeats === 0;
  const isLowSeats =
    sessionType.availableSeats > 0 && sessionType.availableSeats < 5;

  return (
    <button
      type="button"
      className={`selector-button ${isActive ? "active" : ""}`}
      onClick={() => onSelect(sessionType)}
      disabled={isFullyBooked}
    >
      <div className="session-card-row">
        <strong>{formatSessionTypeName(sessionType.name)}</strong>
        <span>
          {sessionType.priceModifier === 0
            ? "Included"
            : `+$${sessionType.priceModifier}`}
        </span>
      </div>

      <div className="session-card-meta">
        <span>Available seats: {sessionType.availableSeats}</span>
        {sessionType.location ? (
          <span>Location: {sessionType.location}</span>
        ) : null}
      </div>

      {isLowSeats ? (
        <span className="warning-text">
          Only {sessionType.availableSeats} seats left!
        </span>
      ) : null}

      {isFullyBooked ? (
        <span className="warning-text">Fully Booked</span>
      ) : null}
    </button>
  );
}
