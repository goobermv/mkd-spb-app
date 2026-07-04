package interfaces

import (
	"context"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
)

type EventRepository interface {
	Create(ctx context.Context, event *domain.Event) error
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Event, error)
	FindByName(ctx context.Context, title string) ([]*domain.Event, error)
	FindByDate(ctx context.Context, start time.Time) ([]*domain.Event, error)
	FindByAuthorID(ctx context.Context, id uuid.UUID) ([]*domain.Event, error)
	Update(ctx context.Context, event *domain.Event) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindAll(ctx context.Context) ([]*domain.Event, error)
}
