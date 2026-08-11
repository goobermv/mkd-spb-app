package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/handlers/dtos"
	"github.com/goobermv/mkd-spb-app/internal/usecase"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/google/uuid"
)

type NotificationHandler struct {
	notificationUsecase usecase.NotificationUsecase
	logger              logger.Logger
	validator           *validator.Validate
}

func NewNotificationHandler(notificationUseCase usecase.NotificationUsecase, logger logger.Logger, validator *validator.Validate) *NotificationHandler {
	return &NotificationHandler{
		notificationUsecase: notificationUseCase,
		logger:              logger,
		validator:           validator,
	}
}

func mapToNotificationResponse(notification *domain.Notification) dtos.NotificationResponse {
	return dtos.NotificationResponse{
		ID:               notification.ID,
		UserID:           notification.UserID,
		NotificationText: notification.NotificationText,
		NotificationType: notification.NotificationType,
		WasReadStatus:    notification.WasReadStatus,
		Date:             notification.Date,
	}
}

func (h *NotificationHandler) CreateNotification(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	var input dtos.CreateNotificationInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode notification creation input")
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for notification creation input")
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	notification, err := h.notificationUsecase.CreateNotification(r.Context(), input)
	if err != nil {
		h.logger.Errorf(err, "Internal error during event creation:")
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 201 Created for notification: %s", notification.ID)
	respondJSON(w, http.StatusCreated, mapToNotificationResponse(notification))
}

func (h *NotificationHandler) GetNotification(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	notificationID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid notification ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	notification, err := h.notificationUsecase.GetNotification(r.Context(), notificationID)
	if err != nil {
		if errors.Is(err, domain.ErrNotificationNotFound) {
			h.logger.Warnf("Notification not found by ID: %s", notificationID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting notification by ID: %s", notificationID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for notification ID: %s", notificationID)
	respondJSON(w, http.StatusOK, mapToNotificationResponse(notification))
}

func (h *NotificationHandler) GetNotificationByUser(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "user_id")
	userID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event user ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	notifications, err := h.notificationUsecase.GetNotificationsByUser(r.Context(), userID)
	if err != nil {
		if errors.Is(err, domain.ErrNotificationsNotFound) {
			h.logger.Warnf("No notifications found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all notifications from user: %s", userID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.NotificationResponse, len(notifications))
	for i, notification := range notifications {
		response[i] = mapToNotificationResponse(notification)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d notifications", len(notifications))
	respondJSON(w, http.StatusOK, response)
}

func (h *NotificationHandler) UpdateNotification(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	notificationID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid notification ID format in URL for update: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var input dtos.UpdateNotificationRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode update notification input for ID: %s", notificationID)
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for update notification input for ID: %s", notificationID)
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	notification, err := h.notificationUsecase.UpdateNotification(r.Context(), notificationID, input)
	if err != nil {
		if errors.Is(err, domain.ErrNotificationNotFound) {
			h.logger.Warnf("Notification not found for update, ID: %s", notificationID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}

		h.logger.Errorf(err, "Internal error during update for notification ID: %s", notificationID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for updated notification ID: %s", notificationID)
	respondJSON(w, http.StatusOK, mapToNotificationResponse(notification))
}

func (h *NotificationHandler) DeleteNotification(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	notificationID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid notification ID format in URL for deletion: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	err = h.notificationUsecase.DeleteNotification(r.Context(), notificationID)
	if err != nil {
		if errors.Is(err, domain.ErrNotificationNotFound) {
			h.logger.Warnf("Notification not found for deletion, ID: %s", notificationID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during deletion for notification ID: %s", notificationID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 204 No Content for deleted notification ID: %s", notificationID)
	w.WriteHeader(http.StatusNoContent)
}
