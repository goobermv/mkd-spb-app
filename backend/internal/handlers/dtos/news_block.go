package dtos

import (
	"time"

	"github.com/google/uuid"
)

type CreateNewsBlockInput struct {
	AuthorID          uuid.UUID `json:"author_id"`
	Title             string    `json:"title"`
	Description       string    `json:"description"`
	NewsBlockCategory string    `json:"news_block_category"`
	NewsBlockPicture  string    `json:"news_block_picture"`
}

type NewsBlock struct {
	ID                uuid.UUID `json:"id"`
	AuthorID          uuid.UUID `json:"author_id"`
	Title             string    `json:"title"`
	Description       string    `json:"description"`
	NewsBlockCategory string    `json:"news_block_category"`
	PublicationDate   time.Time `json:"publication_date"`
	PublicationStatus string    `json:"publication_status"`
	NewsBlockPicture  string    `json:"news_block_picture"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type UpdateNewsBlockRequest struct {
	Title             *string    `json:"title"`
	Description       *string    `json:"description"`
	NewsBlockCategory *string    `json:"news_block_category"`
	PublicationDate   *time.Time `json:"publication_date"`
	NewsBlockPicture  *string    `json:"news_block_picture"`
}
