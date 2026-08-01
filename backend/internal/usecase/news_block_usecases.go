package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/handlers/dtos"
	"github.com/goobermv/mkd-spb-app/internal/repositories/interfaces"
	"github.com/google/uuid"
)

var (
	ErrNewsBlockNotFound  = errors.New("новость не найдена")
	ErrNewsBlocksNotFound = errors.New("новости не найдены")
)

type NewsBlockUsecase interface {
	CreateNewsBlock(ctx context.Context, input dtos.CreateNewsBlockInput) (*domain.NewsBlock, error)
	GetNewsBlock(ctx context.Context, id uuid.UUID) (*domain.NewsBlock, error)
	GetNewsBlockByTitle(ctx context.Context, title string) (*domain.NewsBlock, error)
	GetNewsBlockByDate(ctx context.Context, date time.Time) ([]*domain.NewsBlock, error)
	UpdateNewsBlock(ctx context.Context, id uuid.UUID, input dtos.UpdateNewsBlockRequest) (*domain.NewsBlock, error)
	DeleteNewsBlock(ctx context.Context, id uuid.UUID) error
	GetAllNewsBlocks(ctx context.Context) ([]*domain.NewsBlock, error)
}

type newsBlockUsecase struct {
	newsBlockRepo interfaces.NewsBlockRepository
}

func NewNewsBlockRepository(repo interfaces.NewsBlockRepository) NewsBlockUsecase {
	return &newsBlockUsecase{
		newsBlockRepo: repo,
	}
}

func (n *newsBlockUsecase) CreateNewsBlock(ctx context.Context, input dtos.CreateNewsBlockInput) (*domain.NewsBlock, error) {
	newsBlock := &domain.NewsBlock{
		ID:                uuid.New(),
		AuthorID:          input.AuthorID,
		Title:             input.Title,
		Description:       input.Description,
		NewsBlockCategory: input.NewsBlockCategory,
		PublicationStatus: domain.NewsBlockPublicationStatusUndergoingModeration,
		NewsBlockPicture:  input.NewsBlockPicture,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	if err := n.newsBlockRepo.Create(ctx, newsBlock); err != nil {
		return nil, err
	}

	return newsBlock, nil
}

func (n *newsBlockUsecase) GetNewsBlock(ctx context.Context, id uuid.UUID) (*domain.NewsBlock, error) {
	newsBlock, err := n.newsBlockRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrNewsBlockNotFound
	}

	return newsBlock, nil
}

func (n *newsBlockUsecase) GetNewsBlockByTitle(ctx context.Context, title string) (*domain.NewsBlock, error) {
	newsBlock, err := n.newsBlockRepo.FindByTitle(ctx, title)
	if err != nil {
		return nil, ErrNewsBlockNotFound
	}

	return newsBlock, nil
}

func (n *newsBlockUsecase) GetNewsBlockByDate(ctx context.Context, date time.Time) ([]*domain.NewsBlock, error) {
	newsBlocks, err := n.newsBlockRepo.FindByDate(ctx, date)
	if err != nil {
		return nil, ErrNewsBlocksNotFound
	}

	return newsBlocks, nil
}

func (n *newsBlockUsecase) UpdateNewsBlock(ctx context.Context, id uuid.UUID, input dtos.UpdateNewsBlockRequest) (*domain.NewsBlock, error) {
	newsBlock, err := n.newsBlockRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrNewsBlockNotFound
	}

	if input.Title != nil {
		newsBlock.Title = *input.Title
	}

	if input.Description != nil {
		newsBlock.Description = *input.Description
	}

	if input.NewsBlockCategory != nil {
		newsBlock.NewsBlockCategory = *input.NewsBlockCategory
	}

	if input.NewsBlockPicture != nil {
		newsBlock.NewsBlockPicture = *input.NewsBlockPicture
	}

	newsBlock.PublicationDate = time.Now() // think about how to fix this
	newsBlock.UpdatedAt = time.Now()

	if err := n.newsBlockRepo.Update(ctx, newsBlock); err != nil {
		return nil, err
	}

	return newsBlock, nil
}

func (n *newsBlockUsecase) DeleteNewsBlock(ctx context.Context, id uuid.UUID) error {
	_, err := n.newsBlockRepo.FindByID(ctx, id)
	if err != nil {
		return ErrNewsBlockNotFound
	}

	return n.newsBlockRepo.Delete(ctx, id)
}

func (n *newsBlockUsecase) GetAllNewsBlocks(ctx context.Context) ([]*domain.NewsBlock, error) {
	newsBlocks, err := n.newsBlockRepo.FindAll(ctx)
	if err != nil {
		return nil, ErrNewsBlocksNotFound
	}

	return newsBlocks, nil
}
