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
	ErrEventNotFound  = errors.New("мероприятие не найдено")
	ErrEventsNotFound = errors.New("мероприятия не найдены")
)

type EventUsecase interface {
	CreateEvent(ctx context.Context, input dtos.EventCreationInput) (*domain.Event, error)
	GetEvent(ctx context.Context, id uuid.UUID) (*domain.Event, error)
	GetEventByName(ctx context.Context, name string) (*domain.Event, error)
	GetEventsByDate(ctx context.Context, date time.Time) ([]*domain.Event, error)
	UpdateEvent(ctx context.Context, id uuid.UUID, input dtos.UpdateEventRequest) (*domain.Event, error)
	DeleteEvent(ctx context.Context, id uuid.UUID) error
	GetAllEvents(ctx context.Context) ([]*domain.Event, error)
}

type eventUsecase struct {
	eventRepo interfaces.EventRepository
}

func NewEventUsecase(repo interfaces.EventRepository) EventUsecase {
	return &eventUsecase{
		eventRepo: repo,
	}
}

func (e *eventUsecase) CreateEvent(ctx context.Context, input dtos.EventCreationInput) (*domain.Event, error) {
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
		return nil, err
	}

	return event, nil
}

func (e *eventUsecase) GetEvent(ctx context.Context, id uuid.UUID) (*domain.Event, error) {
	event, err := e.eventRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrEventNotFound
	}

	return event, nil
}

func (e *eventUsecase) GetEventByName(ctx context.Context, name string) (*domain.Event, error) {
	event, err := e.eventRepo.FindByName(ctx, name)
	if err != nil {
		return nil, ErrEventNotFound
	}

	return event, nil
}

func (e *eventUsecase) GetEventsByDate(ctx context.Context, date time.Time) ([]*domain.Event, error) {
	events, err := e.eventRepo.FindByDate(ctx, date)
	if err != nil {
		return nil, ErrEventsNotFound
	}

	return events, nil
}

func (e *eventUsecase) UpdateEvent(ctx context.Context, id uuid.UUID, input dtos.UpdateEventRequest) (*domain.Event, error) {
	event, err := e.eventRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrEventNotFound
	}

	if input.EventName != nil {
		event.EventName = *input.EventName
	}

	if input.Description != nil {
		event.Description = *input.Description
	}

	if input.Status != nil {
		event.Status = *input.Status
	}

	if input.EventCategory != nil {
		event.EventCategory = *input.EventCategory
	}

	if input.EventDateAndTime != nil {
		event.EventDateAndTime = *input.EventDateAndTime
	}

	if input.EventPicture != nil {
		event.EventPicture = *input.EventPicture
	}

	event.UpdatedAt = time.Now()

	if err := e.eventRepo.Update(ctx, event); err != nil {
		return nil, err
	}

	return event, nil
}

func (e *eventUsecase) DeleteEvent(ctx context.Context, id uuid.UUID) error {
	_, err := e.eventRepo.FindByID(ctx, id)
	if err != nil {
		return ErrEventNotFound
	}

	return e.eventRepo.Delete(ctx, id)
}

func (e *eventUsecase) GetAllEvents(ctx context.Context) ([]*domain.Event, error) {
	events, err := e.eventRepo.FindAll(ctx)
	if err != nil {
		return nil, ErrEventsNotFound
	}

	return events, nil
}
