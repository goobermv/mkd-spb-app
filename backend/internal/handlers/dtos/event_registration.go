package dtos

import (
	"time"

	"github.com/google/uuid"
)

type CreateRegistrationRequest struct {
	UserID  uuid.UUID `json:"user_id"`
	EventID uuid.UUID `json:"event_id"`
}

type EventRegistrationResponse struct {
	ID                 uuid.UUID `json:"id"`
	UserID             uuid.UUID `json:"user_id"`
	EventID            uuid.UUID `json:"event_id"`
	RegistrationStatus string    `json:"registration_status"`
	RegistrationDate   time.Time `json:"registration_date"`
}

type UpdateRegistrationRequest struct {
	RegistrationStatus *string `json:"registration_status"`
}
