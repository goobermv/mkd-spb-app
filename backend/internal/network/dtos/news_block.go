package dtos

import (
	"time"

	"github.com/google/uuid"
)

type CreateNewsBlockInput struct {
	AuthorID          uuid.UUID `json:"author_id" validate:"required"`
	Title             string    `json:"title" validate:"required"`
	Description       string    `json:"description" validate:"required"`
	NewsBlockCategory string    `json:"news_block_category" validate:"required"`
	NewsBlockPicture  string    `json:"news_block_picture" validate:"required"`
}

type NewsBlockResponse struct {
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
	Title             *string    `json:"title,omitempty"`
	Description       *string    `json:"description,omitempty"`
	NewsBlockCategory *string    `json:"news_block_category,omitempty"`
	PublicationDate   *time.Time `json:"publication_date,omitempty"`
	PublicationStatus *string    `json:"publication_status,omitempty"`
	NewsBlockPicture  *string    `json:"news_block_picture,omitempty"`
}
