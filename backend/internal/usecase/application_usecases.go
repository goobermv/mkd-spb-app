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

type ApplicationUsecase interface {
	CreateApplication(ctx context.Context, input dtos.ApplicationCreationInput) (*domain.Application, error)
	GetApplication(ctx context.Context, id uuid.UUID) (*domain.Application, error)
	GetApplicationsByUser(ctx context.Context, id uuid.UUID) ([]*domain.Application, error)
	UpdateApplication(ctx context.Context, id uuid.UUID, input dtos.UpdateApplicationRequest) (*domain.Application, error)
	DeleteApplication(ctx context.Context, id uuid.UUID) error
}

type applicationUsecase struct {
	applicationRepo interfaces.ApplicationRepository
	logger          logger.Logger
}

func NewApplicationUsecase(repo interfaces.ApplicationRepository, logger logger.Logger) ApplicationUsecase {
	return &applicationUsecase{
		applicationRepo: repo,
		logger:          logger,
	}
}

func (a *applicationUsecase) CreateApplication(ctx context.Context, input dtos.ApplicationCreationInput) (*domain.Application, error) {
	a.logger.Infof("Attempting to create application for user: %s", input.UserID)

	application := &domain.Application{
		ID:                        uuid.New(),
		UserID:                    input.UserID,
		UserMotivationDescription: input.UserMotivationDescription,
		Status:                    domain.ApplicationStatusPending,
		CreatedAt:                 time.Now(),
		UpdatedAt:                 time.Now(),
	}

	if err := a.applicationRepo.Create(ctx, application); err != nil {
		a.logger.Errorf(err, "Failed for create application from user: %s", input.UserID)
		return nil, err
	}

	a.logger.Successf("Application created successfully - ID: %s, user ID: %s", application.ID, application.UserID)

	return application, nil
}

func (a *applicationUsecase) GetApplication(ctx context.Context, id uuid.UUID) (*domain.Application, error) {
	a.logger.Infof("Attempting to get application by ID: %s", id)

	application, err := a.applicationRepo.FindByID(ctx, id)
	if err != nil {
		a.logger.Errorf(err, "Failed to find application: %s", id)
		return nil, domain.ErrApplicationNotFound
	}
	if application == nil {
		a.logger.Warnf("Application not found: %s", id)
		return nil, domain.ErrApplicationNotFound
	}

	a.logger.Successf("Application retrieved successfully: %s", id)

	return application, nil
}

func (a *applicationUsecase) GetApplicationsByUser(ctx context.Context, id uuid.UUID) ([]*domain.Application, error) {
	a.logger.Infof("Attempting to get application by user ID: %s", id)

	applications, err := a.applicationRepo.FindByUserID(ctx, id)
	if err != nil {
		a.logger.Infof("Failed to find application by user ID: %s", id)
		return nil, domain.ErrApplicationNotFound
	}
	if applications == nil {
		a.logger.Warnf("Applications not found: %s", id)
		return nil, domain.ErrApplicationsNotFound
	}

	a.logger.Successf("User applications retrieved successfully: %s", id)

	return applications, nil
}

func (a *applicationUsecase) UpdateApplication(ctx context.Context, id uuid.UUID, input dtos.UpdateApplicationRequest) (*domain.Application, error) {
	a.logger.Infof("Updating application info for ID: %s", id)

	application, err := a.applicationRepo.FindByID(ctx, id)
	if err != nil {
		a.logger.Errorf(err, "Failed to find application: %s", id)
		return nil, domain.ErrApplicationNotFound
	}
	if application == nil {
		a.logger.Warnf("Application not found: %s", id)
		return nil, domain.ErrApplicationNotFound
	}

	if application.ID != id {
		a.logger.Warnf("Application ID mismatch - expected: %s, got: %s", id, application.ID)
		return nil, domain.ErrNoPermissionUpdateUser
	}

	if input.UserMotivationDescription != nil {
		application.UserMotivationDescription = *input.UserMotivationDescription
		a.logger.Infof("User motivation updated to: %s for user: %s", *input.UserMotivationDescription, id)
	}

	if input.Status != nil {
		application.Status = *input.Status
		a.logger.Infof("Application status updated to: %s for user: %s", *input.Status, id)
	}

	application.UpdatedAt = time.Now()

	if err := a.applicationRepo.Update(ctx, application); err != nil {
		a.logger.Errorf(err, "Failed to update application in database: %s", id)
		return nil, domain.ErrFailedToUpdateApplication
	}

	a.logger.Successf("Application info updated successfully: %s", id)

	return application, nil
}

func (a *applicationUsecase) DeleteApplication(ctx context.Context, id uuid.UUID) error {
	a.logger.Infof("Deleting application: %s", id)

	application, err := a.applicationRepo.FindByID(ctx, id)
	if err != nil {
		a.logger.Errorf(err, "Failed to find application for deletion: %s", id)
		return domain.ErrApplicationNotFound
	}
	if application == nil {
		a.logger.Warnf("Application not found: %s", id)
		return domain.ErrApplicationNotFound
	}

	if err := a.applicationRepo.Delete(ctx, id); err != nil {
		a.logger.Errorf(err, "Failed to delete application from database: %s", id)
		return domain.ErrFailedToDeleteApplication
	}

	a.logger.Successf("Application deleted successfully: %s (User: %s)", id, application.UserID)

	return nil
}
