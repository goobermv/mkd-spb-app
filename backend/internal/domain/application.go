package domain

import (
	"time"

	"github.com/google/uuid"
)

type Application struct {
	ID                        uuid.UUID
	UserID                    uuid.UUID
	UserMotivationDescription string
	CreatedAt                 time.Time
	UpdatedAt                 time.Time
}
