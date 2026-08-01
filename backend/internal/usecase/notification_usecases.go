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
	ErrNotificationNotFound  = errors.New("уведомление не найдено")
	ErrNotificationsNotFound = errors.New("уведомления не найдены")
)

type NotificationUsecase interface {
	CreateNotification(ctx context.Context, input dtos.CreateNotificationInput) (*domain.Notification, error)
	GetNotification(ctx context.Context, id uuid.UUID) (*domain.Notification, error)
	GetNotificationByUserID(ctx context.Context, id uuid.UUID) ([]*domain.Notification, error)
	UpdateNotification(ctx context.Context, id uuid.UUID, input dtos.UpdateNotificationRequest) (*domain.Notification, error)
	DeleteNotification(ctx context.Context, id uuid.UUID) error
}

type notificationUsecase struct {
	notificationRepo interfaces.NotificationRepository
}

func NewNotificationUsecase(repo interfaces.NotificationRepository) NotificationUsecase {
	return &notificationUsecase{
		notificationRepo: repo,
	}
}

func (n *notificationUsecase) CreateNotification(ctx context.Context, input dtos.CreateNotificationInput) (*domain.Notification, error) {
	notification := &domain.Notification{
		ID:               uuid.New(),
		UserID:           input.UserID,
		NotificationText: input.NotificationText,
		NotificationType: input.NotificationType,
		WasReadStatus:    false,
		Date:             time.Now(),
	}

	if err := n.notificationRepo.Create(ctx, notification); err != nil {
		return nil, err
	}

	return notification, nil
}

func (n *notificationUsecase) GetNotification(ctx context.Context, id uuid.UUID) (*domain.Notification, error) {
	notification, err := n.notificationRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrNotificationNotFound
	}

	return notification, nil
}

func (n *notificationUsecase) GetNotificationByUserID(ctx context.Context, id uuid.UUID) ([]*domain.Notification, error) {
	notifications, err := n.notificationRepo.FindByUserID(ctx, id)
	if err != nil {
		return nil, ErrNotificationsNotFound
	}

	return notifications, nil
}

func (n *notificationUsecase) UpdateNotification(ctx context.Context, id uuid.UUID, input dtos.UpdateNotificationRequest) (*domain.Notification, error) {
	notification, err := n.notificationRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrNotificationNotFound
	}

	if input.NotificationText != nil {
		notification.NotificationText = *input.NotificationText
	}

	if input.NotificationType != nil {
		notification.NotificationType = *input.NotificationType
	}

	if input.WasReadStatus != nil {
		notification.WasReadStatus = *input.WasReadStatus
	}

	notification.Date = time.Now()

	if err := n.notificationRepo.Update(ctx, notification); err != nil {
		return nil, err
	}

	return notification, nil
}

func (n *notificationUsecase) DeleteNotification(ctx context.Context, id uuid.UUID) error {
	_, err := n.notificationRepo.FindByID(ctx, id)
	if err != nil {
		return ErrNotificationNotFound
	}

	return n.notificationRepo.Delete(ctx, id)
}
