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
	ErrEventRegistrationNotFound = errors.New("регистрация не найдена")
)

type EventRegistrationUsecase interface {
	CreateEventRegistration(ctx context.Context, input dtos.CreateRegistrationRequest) (*domain.EventRegistration, error)
	GetEventRegistrations(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error)
	UpdateEventRegistration(ctx context.Context, id uuid.UUID, input dtos.UpdateRegistrationRequest) (*domain.EventRegistration, error)
	DeleteEventRegistration(ctx context.Context, id uuid.UUID) error
}

type eventRegistrationUsecase struct {
	eventRegistrationRepo interfaces.EventRegistrationRepository
}

func NewEventRegistrationUsecase(repo interfaces.EventRegistrationRepository) EventRegistrationUsecase {
	return &eventRegistrationUsecase{
		eventRegistrationRepo: repo,
	}
}

func (e *eventRegistrationUsecase) CreateEventRegistration(ctx context.Context, input dtos.CreateRegistrationRequest) (*domain.EventRegistration, error) {
	eventRegistration := &domain.EventRegistration{
		ID:                 uuid.New(),
		UserID:             input.UserID,
		EventID:            input.EventID,
		RegistrationStatus: domain.RegistrationStatusRegistered,
		RegistrationDate:   time.Now(),
	}

	if err := e.eventRegistrationRepo.Create(ctx, eventRegistration); err != nil {
		return nil, err
	}

	return eventRegistration, nil
}

func (e *eventRegistrationUsecase) GetEventRegistrations(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error) {
	eventRegistrations, err := e.eventRegistrationRepo.FindByUserID(ctx, id)
	if err != nil {
		return nil, ErrEventRegistrationNotFound
	}

	return eventRegistrations, nil
}

func (e *eventRegistrationUsecase) UpdateEventRegistration(ctx context.Context, id uuid.UUID, input dtos.UpdateRegistrationRequest) (*domain.EventRegistration, error) {
	eventRegistration, err := e.eventRegistrationRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrEventRegistrationNotFound
	}

	if input.RegistrationStatus != nil {
		eventRegistration.RegistrationStatus = *input.RegistrationStatus
	}

	if err := e.eventRegistrationRepo.Update(ctx, eventRegistration); err != nil {
		return nil, err
	}

	return eventRegistration, nil
}

func (e *eventRegistrationUsecase) DeleteEventRegistration(ctx context.Context, id uuid.UUID) error {
	_, err := e.eventRegistrationRepo.FindByID(ctx, id)
	if err != nil {
		return ErrEventRegistrationNotFound
	}

	return e.eventRegistrationRepo.Delete(ctx, id)
}
