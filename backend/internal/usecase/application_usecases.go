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
	ErrApplicationNotFound = errors.New("заявка не найдена")
)

type ApplicationUsecase interface {
	CreateApplication(ctx context.Context, input dtos.ApplicationCreationInput) (*domain.Application, error)
	GetApplications(ctx context.Context, id uuid.UUID) ([]*domain.Application, error)
	UpdateApplication(ctx context.Context, id uuid.UUID, input dtos.UpdateApplicationRequest) (*domain.Application, error)
	DeleteApplication(ctx context.Context, id uuid.UUID) error
}

type applicationUsecase struct {
	applicationRepo interfaces.ApplicationRepository
}

func NewApplicationUsecase(repo interfaces.ApplicationRepository) ApplicationUsecase {
	return &applicationUsecase{
		applicationRepo: repo,
	}
}

func (a *applicationUsecase) CreateApplication(ctx context.Context, input dtos.ApplicationCreationInput) (*domain.Application, error) {
	application := &domain.Application{
		ID:                        uuid.New(),
		UserID:                    input.UserID,
		UserMotivationDescription: input.UserMotivationDescription,
		Status:                    domain.ApplicationStatusPending,
		CreatedAt:                 time.Now(),
		UpdatedAt:                 time.Now(),
	}

	if err := a.applicationRepo.Create(ctx, application); err != nil {
		return nil, err
	}

	return application, nil
}

func (a *applicationUsecase) GetApplications(ctx context.Context, id uuid.UUID) ([]*domain.Application, error) {
	applications, err := a.applicationRepo.FindByUserID(ctx, id)
	if err != nil {
		return nil, ErrApplicationNotFound
	}

	return applications, nil
}

func (a *applicationUsecase) UpdateApplication(ctx context.Context, id uuid.UUID, input dtos.UpdateApplicationRequest) (*domain.Application, error) {
	application, err := a.applicationRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrApplicationNotFound
	}

	if input.UserMotivationDescription != nil {
		application.UserMotivationDescription = *input.UserMotivationDescription
	}

	if input.Status != nil {
		application.Status = *input.Status
	}

	application.UpdatedAt = time.Now()

	if err := a.applicationRepo.Update(ctx, application); err != nil {
		return nil, err
	}

	return application, nil
}

func (a *applicationUsecase) DeleteApplication(ctx context.Context, id uuid.UUID) error {
	_, err := a.applicationRepo.FindByID(ctx, id)
	if err != nil {
		return ErrApplicationNotFound
	}

	return a.applicationRepo.Delete(ctx, id)
}
