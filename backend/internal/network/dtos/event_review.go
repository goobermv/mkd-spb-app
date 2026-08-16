package dtos

import (
	"time"

	"github.com/google/uuid"
)

type CreateEventReviewInput struct {
	AuthorID    uuid.UUID `json:"author_id" validate:"required"`
	EventID     uuid.UUID `json:"event_id" validate:"required"`
	EventRating int       `json:"event_rating" validate:"required,min=1"`
	ReviewText  string    `json:"review_text" validate:"required"`
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
	EventRating *int    `json:"event_rating,omitempty"`
	ReviewText  *string `json:"review_text,omitempty"`
}
