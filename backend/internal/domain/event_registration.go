package domain

import (
	"time"

	"github.com/google/uuid"
)

const (
	RegistrationStatusRegistered = "Registered" // Зарегистрирован
	RegistrationStatusConfirmed  = "Confirmed"  // Подтверждено участие
	RegistrationStatusCancelled  = "Cancelled"  // Участие отменено
)

type EventRegistration struct {
	ID                 uuid.UUID
	UserID             uuid.UUID
	EventID            uuid.UUID
	RegistrationStatus string
	RegistrationDate   time.Time
}
