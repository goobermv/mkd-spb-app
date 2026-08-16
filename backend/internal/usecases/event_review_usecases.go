package usecase

import (
	"context"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/network/dtos"
	"github.com/goobermv/mkd-spb-app/internal/repositories/interfaces"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/google/uuid"
)

var ()

type EventReviewUsecase interface {
	CreateEventReview(ctx context.Context, input dtos.CreateEventReviewInput) (*domain.EventReview, error)
	GetEventReview(ctx context.Context, id uuid.UUID) (*domain.EventReview, error)
	GetEventReviewsByEvent(ctx context.Context, id uuid.UUID) ([]*domain.EventReview, error)
	UpdateEventReview(ctx context.Context, id uuid.UUID, input dtos.UpdateEventReviewRequest) (*domain.EventReview, error)
	DeleteEventReview(ctx context.Context, id uuid.UUID) error
}

type eventReviewUsecase struct {
	eventReviewRepo interfaces.EventReviewRepository
	logger          logger.Logger
}

func NewEventReviewUsecase(repo interfaces.EventReviewRepository, logger logger.Logger) EventReviewUsecase {
	return &eventReviewUsecase{
		eventReviewRepo: repo,
		logger:          logger,
	}
}

func (e *eventReviewUsecase) CreateEventReview(ctx context.Context, input dtos.CreateEventReviewInput) (*domain.EventReview, error) {
	e.logger.Infof("Attempting to create review for user: %s", input.AuthorID)

	eventReview := &domain.EventReview{
		ID:          uuid.New(),
		AuthorID:    input.AuthorID,
		EventID:     input.EventID,
		EventRating: input.EventRating,
		ReviewText:  input.ReviewText,
		Date:        time.Now(),
	}

	if err := e.eventReviewRepo.Create(ctx, eventReview); err != nil {
		e.logger.Errorf(err, "Failed to create review in database from user: %s", input.AuthorID)
		return nil, domain.ErrFailedToCreateEventReview
	}

	e.logger.Successf("Review created successfully - ID: %s, user ID: %s", eventReview.ID, eventReview.AuthorID)

	return eventReview, nil
}

func (e *eventReviewUsecase) GetEventReview(ctx context.Context, id uuid.UUID) (*domain.EventReview, error) {
	e.logger.Infof("Attempting to get review by ID: %s", id)

	eventReview, err := e.eventReviewRepo.FindByID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find review: %s", id)
		return nil, domain.ErrEventReviewNotFound
	}
	if eventReview == nil {
		e.logger.Warnf("Review not found: %s", id)
		return nil, domain.ErrEventReviewNotFound
	}

	e.logger.Successf("Review retrieved successfully: %s", id)

	return eventReview, nil
}

func (e *eventReviewUsecase) GetEventReviewsByEvent(ctx context.Context, id uuid.UUID) ([]*domain.EventReview, error) {
	e.logger.Infof("Attempting to get reviews by event ID: %s", id)

	eventReview, err := e.eventReviewRepo.FindByEventID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find review: %s", id)
		return nil, domain.ErrEventReviewNotFound
	}
	if eventReview == nil {
		e.logger.Warnf("Review not found: %s", id)
		return nil, domain.ErrEventReviewNotFound
	}

	e.logger.Successf("Reviews retrieved successfully for event: %s", id)

	return eventReview, nil
}

func (e *eventReviewUsecase) UpdateEventReview(ctx context.Context, id uuid.UUID, input dtos.UpdateEventReviewRequest) (*domain.EventReview, error) {
	e.logger.Infof("Updating review info for ID: %s", id)

	eventReview, err := e.eventReviewRepo.FindByID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find review: %s", id)
		return nil, domain.ErrEventReviewNotFound
	}
	if eventReview == nil {
		e.logger.Warnf("Failed to find review: %s", id)
		return nil, domain.ErrEventReviewNotFound
	}

	if eventReview.ID != id {
		e.logger.Warnf("Review ID mismatch - expected: %s, got: %s", id, eventReview.ID)
		return nil, domain.ErrNoPermissionUpdateEventReview
	}

	if input.EventRating != nil {
		eventReview.EventRating = *input.EventRating
		e.logger.Infof("Event rating updated to: %d for review: %s", eventReview.EventRating, id)
	}

	if input.ReviewText != nil {
		eventReview.ReviewText = *input.ReviewText
		e.logger.Infof("Event review text updated to: %s for review: %s", eventReview.ReviewText, id)
	}

	eventReview.Date = time.Now()

	if err := e.eventReviewRepo.Update(ctx, eventReview); err != nil {
		e.logger.Errorf(err, "Failed to update review in database: %s", id)
		return nil, domain.ErrFailedToUpdateEventReview
	}

	e.logger.Successf("Review info updated successfully: %s", id)

	return eventReview, nil
}

func (e *eventReviewUsecase) DeleteEventReview(ctx context.Context, id uuid.UUID) error {
	e.logger.Infof("Deleting review: %s", id)

	eventReview, err := e.eventReviewRepo.FindByID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find review for deletion: %s", id)
		return domain.ErrEventReviewNotFound
	}
	if eventReview == nil {
		e.logger.Warnf("Review not found: %s", id)
		return domain.ErrEventReviewNotFound
	}

	if err := e.eventReviewRepo.Delete(ctx, id); err != nil {
		e.logger.Errorf(err, "Failed to delete application from database: %s", id)
		return domain.ErrFailedToDeleteEventReview
	}

	e.logger.Successf("Registration deleted successfully: %s (User: %s)", id, eventReview.AuthorID)

	return nil
}
