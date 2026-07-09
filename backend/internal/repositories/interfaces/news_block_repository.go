package interfaces

import (
	"context"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
)

type NewsBlockRepository interface {
	Create(ctx context.Context, newsBlock *domain.NewsBlock) error
	FindByID(ctx context.Context, id uuid.UUID) (*domain.NewsBlock, error)
	FindByTitle(ctx context.Context, title string) (*domain.NewsBlock, error)
	FindByDate(ctx context.Context, date time.Time) ([]*domain.NewsBlock, error)
	FindByAuthorID(ctx context.Context, id uuid.UUID) ([]*domain.NewsBlock, error)
	Update(ctx context.Context, newsBlock *domain.NewsBlock) error
	Delete(ctx context.Context, id uuid.UUID) error
	FindAll(ctx context.Context) ([]*domain.NewsBlock, error)
}
