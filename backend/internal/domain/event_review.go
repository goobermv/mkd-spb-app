package domain

import (
	"time"

	"github.com/google/uuid"
)

type EventReview struct {
	ID          uuid.UUID
	AuthorID    uuid.UUID
	EventID     uuid.UUID
	EventRating int
	ReviewText  string
	Date        time.Time // дата содания отзыва
}
