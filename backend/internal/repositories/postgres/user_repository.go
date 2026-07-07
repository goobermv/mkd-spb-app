package postgres

import (
	"context"
	"errors"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	query := `
		INSERT INTO users (id, email, password_hash, full_name, birth_date, country, job_field, user_description, vk_link, user_role, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
	`

	_, err := r.db.Exec(ctx, query, user.ID, user.Email, user.PasswordHash, user.FullName, user.BirthDate,
		user.Country, user.JobField, user.UserDescription, user.VKLink, user.CreatedAt, user.UpdatedAt)
	return err
}

func (r *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	query := `
		SELECT id, email, password_hash, full_name, birth_date, country, job_field, COALESCE(user_description, ''), vk_link, user_role, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	user := &domain.User{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.FullName, &user.BirthDate,
		&user.Country, &user.JobField, &user.UserDescription, &user.VKLink, &user.UserRole,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) FindByFullName(ctx context.Context, fullname string) (*domain.User, error) {
	query := `
		SELECT id, email, password_hash, full_name, birth_date, country, job_field, COALESCE(user_description, ''), vk_link, user_role, created_at, updated_at
		FROM users
		WHERE full_name ILIKE $1	
	`

	user := &domain.User{}
	err := r.db.QueryRow(ctx, query, fullname).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.FullName, &user.BirthDate,
		&user.Country, &user.JobField, &user.UserDescription, &user.VKLink, &user.UserRole,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `
		SELECT id, email, password_hash, full_name, birth_date, country, job_field, COALESCE(user_description, ''), vk_link, user_role, created_at, updated_at
		FROM users
		WHERE email = $1	
	`

	user := &domain.User{}
	err := r.db.QueryRow(ctx, query, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.FullName, &user.BirthDate,
		&user.Country, &user.JobField, &user.UserDescription, &user.VKLink, &user.UserRole,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) Update(ctx context.Context, user *domain.User) error {
	query := `
		UPDATE users
		SET email = $1, password_hash = $2, full_name = $3, birth_date = $4, country = $5, job_field = $6, user_description = $7, vk_link = $8, user_role = $9, updated_at = CURRENT_TIMESTAMP
		WHERE id = $10
	`
	commandTag, err := r.db.Exec(ctx, query,
		user.Email, user.PasswordHash, user.FullName, user.BirthDate, user.Country,
		user.JobField, user.UserDescription, user.VKLink, user.UserRole, user.ID,
	)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("user not found to update")
	}
	return nil
}

func (r *UserRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM users WHERE id = $1`
	commandTag, err := r.db.Exec(ctx, query, id)

	if err != nil {
		return err
	}
	if commandTag.RowsAffected() == 0 {
		return errors.New("user not found to delete")
	}
	return nil
}

func (r *UserRepository) FindAll(ctx context.Context) ([]*domain.User, error) {
	query := `
		SELECT id, email, password_hash, full_name, birth_date, country, job_field, COALESCE(user_description, ''), vk_link, user_role, created_at, updated_at
		FROM users
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		user := &domain.User{}
		err := rows.Scan(
			&user.ID, &user.Email, &user.PasswordHash, &user.FullName, &user.BirthDate,
			&user.Country, &user.JobField, &user.UserDescription, &user.VKLink, &user.UserRole,
			&user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}
