package interfaces

import (
	"context"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
)

type ApplicationRepository interface {
	Create(ctx context.Context, application *domain.Application) error
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Application, error)
	FindByDate(ctx context.Context, start time.Time) ([]*domain.Application, error) //admin
	FindByUserID(ctx context.Context, id uuid.UUID) ([]*domain.Application, error)
	Update(ctx context.Context, application *domain.Application) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindAll(ctx context.Context) ([]*domain.Application, error) //admin
}
