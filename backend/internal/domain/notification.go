package domain

import (
	"time"

	"github.com/google/uuid"
)

const (
	NotificationTypeReminder     = "Reminder"      // Напоминание
	NotificationTypeCancellation = "Cancellation"  // Отмена
	NotificationTypeStatusUpdate = "Status update" // Изменения статуса
)

type Notification struct {
	ID               uuid.UUID
	UserID           uuid.UUID
	NotificationText string
	NotificationType string
	WasReadStatus    bool
	Date             time.Time
}
