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

type NewsBlockRepository struct {
	db *pgxpool.Pool
}

func NewNewsBlockRepository(db *pgxpool.Pool) *NewsBlockRepository {
	return &NewsBlockRepository{db: db}
}

func (r *NewsBlockRepository) Create(ctx context.Context, newsBlock *domain.NewsBlock) error {
	query := `
		INSERT INTO usersnews_blocks (id, author_id, title, description, news_block_category, publication_date, publication_status, news_block_picture, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`

	_, err := r.db.Exec(ctx, query, newsBlock.ID, newsBlock.AuthorID, newsBlock.Title,
		newsBlock.Description, newsBlock.NewsBlockCategory, newsBlock.PublicationDate,
		newsBlock.PublicationStatus, newsBlock.NewsBlockPicture, newsBlock.CreatedAt, newsBlock.UpdatedAt)
	return err
}

func (r *NewsBlockRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.NewsBlock, error) {
	query := `
		SELECT id, author_id, title, COALESCE(description, ''), news_block_category, publication_date, publication_status, news_block_picture, created_at, updated_at
		FROM news_blocks
		WHERE id = $1
	`
	newsBlock := &domain.NewsBlock{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&newsBlock.ID, &newsBlock.AuthorID, &newsBlock.Title,
		&newsBlock.Description, &newsBlock.NewsBlockCategory, &newsBlock.PublicationDate,
		&newsBlock.PublicationStatus, &newsBlock.NewsBlockPicture, &newsBlock.CreatedAt, &newsBlock.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return newsBlock, nil
}

func (r *NewsBlockRepository) FindByTitle(ctx context.Context, title string) (*domain.NewsBlock, error) {
	query := `
		SELECT id, author_id, title, COALESCE(description, ''), news_block_category, publication_date, publication_status, news_block_picture, created_at, updated_at
		FROM news_blocks
		WHERE title ILIKE $1	
	`
	newsBlock := &domain.NewsBlock{}
	err := r.db.QueryRow(ctx, query, title).Scan(
		&newsBlock.ID, &newsBlock.AuthorID, &newsBlock.Title,
		&newsBlock.Description, &newsBlock.NewsBlockCategory, &newsBlock.PublicationDate,
		&newsBlock.PublicationStatus, &newsBlock.NewsBlockPicture, &newsBlock.CreatedAt, &newsBlock.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("news block not found")
		}
		return nil, err
	}
	return newsBlock, nil
}

func (r *NewsBlockRepository) FindByDate(ctx context.Context, date time.Time) ([]*domain.NewsBlock, error) {
	query := `
		SELECT id, author_id, title, COALESCE(description, ''), news_block_category, publication_date, publication_status, news_block_picture, created_at, updated_at
		FROM news_blocks
		WHERE publication_date = $1
	`
	rows, err := r.db.Query(ctx, query, date)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var newsBlocks []*domain.NewsBlock
	for rows.Next() {
		newsBlock := &domain.NewsBlock{}
		err := rows.Scan(
			&newsBlock.ID, &newsBlock.AuthorID, &newsBlock.Title,
			&newsBlock.Description, &newsBlock.NewsBlockCategory, &newsBlock.PublicationDate,
			&newsBlock.PublicationStatus, &newsBlock.NewsBlockPicture, &newsBlock.CreatedAt, &newsBlock.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		newsBlocks = append(newsBlocks, newsBlock)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return newsBlocks, nil
}

func (r *NewsBlockRepository) FindByAuthorID(ctx context.Context, id uuid.UUID) ([]*domain.NewsBlock, error) {
	query := `
		SELECT id, author_id, title, COALESCE(description, ''), news_block_category, publication_date, publication_status, news_block_picture, created_at, updated_at
		FROM news_blocks
		WHERE author_id = $1
	`
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var newsBlocks []*domain.NewsBlock
	for rows.Next() {
		newsBlock := &domain.NewsBlock{}
		err := rows.Scan(
			&newsBlock.ID, &newsBlock.AuthorID, &newsBlock.Title,
			&newsBlock.Description, &newsBlock.NewsBlockCategory, &newsBlock.PublicationDate,
			&newsBlock.PublicationStatus, &newsBlock.NewsBlockPicture, &newsBlock.CreatedAt, &newsBlock.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		newsBlocks = append(newsBlocks, newsBlock)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return newsBlocks, nil
}

func (r *NewsBlockRepository) Update(ctx context.Context, newsBlock *domain.NewsBlock) error {
	query := `
		UPDATE news_blocks
		SET title = $1, description = $2, news_block_category = $3, publication_date = $4, publication_status = $5, news_block_picture = $6, updated_at = CURRENT_TIMESTAMP
		WHERE id = $7
	`
	commandTag, err := r.db.Exec(ctx, query, newsBlock.Title, newsBlock.Description,
		newsBlock.NewsBlockCategory, newsBlock.PublicationDate, newsBlock.PublicationStatus,
		newsBlock.NewsBlockPicture, newsBlock.UpdatedAt, newsBlock.ID,
	)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("news block not found to update")
	}
	return nil
}

func (r *NewsBlockRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM news_blocks WHERE id = $1`
	commandTag, err := r.db.Exec(ctx, query, id)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("news block not found to delete")
	}
	return nil
}

func (r *NewsBlockRepository) FindAll(ctx context.Context) ([]*domain.NewsBlock, error) {
	query := `
		SELECT id, author_id, title, COALESCE(description, ''), news_block_category, publication_date, publication_status, news_block_picture, created_at, updated_at
		FROM news_blocks
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var newsBlocks []*domain.NewsBlock
	for rows.Next() {
		newsBlock := &domain.NewsBlock{}
		err := rows.Scan(
			&newsBlock.ID, &newsBlock.AuthorID, &newsBlock.Title,
			&newsBlock.Description, &newsBlock.NewsBlockCategory, &newsBlock.PublicationDate,
			&newsBlock.PublicationStatus, &newsBlock.NewsBlockPicture, &newsBlock.CreatedAt, &newsBlock.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		newsBlocks = append(newsBlocks, newsBlock)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return newsBlocks, nil
}
