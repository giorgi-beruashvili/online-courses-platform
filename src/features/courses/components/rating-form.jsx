import { useState } from "react";

export function RatingForm({ onSubmit, isSubmitting }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedRating) {
      setError("Please choose a rating from 1 to 5.");
      return;
    }

    setError("");
    await onSubmit(selectedRating);
  };

  return (
    <form className="rating-shell" onSubmit={handleSubmit}>
      <h3>Rate this course</h3>

      <div className="rating-options">
        {[1, 2, 3, 4, 5].map((ratingValue) => (
          <button
            key={ratingValue}
            type="button"
            className={`rating-option-button ${
              selectedRating === ratingValue ? "active" : ""
            }`}
            onClick={() => {
              setSelectedRating(ratingValue);
              setError("");
            }}
          >
            {ratingValue} ★
          </button>
        ))}
      </div>

      {error ? <span className="field-error">{error}</span> : null}

      <button
        type="submit"
        className="button button-primary"
        disabled={isSubmitting || !selectedRating}
      >
        {isSubmitting ? "Submitting Rating..." : "Submit Rating"}
      </button>
    </form>
  );
}
