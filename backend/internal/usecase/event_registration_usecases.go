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

type EventRegistrationUsecase interface {
	CreateEventRegistration(ctx context.Context, input dtos.CreateRegistrationRequest) (*domain.EventRegistration, error)
	GetEventRegistration(ctx context.Context, id uuid.UUID) (*domain.EventRegistration, error)
	GetEventRegistrationsByEvent(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error)
	GetEventRegistrationsByUser(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error)
	UpdateEventRegistration(ctx context.Context, id uuid.UUID, input dtos.UpdateRegistrationRequest) (*domain.EventRegistration, error)
	DeleteEventRegistration(ctx context.Context, id uuid.UUID) error
}

type eventRegistrationUsecase struct {
	eventRegistrationRepo interfaces.EventRegistrationRepository
	logger                logger.Logger
}

func NewEventRegistrationUsecase(repo interfaces.EventRegistrationRepository, logger logger.Logger) EventRegistrationUsecase {
	return &eventRegistrationUsecase{
		eventRegistrationRepo: repo,
		logger:                logger,
	}
}

func (e *eventRegistrationUsecase) CreateEventRegistration(ctx context.Context, input dtos.CreateRegistrationRequest) (*domain.EventRegistration, error) {
	e.logger.Infof("Attempting to create event registration from user: %s, for event: %s", input.UserID, input.EventID)

	eventRegistration := &domain.EventRegistration{
		ID:                 uuid.New(),
		UserID:             input.UserID,
		EventID:            input.EventID,
		RegistrationStatus: domain.RegistrationStatusRegistered,
		RegistrationDate:   time.Now(),
	}

	if err := e.eventRegistrationRepo.Create(ctx, eventRegistration); err != nil {
		e.logger.Errorf(err, "Failed to create registration in database from user: %s, for event: %s", input.UserID, input.EventID)
		return nil, domain.ErrFailedToCreateEventRegistration
	}

	e.logger.Successf("Registration created successfully - ID: %s, user ID: %s, event ID: %s", eventRegistration.ID, eventRegistration.UserID, eventRegistration.EventID)

	return eventRegistration, nil
}

func (e *eventRegistrationUsecase) GetEventRegistration(ctx context.Context, id uuid.UUID) (*domain.EventRegistration, error) {
	e.logger.Infof("Attempting to get registration by ID: %s", id)

	eventRegistration, err := e.eventRegistrationRepo.FindByID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find registration: %s", id)
		return nil, domain.ErrEventRegistrationNotFound
	}
	if eventRegistration == nil {
		e.logger.Warnf("Registration not found: %s", id)
		return nil, domain.ErrEventRegistrationNotFound
	}

	e.logger.Successf("Registration retrieved successfully: %s", id)

	return eventRegistration, nil
}

func (e *eventRegistrationUsecase) GetEventRegistrationsByEvent(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error) {
	e.logger.Infof("Attempting to get registrations by event ID: %s", id)

	eventRegistrations, err := e.eventRegistrationRepo.FindByEventID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find registrations for event: %s", id)
		return nil, domain.ErrEventRegistrationNotFound
	}
	if eventRegistrations == nil {
		e.logger.Warnf("Registrations not found: %s", id)
		return nil, domain.ErrEventRegistrationsNotFound
	}

	e.logger.Successf("Registrations retrieved successfully for event: %s", id)

	return eventRegistrations, nil
}

func (e *eventRegistrationUsecase) GetEventRegistrationsByUser(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error) {
	e.logger.Infof("Attempting to get registrations by ID: %s", id)

	eventRegistrations, err := e.eventRegistrationRepo.FindByUserID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find registration for user: %s", id)
		return nil, domain.ErrEventRegistrationNotFound
	}
	if eventRegistrations == nil {
		e.logger.Warnf("Registrations not found: %s", id)
		return nil, domain.ErrEventRegistrationsNotFound
	}

	e.logger.Successf("Registrations retrieved successfully for user: %s", id)

	return eventRegistrations, nil
}

func (e *eventRegistrationUsecase) UpdateEventRegistration(ctx context.Context, id uuid.UUID, input dtos.UpdateRegistrationRequest) (*domain.EventRegistration, error) {
	e.logger.Infof("Updating registration info for ID: %s", id)

	eventRegistration, err := e.eventRegistrationRepo.FindByID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find registration: %s", id)
		return nil, domain.ErrEventRegistrationNotFound
	}
	if eventRegistration == nil {
		e.logger.Warnf("Failed to find registration: %s", id)
		return nil, domain.ErrEventRegistrationNotFound
	}

	if eventRegistration.ID != id {
		e.logger.Warnf("Registration ID mismatch - expected: %s, got: %s", id, eventRegistration.ID)
		return nil, domain.ErrNoPermissionUpdateEventRegistration
	}

	if input.RegistrationStatus != nil {
		eventRegistration.RegistrationStatus = *input.RegistrationStatus
		e.logger.Infof("Registration status updated to: %s for registration: %s", eventRegistration.RegistrationStatus, id)
	}

	if err := e.eventRegistrationRepo.Update(ctx, eventRegistration); err != nil {
		e.logger.Errorf(err, "Failed to update registration in database: %s", id)
		return nil, domain.ErrFailedToUpdateEventRegistration
	}

	e.logger.Successf("Registration info updated successfully: %s", id)

	return eventRegistration, nil
}

func (e *eventRegistrationUsecase) DeleteEventRegistration(ctx context.Context, id uuid.UUID) error {
	e.logger.Infof("Deleting registration: %s", id)

	eventRegistration, err := e.eventRegistrationRepo.FindByID(ctx, id)
	if err != nil {
		e.logger.Errorf(err, "Failed to find registration for deletion: %s", id)
		return domain.ErrEventRegistrationNotFound
	}
	if eventRegistration == nil {
		e.logger.Warnf("Registration not found: %s", id)
		return domain.ErrEventRegistrationNotFound
	}

	if err := e.eventRegistrationRepo.Delete(ctx, id); err != nil {
		e.logger.Errorf(err, "Failed to delete application from database: %s", id)
		return domain.ErrFailedToDeleteEventRegistration
	}

	e.logger.Successf("Registration deleted successfully: %s (User: %s)", id, eventRegistration.UserID)

	return nil
}
