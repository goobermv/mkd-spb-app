package usecase

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/network/dtos"
	"github.com/goobermv/mkd-spb-app/internal/repositories/interfaces"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/google/uuid"
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
	GetUser(ctx context.Context, id uuid.UUID) (*domain.User, error)
	GetUserByName(ctx context.Context, name string) (*domain.User, error)
	GetUserByEmail(ctx context.Context, email string) (*domain.User, error)
	UpdateUser(ctx context.Context, id uuid.UUID, input dtos.UpdateUserInfoRequest) (*domain.User, error)
	UpdatePassword(ctx context.Context, id uuid.UUID, input dtos.UpdateUserPasswordRequest) error
	DeleteUser(ctx context.Context, id uuid.UUID) error
	GetAllUsers(ctx context.Context) ([]*domain.User, error)
}

type userUsecase struct {
	userRepo     interfaces.UserRepository
	hasher       PasswordHasher
	tokenManager TokenManager
	logger       logger.Logger
}

func NewUserUsecase(repo interfaces.UserRepository, hasher PasswordHasher, tokenManager TokenManager, logger logger.Logger) UserUsecase {
	return &userUsecase{
		userRepo:     repo,
		hasher:       hasher,
		tokenManager: tokenManager,
		logger:       logger,
	}
}

func (u *userUsecase) Register(ctx context.Context, input dtos.RegisterInput) (*domain.User, error) {
	u.logger.Infof("Attempting to register user with email: %s", input.Email)

	existingUser, err := u.userRepo.FindByEmail(ctx, input.Email)
	if err == nil && existingUser != nil {
		u.logger.Warnf("Registration failed: email already exists - %s", input.Email)
		return nil, domain.ErrUserAlreadyExists
	}

	if err != nil && !errors.Is(err, domain.ErrUserNotFound) && !errors.Is(err, sql.ErrNoRows) {
		u.logger.Errorf(err, "Database error when checking email: %s", input.Email)
		return nil, err
	}

	hashedPassword, err := u.hasher.Hash(input.Password)
	if err != nil {
		u.logger.Errorf(err, "Failed to hash password for user: %s", input.Email)
		return nil, domain.ErrFailedToHashPassword
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
		u.logger.Errorf(err, "Failed to create user in database: %s", input.Email)
		return nil, domain.ErrFailedToCreateUser
	}

	user.PasswordHash = ""

	u.logger.Successf("User registered successfully - ID: %s, Email: %s", user.ID, user.Email)

	return user, nil
}

func (u *userUsecase) Login(ctx context.Context, input dtos.LoginInput) (string, *domain.User, error) {
	u.logger.Infof("Login attempt for email: %s", input.Email)

	user, err := u.userRepo.FindByEmail(ctx, input.Email)
	if err != nil {
		u.logger.Errorf(err, "Database error during login for email: %s", input.Email)
		return "", nil, domain.ErrInvalidCredentials
	}
	if user == nil {
		u.logger.Warnf("Login failed: user not found - %s", input.Email)
		return "", nil, domain.ErrInvalidCredentials
	}

	if !u.hasher.Verify(input.Password, user.PasswordHash) {
		u.logger.Errorf(err, "Login failed: invalid password for user - %s", input.Email)
		return "", nil, domain.ErrInvalidCredentials
	}

	token, err := u.tokenManager.Generate(user.ID, user.UserRole)
	if err != nil {
		u.logger.Errorf(err, "Failed to generate token for user: %s", user.ID)
		return "", nil, domain.ErrFailedToGenerateToken
	}

	user.PasswordHash = ""

	u.logger.Successf("User successfully logged in - ID: %s, Email: %s", user.ID, user.Email)

	return token, user, nil
}

func (u *userUsecase) GetUser(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	u.logger.Infof("Attempting to get user by ID: %s", id)

	user, err := u.userRepo.FindByID(ctx, id)
	if err != nil {
		u.logger.Errorf(err, "Failed to find user: %s", id)
		return nil, domain.ErrUserNotFound
	}
	if user == nil {
		u.logger.Warnf("User not found: %s", id)
		return nil, domain.ErrUserNotFound
	}

	user.PasswordHash = ""

	u.logger.Successf("User retrieved successfully: %s", id)

	return user, nil
}

func (u *userUsecase) GetUserByName(ctx context.Context, name string) (*domain.User, error) {
	u.logger.Infof("Attempting to get user by name: %s", name)

	user, err := u.userRepo.FindByFullName(ctx, name)
	if err != nil {
		u.logger.Errorf(err, "Failed to find user: %s", name)
		return nil, domain.ErrUserNotFound
	}
	if user == nil {
		u.logger.Warnf("User not found: %s", name)
		return nil, domain.ErrUserNotFound
	}

	user.PasswordHash = ""

	u.logger.Successf("User retrieved successfully: %s", name)

	return user, nil
}

func (u *userUsecase) GetUserByEmail(ctx context.Context, email string) (*domain.User, error) {
	u.logger.Infof("Attempting to get user by email: %s", email)

	user, err := u.userRepo.FindByEmail(ctx, email)
	if err != nil {
		u.logger.Errorf(err, "Failed to find user: %s", email)
		return nil, domain.ErrUserNotFound
	}
	if user == nil {
		u.logger.Warnf("User not found: %s", email)
		return nil, domain.ErrUserNotFound
	}

	user.PasswordHash = ""

	u.logger.Successf("User retrieved successfully: %s", email)

	return user, nil
}

func (u *userUsecase) UpdateUser(ctx context.Context, id uuid.UUID, input dtos.UpdateUserInfoRequest) (*domain.User, error) {
	u.logger.Infof("Updating user info for ID: %s", id)

	user, err := u.userRepo.FindByID(ctx, id)
	if err != nil {
		u.logger.Errorf(err, "Failed to find user for update: %s", id)
		return nil, domain.ErrUserNotFound
	}
	if user == nil {
		u.logger.Warnf("User not found for update: %s", id)
		return nil, domain.ErrUserNotFound
	}

	if user.ID != id {
		u.logger.Warnf("User ID mismatch - expected: %s, got: %s", id, user.ID)
		return nil, domain.ErrNoPermissionUpdateUser
	}

	if input.Email != nil {
		u.logger.Debugf("Checking email availability: %s", *input.Email)
		existing_email, _ := u.userRepo.FindByEmail(ctx, *input.Email)

		if existing_email != nil && existing_email.ID != id {
			u.logger.Warnf("Email already taken by another user: %s", *input.Email)
			return nil, domain.ErrEmailExists
		}

		user.Email = *input.Email

		u.logger.Infof("Email updated to: %s for user: %s", *input.Email, id)
	}

	if input.FullName != nil {
		user.FullName = *input.FullName
		u.logger.Infof("Full name updated to: %s for user: %s", *input.FullName, id)
	}

	if input.BirthDate != nil {
		user.BirthDate = *input.BirthDate
		u.logger.Infof("Birthdate updated to: %s for user: %s", *input.BirthDate, id)
	}

	if input.Country != nil {
		user.Country = *input.Country
		u.logger.Infof("Country updated to: %s for user: %s", *input.Country, id)
	}

	if input.JobField != nil {
		user.JobField = *input.JobField
		u.logger.Infof("Job field updated to: %s for user: %s", *input.JobField, id)
	}

	if input.UserDescription != nil {
		user.UserDescription = *input.UserDescription
		u.logger.Infof("Description updated to: %s for user: %s", *input.UserDescription, id)
	}

	if input.VKLink != nil {
		user.VKLink = *input.VKLink
		u.logger.Infof("VK link updated to: %s for user: %s", *input.VKLink, id)
	}

	user.UpdatedAt = time.Now()

	if err := u.userRepo.Update(ctx, user); err != nil {
		u.logger.Errorf(err, "Failed to update user in database: %s", id)
		return nil, domain.ErrFailedToUpdateUser
	}

	user.PasswordHash = ""

	u.logger.Successf("User info updated successfully for user: %s", id)

	return user, nil
}

func (u *userUsecase) UpdatePassword(ctx context.Context, id uuid.UUID, input dtos.UpdateUserPasswordRequest) error {
	u.logger.Infof("Updating password for user: %s", id)

	user, err := u.userRepo.FindByID(ctx, id)
	if err != nil || user == nil {
		return domain.ErrUserNotFound
	}

	if input.OldPassword != nil && *input.OldPassword != "" && input.NewPassword != nil && *input.NewPassword != "" {
		u.logger.Debugf("Verifying old password for user: %s", id)

		if !u.hasher.Verify(*input.OldPassword, user.PasswordHash) {
			u.logger.Errorf(err, "Failed to verify old password for user: %s", id)
			return domain.ErrInvalidOldPassword
		}

		u.logger.Debugf("Hashing new password for user: %s", id)

		hashedPassword, err := u.hasher.Hash(*input.NewPassword)
		if err != nil {
			u.logger.Errorf(err, "Failed to hash new password for user: %s", id)
			return domain.ErrFailedToHashPassword
		}

		user.PasswordHash = hashedPassword
	}

	user.UpdatedAt = time.Now()

	if err := u.userRepo.Update(ctx, user); err != nil {
		u.logger.Errorf(err, "Failed to update password in database: %s", id)
		return domain.ErrFailedToUpdateUser
	}

	u.logger.Successf("Password updated successfully for user: %s", id)

	return nil
}

func (u *userUsecase) DeleteUser(ctx context.Context, id uuid.UUID) error {
	u.logger.Infof("Deleting user: %s", id)

	user, err := u.userRepo.FindByID(ctx, id)
	if err != nil {
		u.logger.Errorf(err, "Failed to find user for deletion: %s", id)
		return domain.ErrUserNotFound
	}
	if user == nil {
		u.logger.Warnf("User not found for deletion: %s", id)
		return domain.ErrUserNotFound
	}

	if err := u.userRepo.Delete(ctx, id); err != nil {
		u.logger.Errorf(err, "Failed to delete user from database: %s", id)
		return domain.ErrFailedToDeleteUser
	}

	u.logger.Successf("User deleted successfully: %s (Email: %s)", id, user.Email)

	return nil
}

func (u *userUsecase) GetAllUsers(ctx context.Context) ([]*domain.User, error) {
	u.logger.Infof("Retrieving all users...")

	users, err := u.userRepo.FindAll(ctx)
	if err != nil {
		u.logger.Errorf(err, "Failed to find users")
		return nil, domain.ErrUsersNotFound
	}
	if users == nil {
		u.logger.Warnf("Users not found")
		return nil, domain.ErrUsersNotFound
	}

	u.logger.Successf("Users retrieved successfully")

	return users, nil
}
