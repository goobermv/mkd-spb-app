package domain

import (
	"time"

	"github.com/google/uuid"
)

const (
	ApplicationStatusPending  = "Pending"  // На рассмотрении
	ApplicationStatusApproved = "Approved" // Одобрена
	ApplicationStatusRejected = "Rejected" // Отклонена
)

type Application struct {
	ID                        uuid.UUID
	UserID                    uuid.UUID
	UserMotivationDescription string
	Status                    string
	CreatedAt                 time.Time
	UpdatedAt                 time.Time
}
