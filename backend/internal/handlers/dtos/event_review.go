package dtos

import (
	"time"

	"github.com/google/uuid"
)

type CreateEventReviewInput struct {
	AuthorID    uuid.UUID `json:"author_id"`
	EventID     uuid.UUID `json:"event_id"`
	EventRating int       `json:"event_rating"`
	ReviewText  string    `json:"review_text"`
}

type EventReviewResponse struct {
	ID          uuid.UUID `json:"id"`
	AuthorID    uuid.UUID `json:"author_id"`
	EventID     uuid.UUID `json:"event_id"`
	EventRating int       `json:"event_rating"`
	ReviewText  string    `json:"review_text"`
	Date        time.Time `json:"date"`
}

type UpdateEventReviewRequest struct {
	EventRating *int    `json:"event_rating"`
	ReviewText  *string `json:"review_text"`
}
