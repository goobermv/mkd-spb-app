package interfaces

import (
	"context"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
)

type EventRegistrationRepository interface {
	Create(ctx context.Context, registration *domain.EventRegistration) error
	FindByID(ctx context.Context, id uuid.UUID) (*domain.EventRegistration, error)
	FindByEventID(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error)
	FindByUserID(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error)
	Update(ctx context.Context, registration *domain.EventRegistration) error
	Delete(ctx context.Context, id uuid.UUID) error
}
