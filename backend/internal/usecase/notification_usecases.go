package usecase

import (
	"context"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/handlers/dtos"
	"github.com/goobermv/mkd-spb-app/internal/repositories/interfaces"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/google/uuid"
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
	logger           logger.Logger
}

func NewNotificationUsecase(repo interfaces.NotificationRepository, logger logger.Logger) NotificationUsecase {
	return &notificationUsecase{
		notificationRepo: repo,
		logger:           logger,
	}
}

/*
func (n *notificationUsecase) CreateNotification(ctx context.Context, input dtos.CreateNotificationInput) (*domain.Notification, error) {
	n.logger.Infof("Attempting to create notification for user: %s", input.UserID)

	notification := &domain.Notification{
		ID:               uuid.New(),
		UserID:           input.UserID,
		NotificationText: input.NotificationText,
		NotificationType: input.NotificationType,
		WasReadStatus:    false,
		Date:             time.Now(),
	}

	if err := n.notificationRepo.Create(ctx, notification); err != nil {
		n.logger.Errorf(err, "Failed to create notification in database from user: %s", input.UserID)
		return nil, err
	}

	n.logger.Successf("Notification created successfully - ID: %s, user ID: %s", notification.ID, notification.UserID)

	return notification, nil
}
*/

func (n *notificationUsecase) GetNotification(ctx context.Context, id uuid.UUID) (*domain.Notification, error) {
	n.logger.Infof("Attempting to get notification by ID: %s", id)

	notification, err := n.notificationRepo.FindByID(ctx, id)
	if err != nil {
		n.logger.Errorf(err, "Failed to find notification: %s", id)
		return nil, domain.ErrNotificationNotFound
	}
	if notification == nil {
		n.logger.Warnf("Notification not found: %s", id)
		return nil, domain.ErrNotificationNotFound
	}

	n.logger.Successf("Notification retrieved successfully: %s", id)

	return notification, nil
}

func (n *notificationUsecase) GetNotificationByUserID(ctx context.Context, id uuid.UUID) ([]*domain.Notification, error) {
	n.logger.Infof("Attempting to get notifications by user ID: %s", id)

	notifications, err := n.notificationRepo.FindByUserID(ctx, id)
	if err != nil {
		n.logger.Errorf(err, "Failed to find notification: %s", id)
		return nil, domain.ErrNotificationNotFound
	}
	if notifications == nil {
		n.logger.Warnf("Notification not found: %s", id)
		return nil, domain.ErrNotificationNotFound
	}

	n.logger.Successf("Notifications retrieved successfully for user: %s", id)

	return notifications, nil
}

/*
func (n *notificationUsecase) UpdateNotification(ctx context.Context, id uuid.UUID, input dtos.UpdateNotificationRequest) (*domain.Notification, error) {
	n.logger.Infof("Updating notification info for ID: %s", id)

	notification, err := n.notificationRepo.FindByID(ctx, id)
	if err != nil {
		n.logger.Errorf(err, "Failed to find notification: %s", id)
		return nil, domain.ErrNotificationNotFound
	}
	if notification == nil {
		n.logger.Warnf("Notification not found: %s", id)
		return nil, domain.ErrNotificationNotFound
	}

	if notification.ID != id {
		n.logger.Warnf("Notification ID mismatch - expected: %s, got: %s", id, notification.ID)
		return nil, domain.ErrNoPermissionUpdateNotification
	}

	if input.NotificationText != nil {
		notification.NotificationText = *input.NotificationText
		n.logger.Infof("Notification text updated to: %s for notification: %s", notification.NotificationText, id)
	}

	if input.NotificationType != nil {
		notification.NotificationType = *input.NotificationType
		n.logger.Infof("Notification type updated to: %s for notification: %s", notification.NotificationType, id)
	}

	if input.WasReadStatus != nil {
		notification.WasReadStatus = *input.WasReadStatus
		n.logger.Infof("Was read status updated to: %t for notification: %s", notification.WasReadStatus, id)
	}

	notification.Date = time.Now()

	if err := n.notificationRepo.Update(ctx, notification); err != nil {
		n.logger.Errorf(err, "Failed to update notification in database: %s", id)
		return nil, domain.ErrFailedToUpdateNotification
	}

	n.logger.Successf("Notification info updated successfully: %s", id)

	return notification, nil
}

func (n *notificationUsecase) DeleteNotification(ctx context.Context, id uuid.UUID) error {
	n.logger.Infof("Deleting notification: %s", id)

	notification, err := n.notificationRepo.FindByID(ctx, id)
	if err != nil {
		n.logger.Errorf(err, "Failed to find notification for deletion: %s", id)
		return domain.ErrNotificationNotFound
	}
	if notification == nil {
		n.logger.Warnf("Notification not found: %s", id)
		return domain.ErrNotificationNotFound
	}

	if err := n.notificationRepo.Delete(ctx, id); err != nil {
		n.logger.Errorf(err, "Failed to delete notification from database: %s", id)
		return domain.ErrFailedToDeleteNotification
	}

	n.logger.Successf("Notification deleted successfully: %s (User: %s)", id, notification.UserID)

	return nil
}
*/
