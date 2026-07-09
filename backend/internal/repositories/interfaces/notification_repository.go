package interfaces

import (
	"context"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
)

type NotificationRepository interface {
	Create(ctx context.Context, notification *domain.Notification) error
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Notification, error)
	FindByUserID(ctx context.Context, id uuid.UUID) ([]*domain.Notification, error)
	Update(ctx context.Context, notification *domain.Notification) error
	Delete(ctx context.Context, id uuid.UUID) error
}
