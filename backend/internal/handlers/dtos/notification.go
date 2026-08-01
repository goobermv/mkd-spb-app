package dtos

import (
	"time"

	"github.com/google/uuid"
)

type CreateNotificationInput struct {
	UserID           uuid.UUID `json:"user_id"`
	NotificationText string    `json:"notification_text"`
	NotificationType string    `json:"notification_type"`
}

type NotificationResponse struct {
	ID               uuid.UUID `json:"id"`
	UserID           uuid.UUID `json:"user_id"`
	NotificationText string    `json:"notification_text"`
	NotificationType string    `json:"notification_type"`
	WasReadStatus    bool      `json:"was_read_status"`
	Date             time.Time `json:"date"`
}

type UpdateNotificationRequest struct {
	NotificationText *string    `json:"notification_text"`
	NotificationType *string    `json:"notification_type"`
	WasReadStatus    *bool      `json:"was_read_status"`
	Date             *time.Time `json:"date"`
}
