package domain

import "errors"

var (
	ErrUserAlreadyExists     = errors.New("user with this email already exists")
	ErrInvalidCredentials    = errors.New("incorrect email or password")
	ErrUserNotFound          = errors.New("user not found")
	ErrUsersNotFound         = errors.New("users not found")
	ErrInvalidOldPassword    = errors.New("incorrect old password")
	ErrEmailExists           = errors.New("user with this email already exists")
	ErrFailedToHashPassword  = errors.New("failed to hash password")
	ErrFailedToGenerateToken = errors.New("failed to generate token")
	ErrFailedToCreateUser    = errors.New("failed to create user")
	ErrFailedToUpdateUser    = errors.New("failed to update user")
	ErrFailedToDeleteUser    = errors.New("failed to delete user")

	ErrNoPermissionUpdateUser = errors.New("you do not have the permissions to update this user")

	ErrApplicationNotFound       = errors.New("application not found")
	ErrApplicationsNotFound      = errors.New("applications not found")
	ErrFailedToCreateApplication = errors.New("failed to create application")
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
	ErrEventsNotFound      = errors.New("events not found")
	ErrFailedToCreateEvent = errors.New("failed to create event")
	ErrFailedToUpdateEvent = errors.New("failed to update event")
	ErrFailedToDeleteEvent = errors.New("failed to delete event")

	ErrNoPermissionUpdateEvent = errors.New("you do not have the permissions to update this event")

	ErrNewsBlockNotFound       = errors.New("news block not found")
	ErrNewsBlocksNotFound      = errors.New("news blocks not found")
	ErrFailedToCreateNewsBlock = errors.New("failed to create news block")
	ErrFailedToUpdateNewsBlock = errors.New("failed to update news block")
	ErrFailedToDeleteNewsBlock = errors.New("failed to delete news block")

	ErrNoPermissionUpdateNewsBlock = errors.New("you do not have the permissions to update this news block")

	ErrNotificationNotFound       = errors.New("notification not found")
	ErrNotificationsNotFound      = errors.New("notifications not found")
	ErrFailedToCreateNotification = errors.New("failed to create notification")
	ErrFailedToUpdateNotification = errors.New("failed to update notification")
	ErrFailedToDeleteNotification = errors.New("failed to delete notification")

	ErrNoPermissionUpdateNotification = errors.New("you do not have the permissions to update this notification")
)
