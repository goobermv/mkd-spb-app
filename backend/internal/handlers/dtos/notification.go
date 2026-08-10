package dtos

import (
	"time"

	"github.com/google/uuid"
)

type CreateNotificationInput struct {
	UserID           uuid.UUID `json:"user_id" validate:"required"`
	NotificationText string    `json:"notification_text" validate:"required"`
	NotificationType string    `json:"notification_type" validate:"required"`
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
	NotificationText *string    `json:"notification_text,omitempty"`
	NotificationType *string    `json:"notification_type,omitempty"`
	WasReadStatus    *bool      `json:"was_read_status,omitempty"`
	Date             *time.Time `json:"date,omitempty"`
}
