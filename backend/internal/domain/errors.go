package domain

import "errors"

var (
	ErrUserAlreadyExists  = errors.New("user with this email already exists")
	ErrInvalidCredentials = errors.New("incorrect email or password")
	ErrUserNotFound       = errors.New("user not found")
	ErrInvalidOldPassword = errors.New("incorrect old password")
	ErrEmailExists        = errors.New("user with this email already exists")
	ErrFailedToCreateUser = errors.New("failed to create user")
	ErrFailedToUpdateUser = errors.New("failed to update user")
	ErrFailedToDeleteUser = errors.New("failed to delete user")

	ErrNoPermissionUpdateUser = errors.New("you do not have the permissions to update this user")

	ErrApplicationNotFound       = errors.New("application not found")
	ErrApplicationsNotFound      = errors.New("applications not found")
	ErrFailedToCreateApplication = errors.New("failed to create applicationr")
	ErrFailedToUpdateApplication = errors.New("failed to update application")
	ErrFailedToDeleteApplication = errors.New("failed to delete application")

	ErrNoPermissionUpdateApplication = errors.New("you do not have the permissions to update this application")

	ErrEventRegistrationNotFound       = errors.New("registration not found")
	ErrEventRegistrationsNotFound      = errors.New("registrations not found")
	ErrFailedToCreateEventRegistration = errors.New("failed to create event registration")
	ErrFailedToUpdateEventRegistration = errors.New("failed to update event registration")
	ErrFailedToDeleteEventRegistration = errors.New("failed to delete event registration")

	ErrNoPermissionUpdateEventRegistration = errors.New("you do not have the permissions to update this registration")

	ErrEventReviewNotFound       = errors.New("event review not found")
	ErrFailedToCreateEventReview = errors.New("failed to create event review")
	ErrFailedToUpdateEventReview = errors.New("failed to update event review")
	ErrFailedToDeleteEventReview = errors.New("failed to delete event review")

	ErrNoPermissionUpdateEventReview = errors.New("you do not have the permissions to update this review")

	ErrEventNotFound       = errors.New("event not found")
	ErrEventsNotFound      = errors.New("events not founds")
	ErrFailedToCreateEvent = errors.New("failed to create event")
	ErrFailedToUpdateEvent = errors.New("failed to update event")
	ErrFailedToDeleteEvent = errors.New("failed to delete event")

	ErrNoPermissionUpdateEvent = errors.New("you do not have the permissions to update this event")
)
