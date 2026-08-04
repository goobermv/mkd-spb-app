package interfaces

import (
	"context"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
)

type NewsBlockRepository interface {
	Create(ctx context.Context, newsBlock *domain.NewsBlock) error // admin + activist
	FindByID(ctx context.Context, id uuid.UUID) (*domain.NewsBlock, error)
	FindByTitle(ctx context.Context, title string) (*domain.NewsBlock, error)
	FindByDate(ctx context.Context, date time.Time) ([]*domain.NewsBlock, error)
	FindByAuthorID(ctx context.Context, id uuid.UUID) ([]*domain.NewsBlock, error) // admin
	Update(ctx context.Context, newsBlock *domain.NewsBlock) error                 // admin + activist
	Delete(ctx context.Context, id uuid.UUID) error                                // admin + activist
	FindAll(ctx context.Context) ([]*domain.NewsBlock, error)
}
