package postgres

import (
	"context"
	"errors"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type NotificationRepository struct {
	db *pgxpool.Pool
}

func NewNotificationRepository(db *pgxpool.Pool) *NotificationRepository {
	return &NotificationRepository{db: db}
}

func (r *NotificationRepository) Create(ctx context.Context, notification *domain.Notification) error {
	query := `
		INSERT INTO notifications (id, user_id, notification_text, notification_type, was_read_status, date)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(ctx, query, notification.ID, notification.UserID, notification.NotificationText,
		notification.NotificationType, notification.WasReadStatus, notification.Date)
	return err
}

func (r *NotificationRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Notification, error) {
	query := `
		SELECT id, user_id, COALESCE(notification_text, ''), notification_type, was_read_status, date
		FROM notifications
		WHERE id = $1
	`
	notification := &domain.Notification{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&notification.ID, &notification.UserID, &notification.NotificationText,
		&notification.NotificationType, &notification.WasReadStatus, &notification.Date,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("notification not found")
		}
		return nil, err
	}
	return notification, nil
}

func (r *NotificationRepository) FindByUserID(ctx context.Context, id uuid.UUID) ([]*domain.Notification, error) {
	query := `
		SELECT id, user_id, COALESCE(notification_text, ''), notification_type, was_read_status, date
		FROM notifications
		WHERE user_id = $1
	`
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []*domain.Notification
	for rows.Next() {
		notification := &domain.Notification{}
		err := rows.Scan(
			&notification.ID, &notification.UserID, &notification.NotificationText,
			&notification.NotificationType, &notification.WasReadStatus, &notification.Date,
		)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return notifications, nil
}

func (r *NotificationRepository) Update(ctx context.Context, notification *domain.Notification) error {
	query := `
		UPDATE notifications
		SET notification_text = $1, notification_type = $2, was_read_status = $3, date = CURRENT_TIMESTAMP
		WHERE id = $4
	`
	commandTag, err := r.db.Exec(ctx, query, notification.NotificationText, notification.NotificationType,
		notification.WasReadStatus, notification.ID)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("notification not found to update")
	}
	return nil
}

func (r *NotificationRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM notifications WHERE id = $1`
	commandTag, err := r.db.Exec(ctx, query, id)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("notification not found to delete")
	}
	return nil
}
