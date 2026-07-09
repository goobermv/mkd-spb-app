package postgres

import (
	"context"
	"errors"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EventReviewRepository struct {
	db *pgxpool.Pool
}

func NewEventReviewRepository(db *pgxpool.Pool) *EventReviewRepository {
	return &EventReviewRepository{db: db}
}

func (r *EventReviewRepository) Create(ctx context.Context, review *domain.EventReview) error {
	query := `
		INSERT INTO event_reviews (id, author_id, event_id, event_rating, review_text, date)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(ctx, query, review.ID, review.AuthorID, review.EventID, review.EventRating, review.ReviewText, review.Date)
	return err
}

func (r *EventReviewRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.EventReview, error) {
	query := `
		SELECT id, author_id, event_id, event_rating, COALESCE(review_text, ''), date
		FROM event_reviews
		WHERE id = $1
	`
	review := &domain.EventReview{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&review.ID, &review.AuthorID, &review.EventID, &review.EventRating, &review.ReviewText, &review.Date,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("review not found")
		}
		return nil, err
	}
	return review, nil
}

func (r *EventReviewRepository) FindByEventID(ctx context.Context, id uuid.UUID) ([]*domain.EventReview, error) {
	query := `
		SELECT id, author_id, event_id, event_rating, COALESCE(review_text, ''), date
		FROM event_reviews
		WHERE event_id = $1
	`
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []*domain.EventReview
	for rows.Next() {
		review := &domain.EventReview{}
		err := rows.Scan(
			&review.ID, &review.AuthorID, &review.EventID, &review.EventRating, &review.ReviewText, &review.Date,
		)
		if err != nil {
			return nil, err
		}
		reviews = append(reviews, review)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return reviews, nil
}

func (r *EventReviewRepository) Update(ctx context.Context, review *domain.EventReview) error {
	query := `
		UPDATE event_reviews
		SET event_rating = $1, review_text = $2, date = CURRENT_TIMESTAMP
		WHERE id = $3
	`
	commandTag, err := r.db.Exec(ctx, query, review.EventRating, review.ReviewText, review.ID)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("review not found to update")
	}
	return nil
}

func (r *EventReviewRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM event_reviews WHERE id = $1`
	commandTag, err := r.db.Exec(ctx, query, id)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("review not found to delete")
	}
	return nil
}
