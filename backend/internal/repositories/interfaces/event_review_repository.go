package interfaces

import (
	"context"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
)

type EventReviewRepository interface {
	Create(ctx context.Context, review *domain.EventReview) error
	FindByID(ctx context.Context, id uuid.UUID) (*domain.EventReview, error)
	FindByEventID(ctx context.Context, id uuid.UUID) ([]*domain.EventReview, error)
	Update(ctx context.Context, review *domain.EventReview) error
	Delete(ctx context.Context, id uuid.UUID) error
}
