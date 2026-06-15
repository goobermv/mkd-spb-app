package domain

import (
	"time"

	"github.com/google/uuid"
)

type Application struct {
	ID                        uuid.UUID
	UserID                    uuid.UUID
	UserFullName              string
	UserDescription           string
	UserBirthDate             time.Time
	UserCountry               string
	UserJobField              string
	UserVKLink                string
	UserMotivationDescription string // Где будут писать зачем хотят участвовать, что хотят делать и какие навыки/опыт имеется
	UserRole                  string
	CreatedAt                 time.Time
	UpdatedAt                 time.Time
}
