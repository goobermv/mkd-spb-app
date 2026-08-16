package postgres

import (
	"context"
	"errors"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EventRegistrationRepository struct {
	db *pgxpool.Pool
}

func NewEventRegistrationRepository(db *pgxpool.Pool) *EventRegistrationRepository {
	return &EventRegistrationRepository{db: db}
}

func (r *EventRegistrationRepository) Create(ctx context.Context, registration *domain.EventRegistration) error {
	query := `
		INSERT INTO event_registrations (id, user_id, event_id, registration_status, registration_date)
		VALUES ($1, $2, $3, $4, $5)
	`

	_, err := r.db.Exec(ctx, query, registration.ID, registration.UserID, registration.EventID,
		registration.RegistrationStatus, registration.RegistrationDate)
	return err
}

func (r *EventRegistrationRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.EventRegistration, error) {
	query := `
		SELECT id, user_id, event_id, registration_status, registration_date
		FROM event_registrations
		WHERE id = $1
	`
	registration := &domain.EventRegistration{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&registration.ID, &registration.UserID, &registration.EventID,
		&registration.RegistrationStatus, &registration.RegistrationDate,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("registration not found")
		}
		return nil, err
	}
	return registration, nil
}

func (r *EventRegistrationRepository) FindByEventID(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error) {
	query := `
		SELECT id, user_id, event_id, registration_status, registration_date
		FROM event_registrations
		WHERE event_id = $1
	`
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var registrations []*domain.EventRegistration
	for rows.Next() {
		registration := &domain.EventRegistration{}
		err := rows.Scan(
			&registration.ID, &registration.UserID, &registration.EventID,
			&registration.RegistrationStatus, &registration.RegistrationDate,
		)
		if err != nil {
			return nil, err
		}
		registrations = append(registrations, registration)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return registrations, nil
}

func (r *EventRegistrationRepository) FindByUserID(ctx context.Context, id uuid.UUID) ([]*domain.EventRegistration, error) {
	query := `
		SELECT id, user_id, event_id, registration_status, registration_date
		FROM event_registrations
		WHERE user_id = $1
	`
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var registrations []*domain.EventRegistration
	for rows.Next() {
		registration := &domain.EventRegistration{}
		err := rows.Scan(
			&registration.ID, &registration.UserID, &registration.EventID,
			&registration.RegistrationStatus, &registration.RegistrationDate,
		)
		if err != nil {
			return nil, err
		}
		registrations = append(registrations, registration)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return registrations, nil
}

func (r *EventRegistrationRepository) Update(ctx context.Context, registration *domain.EventRegistration) error {
	query := `
		UPDATE event_registrations
		SET registration_status = $1
		WHERE id = $2
	`
	commandTag, err := r.db.Exec(ctx, query, registration.RegistrationStatus, registration.ID)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("registration not found to update")
	}
	return nil
}

func (r *EventRegistrationRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM event_registrations WHERE id = $1`
	commandTag, err := r.db.Exec(ctx, query, id)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("registration not found to delete")
	}
	return nil
}
