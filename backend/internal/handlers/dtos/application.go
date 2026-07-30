package dtos

import (
	"time"

	"github.com/google/uuid"
)

type ApplicationCreationInput struct {
	UserID                    uuid.UUID `json:"user_id"`
	UserMotivationDescription string    `json:"user_motivation_description"`
}

type ApplicationResponse struct {
	ID                        uuid.UUID `json:"id"`
	UserID                    uuid.UUID `json:"user_id"`
	UserMotivationDescription string    `json:"user_motivation_description"`
	Status                    string    `json:"status"`
	CreatedAt                 time.Time `json:"created_at"`
	UpdatedAt                 time.Time `json:"updated_at"`
}

type UpdateApplicationRequest struct {
	UserMotivationDescription *string `json:"user_motivation_description"`
	Status                    *string `json:"status"`
}
