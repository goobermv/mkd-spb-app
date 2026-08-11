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

type EventRegistrationHandler struct {
	eventRegistrationUsecase usecase.EventRegistrationUsecase
	logger                   logger.Logger
	validator                *validator.Validate
}

func NewEventRegistrationHandler(eventRegistrationUseCase usecase.EventRegistrationUsecase, logger logger.Logger, validator *validator.Validate) *EventRegistrationHandler {
	return &EventRegistrationHandler{
		eventRegistrationUsecase: eventRegistrationUseCase,
		logger:                   logger,
		validator:                validator,
	}
}

func mapToEventRegistrationResponse(eventRegistration *domain.EventRegistration) dtos.EventRegistrationResponse {
	return dtos.EventRegistrationResponse{
		ID:                 eventRegistration.ID,
		UserID:             eventRegistration.UserID,
		EventID:            eventRegistration.EventID,
		RegistrationStatus: eventRegistration.RegistrationStatus,
		RegistrationDate:   eventRegistration.RegistrationDate,
	}
}

func (h *EventRegistrationHandler) CreateEventRegistration(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	var input dtos.CreateRegistrationRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode event registration creation input")
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for event registration creation input")
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	eventRegistration, err := h.eventRegistrationUsecase.CreateEventRegistration(r.Context(), input)
	if err != nil {
		h.logger.Errorf(err, "Internal error during event registration creation for user: %s", input.UserID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 201 Created for event registration: %s", eventRegistration.ID)
	respondJSON(w, http.StatusCreated, mapToEventRegistrationResponse(eventRegistration))
}

func (h *EventRegistrationHandler) GetEventRegistration(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	eventRegistrationID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event registration ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	eventRegistration, err := h.eventRegistrationUsecase.GetEventRegistration(r.Context(), eventRegistrationID)
	if err != nil {
		if errors.Is(err, domain.ErrEventReviewNotFound) {
			h.logger.Warnf("Event registration not found by ID: %s", eventRegistrationID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting event registration by ID: %s", eventRegistrationID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for event registration ID: %s", eventRegistrationID)
	respondJSON(w, http.StatusOK, mapToEventRegistrationResponse(eventRegistration))
}

func (h *EventRegistrationHandler) GetEventRegistrationByEvent(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "event_id")
	eventID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event registration event ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	eventRegistrations, err := h.eventRegistrationUsecase.GetEventRegistrationsByEvent(r.Context(), eventID)
	if err != nil {
		if errors.Is(err, domain.ErrEventRegistrationNotFound) {
			h.logger.Warnf("No event registrations found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all event registrations from event: %s", eventID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.EventRegistrationResponse, len(eventRegistrations))
	for i, eventRegistration := range eventRegistrations {
		response[i] = mapToEventRegistrationResponse(eventRegistration)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d event registrations", len(eventRegistrations))
	respondJSON(w, http.StatusOK, response)
}

func (h *EventRegistrationHandler) GetEventRegistrationsByUser(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "user_id")
	userID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event registration user ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	eventRegistrations, err := h.eventRegistrationUsecase.GetEventRegistrationsByUser(r.Context(), userID)
	if err != nil {
		if errors.Is(err, domain.ErrEventRegistrationsNotFound) {
			h.logger.Warnf("No event registrations found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all event registrations from user: %s", userID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.EventRegistrationResponse, len(eventRegistrations))
	for i, eventRegistration := range eventRegistrations {
		response[i] = mapToEventRegistrationResponse(eventRegistration)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d event registrations", len(eventRegistrations))
	respondJSON(w, http.StatusOK, response)
}

func (h *EventRegistrationHandler) UpdateEventRegistration(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	eventRegistrationID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event registration ID format in URL for update: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var input dtos.UpdateRegistrationRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode update event registration input for ID: %s", eventRegistrationID)
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for update event registration input for ID: %s", eventRegistrationID)
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	eventRegistration, err := h.eventRegistrationUsecase.UpdateEventRegistration(r.Context(), eventRegistrationID, input)
	if err != nil {
		if errors.Is(err, domain.ErrEventRegistrationNotFound) {
			h.logger.Warnf("Event registration not found for update, ID: %s", eventRegistrationID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}

		h.logger.Errorf(err, "Internal error during update for event registration ID: %s", eventRegistrationID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for updated event registration ID: %s", eventRegistrationID)
	respondJSON(w, http.StatusOK, mapToEventRegistrationResponse(eventRegistration))
}

func (h *EventRegistrationHandler) DeleteEventRegistration(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	eventRegistrationID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event registration ID format in URL for deletion: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	err = h.eventRegistrationUsecase.DeleteEventRegistration(r.Context(), eventRegistrationID)
	if err != nil {
		if errors.Is(err, domain.ErrEventRegistrationNotFound) {
			h.logger.Warnf("Event Registration not found for deletion, ID: %s", eventRegistrationID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during deletion for event registration ID: %s", eventRegistrationID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 204 No Content for deleted event registration ID: %s", eventRegistrationID)
	w.WriteHeader(http.StatusNoContent)
}
