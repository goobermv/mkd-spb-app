package dtos

import (
	"time"

	"github.com/google/uuid"
)

type EventCreationInput struct {
	AuthorID         uuid.UUID `json:"author_id"`
	EventName        string    `json:"event_name"`
	Description      string    `json:"description"`
	EventCategory    string    `json:"event_category"`
	EventDateAndTime time.Time `json:"event_date_and_time"`
	EventPicture     string    `json:"event_picture"`
}

type EventResponse struct {
	ID               uuid.UUID `json:"id"`
	AuthorID         uuid.UUID `json:"author_id"`
	EventName        string    `json:"event_name"`
	Description      string    `json:"description"`
	Status           string    `json:"status"`
	EventCategory    string    `json:"event_category"`
	EventDateAndTime time.Time `json:"event_date_and_time"`
	EventPicture     string    `json:"event_picture"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type UpdateEventRequest struct {
	EventName        *string    `json:"event_name"`
	Description      *string    `json:"description"`
	Status           *string    `json:"status"`
	EventCategory    *string    `json:"event_category"`
	EventDateAndTime *time.Time `json:"event_date_and_time"`
	EventPicture     *string    `json:"event_picture"`
}
