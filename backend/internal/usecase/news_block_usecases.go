package usecase

import (
	"context"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/handlers/dtos"
	"github.com/goobermv/mkd-spb-app/internal/repositories/interfaces"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/google/uuid"
)

type NewsBlockUsecase interface {
	CreateNewsBlock(ctx context.Context, input dtos.CreateNewsBlockInput) (*domain.NewsBlock, error)
	GetNewsBlock(ctx context.Context, id uuid.UUID) (*domain.NewsBlock, error)
	GetNewsBlockByTitle(ctx context.Context, title string) (*domain.NewsBlock, error)
	GetNewsBlockByDate(ctx context.Context, date time.Time) ([]*domain.NewsBlock, error)
	GetNewsBlockByAuthorID(ctx context.Context, id uuid.UUID) ([]*domain.NewsBlock, error)
	UpdateNewsBlock(ctx context.Context, id uuid.UUID, input dtos.UpdateNewsBlockRequest) (*domain.NewsBlock, error)
	DeleteNewsBlock(ctx context.Context, id uuid.UUID) error
	GetAllNewsBlocks(ctx context.Context) ([]*domain.NewsBlock, error)
}

type newsBlockUsecase struct {
	newsBlockRepo interfaces.NewsBlockRepository
	logger        logger.Logger
}

func NewNewsBlockUsecase(repo interfaces.NewsBlockRepository, logger logger.Logger) NewsBlockUsecase {
	return &newsBlockUsecase{
		newsBlockRepo: repo,
		logger:        logger,
	}
}

func (n *newsBlockUsecase) CreateNewsBlock(ctx context.Context, input dtos.CreateNewsBlockInput) (*domain.NewsBlock, error) {
	n.logger.Infof("Attempting to create news block by user: %s", input.AuthorID)

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
		n.logger.Errorf(err, "Failed to create news block in database by user: %s", input.AuthorID)
		return nil, domain.ErrFailedToCreateNewsBlock
	}

	n.logger.Successf("News block created successfully - ID: %s, user ID: %s", newsBlock.ID, newsBlock.AuthorID)

	return newsBlock, nil
}

func (n *newsBlockUsecase) GetNewsBlock(ctx context.Context, id uuid.UUID) (*domain.NewsBlock, error) {
	n.logger.Infof("Attempting to get news block by id: %s", id)

	newsBlock, err := n.newsBlockRepo.FindByID(ctx, id)
	if err != nil {
		n.logger.Errorf(err, "Failed to find news block: %s", id)
		return nil, domain.ErrNewsBlockNotFound
	}
	if newsBlock == nil {
		n.logger.Warnf("News block not found: %s", id)
		return nil, domain.ErrNewsBlockNotFound
	}

	n.logger.Successf("News block retrieved successfully: %s", id)

	return newsBlock, nil
}

func (n *newsBlockUsecase) GetNewsBlockByTitle(ctx context.Context, title string) (*domain.NewsBlock, error) {
	n.logger.Infof("Attempting to get application by title: %s", title)

	newsBlock, err := n.newsBlockRepo.FindByTitle(ctx, title)
	if err != nil {
		n.logger.Errorf(err, "Failed to find news block: %s", title)
		return nil, domain.ErrNewsBlockNotFound
	}
	if newsBlock == nil {
		n.logger.Warnf("News block not found: %s", title)
		return nil, domain.ErrNewsBlockNotFound
	}

	n.logger.Successf("News block retrieved successfully: %s", newsBlock.ID)

	return newsBlock, nil
}

func (n *newsBlockUsecase) GetNewsBlockByDate(ctx context.Context, date time.Time) ([]*domain.NewsBlock, error) {
	n.logger.Infof("Attempting to get news blocks by date: %s", date)

	newsBlocks, err := n.newsBlockRepo.FindByDate(ctx, date)
	if err != nil {
		n.logger.Errorf(err, "Failed to find news block: %s", date)
		return nil, domain.ErrNewsBlockNotFound
	}
	if newsBlocks == nil {
		n.logger.Warnf("News block not found: %s", date)
		return nil, domain.ErrNewsBlockNotFound
	}

	n.logger.Successf("News block retrieved successfully for date: %s", date)

	return newsBlocks, nil
}

func (n *newsBlockUsecase) GetNewsBlockByAuthorID(ctx context.Context, id uuid.UUID) ([]*domain.NewsBlock, error) {
	n.logger.Infof("Attempting to get news blocks by author id: %s", id)

	newsBlocks, err := n.newsBlockRepo.FindByAuthorID(ctx, id)
	if err != nil {
		n.logger.Errorf(err, "Failed to find news block: %s", id)
		return nil, domain.ErrNewsBlockNotFound
	}
	if newsBlocks == nil {
		n.logger.Warnf("News block not found: %s", id)
		return nil, domain.ErrNewsBlockNotFound
	}

	n.logger.Successf("News block by author retrieved successfully: %s", id)

	return newsBlocks, nil
}

func (n *newsBlockUsecase) UpdateNewsBlock(ctx context.Context, id uuid.UUID, input dtos.UpdateNewsBlockRequest) (*domain.NewsBlock, error) {
	n.logger.Infof("Updating news block info for ID: %s", id)

	newsBlock, err := n.newsBlockRepo.FindByID(ctx, id)
	if err != nil {
		n.logger.Errorf(err, "Failed to find news block: %s", id)
		return nil, domain.ErrNewsBlockNotFound
	}
	if newsBlock == nil {
		n.logger.Warnf("News block not found: %s", id)
		return nil, domain.ErrNewsBlockNotFound
	}

	if newsBlock.ID != id {
		n.logger.Warnf("News block ID mismatch - expected: %s, got: %s", id, newsBlock.ID)
		return nil, domain.ErrNoPermissionUpdateNewsBlock
	}

	if input.Title != nil {
		newsBlock.Title = *input.Title
		n.logger.Infof("Title updated to: %s for news block: %s", newsBlock.Title, id)
	}

	if input.Description != nil {
		newsBlock.Description = *input.Description
		n.logger.Infof("Description updated to: %s for news block: %s", newsBlock.Description, id)
	}

	if input.NewsBlockCategory != nil {
		newsBlock.NewsBlockCategory = *input.NewsBlockCategory
		n.logger.Infof("News block category updated to: %s for news block: %s", newsBlock.NewsBlockCategory, id)
	}

	if input.NewsBlockPicture != nil {
		newsBlock.NewsBlockPicture = *input.NewsBlockPicture
		n.logger.Infof("News block picture updated to: %s for news block: %s", newsBlock.NewsBlockPicture, id)

	}

	newsBlock.PublicationDate = time.Now()
	newsBlock.UpdatedAt = time.Now()

	if err := n.newsBlockRepo.Update(ctx, newsBlock); err != nil {
		n.logger.Errorf(err, "Failed to update news block in database: %s", id)
		return nil, domain.ErrFailedToUpdateNewsBlock
	}

	n.logger.Successf("News block info updated successfully: %s", id)

	return newsBlock, nil
}

func (n *newsBlockUsecase) DeleteNewsBlock(ctx context.Context, id uuid.UUID) error {
	n.logger.Infof("Deleting news block: %s", id)

	newsBlock, err := n.newsBlockRepo.FindByID(ctx, id)
	if err != nil {
		n.logger.Errorf(err, "Failed to find news block for deletion: %s", id)
		return domain.ErrNewsBlockNotFound
	}
	if newsBlock == nil {
		n.logger.Warnf("News block not found: %s", id)
		return domain.ErrNewsBlockNotFound
	}

	if err := n.newsBlockRepo.Delete(ctx, id); err != nil {
		n.logger.Errorf(err, "Failed to delete news block from database: %s", id)
		return domain.ErrFailedToDeleteNewsBlock
	}

	n.logger.Successf("News block deleted successfully: %s (User: %s)", id, newsBlock.AuthorID)

	return nil
}

func (n *newsBlockUsecase) GetAllNewsBlocks(ctx context.Context) ([]*domain.NewsBlock, error) {
	n.logger.Infof("Retrieving all news blocks...")

	newsBlocks, err := n.newsBlockRepo.FindAll(ctx)
	if err != nil {
		n.logger.Errorf(err, "Failed to find news blocks")
		return nil, domain.ErrNewsBlocksNotFound
	}
	if newsBlocks == nil {
		n.logger.Warnf("News blocks not found")
		return nil, domain.ErrNewsBlocksNotFound
	}

	n.logger.Successf("News blocks retrieved successfully")

	return newsBlocks, nil
}
