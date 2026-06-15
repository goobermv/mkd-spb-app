package domain

import (
	"time"

	"github.com/google/uuid"
)

type Application struct {
	ID                        uuid.UUID
	UserID                    uuid.UUID
	UserMotivationDescription string // Где будут писать зачем хотят участвовать, что хотят делать и какие навыки/опыт имеется
	CreatedAt                 time.Time
	UpdatedAt                 time.Time
}
