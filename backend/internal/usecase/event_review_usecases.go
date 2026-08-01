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
	ErrEventReviewNotFound = errors.New("отзыв не найден")
)

type EventReviewUsecase interface {
	CreateEventReview(ctx context.Context, input dtos.CreateEventReviewInput) (*domain.EventReview, error)
	GetEventReview(ctx context.Context, id uuid.UUID) (*domain.EventReview, error)
	UpdateEventReview(ctx context.Context, id uuid.UUID, input dtos.UpdateEventReviewRequest) (*domain.EventReview, error)
	DeleteEventReview(ctx context.Context, id uuid.UUID) error
}

type eventReviewUsecase struct {
	eventReviewRepo interfaces.EventReviewRepository
}

func NewEventReviewUsecase(repo interfaces.EventReviewRepository) EventReviewUsecase {
	return &eventReviewUsecase{
		eventReviewRepo: repo,
	}
}

func (e *eventReviewUsecase) CreateEventReview(ctx context.Context, input dtos.CreateEventReviewInput) (*domain.EventReview, error) {
	eventReview := &domain.EventReview{
		ID:          uuid.New(),
		AuthorID:    input.AuthorID,
		EventID:     input.EventID,
		EventRating: input.EventRating,
		ReviewText:  input.ReviewText,
		Date:        time.Now(),
	}

	if err := e.eventReviewRepo.Create(ctx, eventReview); err != nil {
		return nil, err
	}

	return eventReview, nil
}

func (e *eventReviewUsecase) GetEventReview(ctx context.Context, id uuid.UUID) (*domain.EventReview, error) {
	eventReview, err := e.eventReviewRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrEventReviewNotFound
	}

	return eventReview, nil
}

func (e *eventReviewUsecase) UpdateEventReview(ctx context.Context, id uuid.UUID, input dtos.UpdateEventReviewRequest) (*domain.EventReview, error) {
	eventReview, err := e.eventReviewRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrEventReviewNotFound
	}

	if input.EventRating != nil {
		eventReview.EventRating = *input.EventRating
	}

	if input.ReviewText != nil {
		eventReview.ReviewText = *input.ReviewText
	}

	eventReview.Date = time.Now()

	if err := e.eventReviewRepo.Update(ctx, eventReview); err != nil {
		return nil, err
	}

	return eventReview, nil
}

func (e *eventReviewUsecase) DeleteEventReview(ctx context.Context, id uuid.UUID) error {
	_, err := e.eventReviewRepo.FindByID(ctx, id)
	if err != nil {
		return ErrEventReviewNotFound
	}

	return e.eventReviewRepo.Delete(ctx, id)
}
