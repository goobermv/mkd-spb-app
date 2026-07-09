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

type EventRepository struct {
	db *pgxpool.Pool
}

func NewEventRepository(db *pgxpool.Pool) *EventRepository {
	return &EventRepository{db: db}
}

func (r *EventRepository) Create(ctx context.Context, event *domain.Event) error {
	query := `
		INSERT INTO events (id, author_id, event_name, description, status, event_category, event_date_and_time, event_picture, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`
	_, err := r.db.Exec(ctx, query, event.ID, event.AuthorID, event.EventName, event.Description, event.Status, event.EventCategory, event.EventDateAndTime, event.EventPicture, event.CreatedAt, event.UpdatedAt)
	return err
}

func (r *EventRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Event, error) {
	query := `
		SELECT id, author_id, event_name, COALESCE(description, ''), status, event_category, event_date_and_time, event_picture, created_at, updated_at
		FROM events
		WHERE id = $1
	`
	event := &domain.Event{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&event.ID, &event.AuthorID, &event.EventName, &event.Description,
		&event.Status, &event.EventCategory, &event.EventDateAndTime, &event.EventPicture,
		&event.CreatedAt, &event.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("event not found")
		}
		return nil, err
	}
	return event, nil
}

func (r *EventRepository) FindByName(ctx context.Context, name string) (*domain.Event, error) {
	query := `
		SELECT id, author_id, event_name, COALESCE(description, ''), status, event_category, event_date_and_time, event_picture, created_at, updated_at
		FROM events
		WHERE event_name ILIKE $1	
	`
	event := &domain.Event{}
	err := r.db.QueryRow(ctx, query, name).Scan(
		&event.ID, &event.AuthorID, &event.EventName, &event.Description,
		&event.Status, &event.EventCategory, &event.EventDateAndTime, &event.EventPicture,
		&event.CreatedAt, &event.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("event not found")
		}
		return nil, err
	}
	return event, nil
}

func (r *EventRepository) FindByDate(ctx context.Context, start time.Time) ([]*domain.Event, error) {
	query := `
		SELECT id, author_id, event_name, COALESCE(description, ''), status, event_category, event_date_and_time, event_picture, created_at, updated_at
		FROM events
		WHERE event_date_and_time >= $1	and event_date_and_time < $1
	`
	rows, err := r.db.Query(ctx, query, start)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []*domain.Event
	for rows.Next() {
		event := &domain.Event{}
		err := rows.Scan(
			&event.ID, &event.AuthorID, &event.EventName, &event.Description,
			&event.Status, &event.EventCategory, &event.EventDateAndTime, &event.EventPicture,
			&event.CreatedAt, &event.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return events, nil
}

func (r *EventRepository) FindByAuthorID(ctx context.Context, id uuid.UUID) ([]*domain.Event, error) {
	query := `
		SELECT id, author_id, event_name, COALESCE(description, ''), status, event_category, event_date_and_time, event_picture, created_at, updated_at
		FROM events
		WHERE author_id = $1
	`
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []*domain.Event
	for rows.Next() {
		event := &domain.Event{}
		err := rows.Scan(
			&event.ID, &event.AuthorID, &event.EventName, &event.Description,
			&event.Status, &event.EventCategory, &event.EventDateAndTime, &event.EventPicture,
			&event.CreatedAt, &event.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return events, nil
}

func (r *EventRepository) Update(ctx context.Context, event *domain.Event) error {
	query := `
		UPDATE events
		SET event_name = $1, description = $2, status = $3, event_category = $4, event_date_and_time = $5, event_picture = $6, updated_at = CURRENT_TIMESTAMP
		WHERE id = $7
	`
	commandTag, err := r.db.Exec(ctx, query, event.EventName, event.Description, event.Status,
		event.EventCategory, event.EventDateAndTime, event.EventPicture, event.ID,
	)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("event not found to update")
	}
	return nil
}

func (r *EventRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM events WHERE id = $1`
	commandTag, err := r.db.Exec(ctx, query, id)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("event not found to delete")
	}
	return nil
}

func (r *EventRepository) FindAll(ctx context.Context) ([]*domain.Event, error) {
	query := `
		SELECT id, author_id, event_name, COALESCE(description, ''), status, event_category, event_date_and_time, event_picture, created_at, updated_at
		FROM events
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []*domain.Event
	for rows.Next() {
		event := &domain.Event{}
		err := rows.Scan(
			&event.ID, &event.AuthorID, &event.EventName, &event.Description,
			&event.Status, &event.EventCategory, &event.EventDateAndTime, &event.EventPicture,
			&event.CreatedAt, &event.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return events, nil
}
