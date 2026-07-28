package postgres

import (
	"context"
	"errors"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ApplicationRepository struct {
	db *pgxpool.Pool
}

func NewApplicationRepository(db *pgxpool.Pool) *ApplicationRepository {
	return &ApplicationRepository{db: db}
}

func (r *ApplicationRepository) Create(ctx context.Context, application *domain.Application) error {
	query := `
		INSERT INTO applications (id, user_id, user_motivation_description, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5)
	`

	_, err := r.db.Exec(ctx, query, application.ID, application.UserID, application.UserMotivationDescription,
		application.CreatedAt, application.UpdatedAt)
	return err
}

func (r *ApplicationRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Application, error) {
	query := `
		SELECT id, user_id, user_motivation_description, created_at, updated_at
		FROM applications
		WHERE id = $1
	`
	application := &domain.Application{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&application.ID, &application.UserID, &application.UserMotivationDescription,
		&application.CreatedAt, &application.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("application not found")
		}
		return nil, err
	}
	return application, nil
}

func (r *ApplicationRepository) FindByDate(ctx context.Context, start time.Time) ([]*domain.Application, error) {
	query := `
		SELECT id, user_id, user_motivation_description, created_at, updated_at
		FROM applications
		WHERE DATE(created_at) = DATE($1)
	`
	rows, err := r.db.Query(ctx, query, start)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var applications []*domain.Application
	for rows.Next() {
		application := &domain.Application{}
		err := rows.Scan(
			&application.ID, &application.UserID, &application.UserMotivationDescription,
			&application.CreatedAt, &application.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		applications = append(applications, application)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return applications, nil
}

func (r *ApplicationRepository) FindByUserID(ctx context.Context, id uuid.UUID) ([]*domain.Application, error) {
	query := `
		SELECT id, user_id, user_motivation_description, created_at, updated_at
		FROM applications
		WHERE user_id = $1
	`
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var applications []*domain.Application
	for rows.Next() {
		application := &domain.Application{}
		err := rows.Scan(
			&application.ID, &application.UserID, &application.UserMotivationDescription,
			&application.CreatedAt, &application.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		applications = append(applications, application)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return applications, nil
}

func (r *ApplicationRepository) Update(ctx context.Context, application *domain.Application) error {
	query := `
		UPDATE applications
		SET user_motivation_description = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
	`
	commandTag, err := r.db.Exec(ctx, query, application.UserMotivationDescription, application.ID)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("application not found to update")
	}
	return nil
}

func (r *ApplicationRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM applications WHERE id = $1`
	commandTag, err := r.db.Exec(ctx, query, id)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("application not found to delete")
	}
	return nil
}

func (r *ApplicationRepository) FindAll(ctx context.Context) ([]*domain.Application, error) {
	query := `
		SELECT id, user_id, user_motivation_description, created_at, updated_at
		FROM applications
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var applications []*domain.Application
	for rows.Next() {
		application := &domain.Application{}
		err := rows.Scan(
			&application.ID, &application.UserID, &application.UserMotivationDescription,
			&application.CreatedAt, &application.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		applications = append(applications, application)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return applications, nil
}
