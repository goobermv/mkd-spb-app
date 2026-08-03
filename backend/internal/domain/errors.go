package domain

import "errors"

var (
	ErrUserAlreadyExists  = errors.New("user with this email already exists")
	ErrInvalidCredentials = errors.New("incorrect email or password")
	ErrUserNotFound       = errors.New("user not found")
	ErrInvalidOldPassword = errors.New("incorrect old password")
	ErrEmailExists        = errors.New("user with this email already exists")
	ErrFailedToUpdateUser = errors.New("failed to update user")
	ErrFailedToDeleteUser = errors.New("failed to delete user")

	ErrApplicationNotFound       = errors.New("application not found")
	ErrApplicationsNotFound      = errors.New("applications not found")
	ErrFailedToUpdateApplication = errors.New("update to delete application")
	ErrFailedToDeleteApplication = errors.New("failed to delete application")

	ErrNoPermissionUpdateUser = errors.New("you do not have the permissions to update this user")
)
