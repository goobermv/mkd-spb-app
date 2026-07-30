package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/handlers/dtos"
	"github.com/goobermv/mkd-spb-app/internal/repositories/interfaces"
	"github.com/google/uuid"
)

var (
	ErrUserAlreadyExists  = errors.New("пользователь с таким email уже существует")
	ErrInvalidCredentials = errors.New("неверный email или пароль")
	ErrUserNotFound       = errors.New("пользователь не найден")
	ErrInvalidOldPassword = errors.New("неверный старый пароль")
)

type PasswordHasher interface {
	Hash(password string) (string, error)
	Verify(password, hash string) bool
}

type TokenManager interface {
	Generate(userID uuid.UUID, role string) (string, error)
}

type UserUsecase interface {
	Register(ctx context.Context, input dtos.RegisterInput) (*domain.User, error)
	Login(ctx context.Context, input dtos.LoginInput) (string, *domain.User, error)
	GetProfile(ctx context.Context, id uuid.UUID) (*domain.User, error)
	UpdateProfile(ctx context.Context, id uuid.UUID, input dtos.UpdateUserInfoRequest) (*domain.User, error)
	UpdatePassword(ctx context.Context, id uuid.UUID, input dtos.UpdateUserPasswordRequest) error
	DeleteProfile(ctx context.Context, id uuid.UUID) error
}

type userUsecase struct {
	userRepo     interfaces.UserRepository
	hasher       PasswordHasher
	tokenManager TokenManager
}

func NewUserUsecase(repo interfaces.UserRepository, hasher PasswordHasher, tokenManager TokenManager) UserUsecase {
	return &userUsecase{
		userRepo:     repo,
		hasher:       hasher,
		tokenManager: tokenManager,
	}
}

func (u *userUsecase) Register(ctx context.Context, input dtos.RegisterInput) (*domain.User, error) {
	existingUser, err := u.userRepo.FindByEmail(ctx, input.Email)
	if err == nil && existingUser != nil {
		return nil, ErrUserAlreadyExists
	}

	hashedPassword, err := u.hasher.Hash(input.Password)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:              uuid.New(),
		Email:           input.Email,
		PasswordHash:    hashedPassword,
		FullName:        input.FullName,
		BirthDate:       input.BirthDate,
		Country:         input.Country,
		JobField:        input.JobField,
		UserDescription: input.UserDescription,
		VKLink:          input.VKLink,
		UserRole:        domain.UserRoleRegular,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}

	if err := u.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	user.PasswordHash = ""
	return user, nil
}

func (u *userUsecase) Login(ctx context.Context, input dtos.LoginInput) (string, *domain.User, error) {
	user, err := u.userRepo.FindByEmail(ctx, input.Email)
	if err != nil || user == nil {
		return "", nil, ErrInvalidCredentials
	}

	if !u.hasher.Verify(input.Password, user.PasswordHash) {
		return "", nil, ErrInvalidCredentials
	}

	token, err := u.tokenManager.Generate(user.ID, user.UserRole)
	if err != nil {
		return "", nil, err
	}

	user.PasswordHash = ""
	return token, user, nil
}

func (u *userUsecase) GetProfile(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	user, err := u.userRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrUserNotFound
	}

	user.PasswordHash = ""
	return user, nil
}

func (u *userUsecase) UpdateProfile(ctx context.Context, id uuid.UUID, input dtos.UpdateUserInfoRequest) (*domain.User, error) {
	user, err := u.userRepo.FindByID(ctx, id)
	if err != nil {
		return nil, ErrUserNotFound
	}

	if input.Email != nil {
		user.Email = *input.Email
	}
	if input.FullName != nil {
		user.FullName = *input.FullName
	}
	if input.BirthDate != nil {
		user.BirthDate = *input.BirthDate
	}
	if input.Country != nil {
		user.Country = *input.Country
	}
	if input.JobField != nil {
		user.JobField = *input.JobField
	}
	if input.UserDescription != nil {
		user.UserDescription = *input.UserDescription
	}
	if input.VKLink != nil {
		user.VKLink = *input.VKLink
	}

	user.UpdatedAt = time.Now()

	if err := u.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	user.PasswordHash = ""
	return user, nil
}

func (u *userUsecase) UpdatePassword(ctx context.Context, id uuid.UUID, input dtos.UpdateUserPasswordRequest) error {
	user, err := u.userRepo.FindByID(ctx, id)
	if err != nil {
		return ErrUserNotFound
	}

	if !u.hasher.Verify(input.OldPassword, user.PasswordHash) {
		return ErrInvalidOldPassword
	}

	hashedPassword, err := u.hasher.Hash(input.NewPassword)
	if err != nil {
		return err
	}

	user.PasswordHash = hashedPassword
	user.UpdatedAt = time.Now()

	return u.userRepo.Update(ctx, user)
}

func (u *userUsecase) DeleteProfile(ctx context.Context, id uuid.UUID) error {
	_, err := u.userRepo.FindByID(ctx, id)
	if err != nil {
		return ErrUserNotFound
	}

	return u.userRepo.Delete(ctx, id)
}
