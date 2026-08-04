package usecase

import (
	"context"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/repositories/interfaces"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/google/uuid"
)

type EventUsecase interface {
	// CreateEvent(ctx context.Context, input dtos.EventCreationInput) (*domain.Event, error)
	GetEvent(ctx context.Context, id uuid.UUID) (*domain.Event, error)
	GetEventByName(ctx context.Context, name string) (*domain.Event, error)
	GetEventsByDate(ctx context.Context, date time.Time) ([]*domain.Event, error)
	// UpdateEvent(ctx context.Context, id uuid.UUID, input dtos.UpdateEventRequest) (*domain.Event, error)
	// DeleteEvent(ctx context.Context, id uuid.UUID) error
	GetAllEvents(ctx context.Context) ([]*domain.Event, error)
}

type eventUsecase struct {
	eventRepo interfaces.EventRepository
	logger    logger.Logger
}

func NewEventUsecase(repo interfaces.EventRepository, logger logger.Logger) EventUsecase {
	return &eventUsecase{
		eventRepo: repo,
		logger:    logger,
	}
}

/*
func (e *eventUsecase) CreateEvent(ctx context.Context, input dtos.EventCreationInput) (*domain.Event, error) {
	e.logger.Infof("Attempting to create event by user: %s", input.AuthorID)

	event := &domain.Event{
		ID:               uuid.New(),
		AuthorID:         input.AuthorID,
		EventName:        input.EventName,
		Description:      input.Description,
		Status:           domain.EventStatusInModeration,
		EventCategory:    input.EventCategory,
		EventDateAndTime: input.EventDateAndTime,
		EventPicture:     input.EventPicture,
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	if err := e.eventRepo.Create(ctx, event); err != nil {
		e.logger.Errorf(err, "Failed to create event in database by user: %s", input.AuthorID)
		return nil, domain.ErrFailedToCreateEvent
	}

	e.logger.Successf("Event created successfully - ID: %s, user ID: %s", event.ID, event.AuthorID)

	return event, nil
}
*/

func (e *eventUsecase) GetEvent(ctx context.Context, id uuid.UUID) (*domain.Event, error) {
	e.logger.Infof("Attempting to get event by ID: %s", id)

	event, err := e.eventRepo.FindByID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find event: %s", id)
		return nil, domain.ErrEventNotFound
	}
	if event == nil {
		e.logger.Warnf("Event not found: %s", id)
		return nil, domain.ErrEventNotFound
	}

	e.logger.Successf("Event retrieved successfully: %s", id)

	return event, nil
}

func (e *eventUsecase) GetEventByName(ctx context.Context, name string) (*domain.Event, error) {
	e.logger.Infof("Attempting to get event by name: %s", name)

	event, err := e.eventRepo.FindByName(ctx, name)
	if err != nil {
		e.logger.Errorf(err, "Failed to find event: %s", name)
		return nil, domain.ErrEventNotFound
	}
	if event == nil {
		e.logger.Warnf("Event not found: %s", name)
		return nil, domain.ErrEventNotFound
	}

	e.logger.Successf("Event retrieved successfully: %s", name)

	return event, nil
}

func (e *eventUsecase) GetEventsByDate(ctx context.Context, date time.Time) ([]*domain.Event, error) {
	e.logger.Infof("Attempting to get events by date: %s", date)

	events, err := e.eventRepo.FindByDate(ctx, date)
	if err != nil {
		e.logger.Errorf(err, "Failed to find events for the date: %s", date)
		return nil, domain.ErrEventsNotFound
	}
	if events == nil {
		e.logger.Warnf("Events not found: %s", date)
		return nil, domain.ErrEventsNotFound
	}

	e.logger.Successf("Events retrieved successfully for: %s", date)
	return events, nil
}

/*
func (e *eventUsecase) UpdateEvent(ctx context.Context, id uuid.UUID, input dtos.UpdateEventRequest) (*domain.Event, error) {
	e.logger.Infof("Updating event info for ID: %s", id)

	event, err := e.eventRepo.FindByID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find event: %s", id)
		return nil, domain.ErrEventNotFound
	}
	if event == nil {
		e.logger.Warnf("Event not found: %s", id)
		return nil, domain.ErrEventNotFound
	}

	if event.ID != id {
		e.logger.Warnf("Event ID mismatch - expected: %s, got: %s", id, event.ID)
		return nil, domain.ErrNoPermissionUpdateEvent
	}

	if input.EventName != nil {
		event.EventName = *input.EventName
		e.logger.Infof("Event name updated to: %s for event: %s", event.EventName, id)
	}

	if input.Description != nil {
		event.Description = *input.Description
		e.logger.Infof("Description updated to: %s for event: %s", event.Description, id)
	}

	if input.Status != nil {
		event.Status = *input.Status
		e.logger.Infof("Event status updated to: %s for event: %s", event.Status, id)
	}

	if input.EventCategory != nil {
		event.EventCategory = *input.EventCategory
		e.logger.Infof("Event category updated to: %s for event: %s", event.EventCategory, id)
	}

	if input.EventDateAndTime != nil {
		event.EventDateAndTime = *input.EventDateAndTime
		e.logger.Infof("Event date and time updated to: %s for event: %s", event.EventDateAndTime, id)
	}

	if input.EventPicture != nil {
		event.EventPicture = *input.EventPicture
		e.logger.Infof("Event picture updated to: %s for event: %s", event.EventPicture, id)
	}

	event.UpdatedAt = time.Now()

	if err := e.eventRepo.Update(ctx, event); err != nil {
		e.logger.Errorf(err, "Failed to update event in database: %s", id)
		return nil, domain.ErrFailedToUpdateEvent
	}

	e.logger.Successf("Event info updated successfully: %s", id)

	return event, nil
}

func (e *eventUsecase) DeleteEvent(ctx context.Context, id uuid.UUID) error {
	e.logger.Infof("Deleting event: %s", id)

	event, err := e.eventRepo.FindByID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find event for deletion: %s", id)
		return domain.ErrEventNotFound
	}
	if event == nil {
		e.logger.Warnf("Event not found: %s", id)
		return domain.ErrApplicationNotFound
	}

	if err := e.eventRepo.Delete(ctx, id); err != nil {
		e.logger.Errorf(err, "Failed to delete event from database: %s", id)
		return domain.ErrFailedToDeleteEvent
	}

	e.logger.Successf("Event deleted successfully: %s (Author: %s)", id, event.AuthorID)

	return nil
}
*/

func (e *eventUsecase) GetAllEvents(ctx context.Context) ([]*domain.Event, error) {
	e.logger.Infof("Retrieving all events...")

	events, err := e.eventRepo.FindAll(ctx)
	if err != nil {
		e.logger.Errorf(err, "Failed to find events")
		return nil, domain.ErrEventsNotFound
	}
	if events == nil {
		e.logger.Warnf("Events not found")
		return nil, domain.ErrEventsNotFound
	}

	e.logger.Successf("Events retrieved successfully")

	return events, nil
}
