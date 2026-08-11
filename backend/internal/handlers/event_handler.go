package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/handlers/dtos"
	"github.com/goobermv/mkd-spb-app/internal/usecase"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/google/uuid"
)

type EventHandler struct {
	eventUsecase usecase.EventUsecase
	logger       logger.Logger
	validator    *validator.Validate
}

func NewEventHandler(eventUseCase usecase.EventUsecase, logger logger.Logger, validator *validator.Validate) *EventHandler {
	return &EventHandler{
		eventUsecase: eventUseCase,
		logger:       logger,
		validator:    validator,
	}
}

func mapToEventResponse(event *domain.Event) dtos.EventResponse {
	return dtos.EventResponse{
		ID:               event.ID,
		AuthorID:         event.AuthorID,
		EventName:        event.EventName,
		Description:      event.Description,
		Status:           event.Status,
		EventCategory:    event.EventCategory,
		EventDateAndTime: event.EventDateAndTime,
		EventPicture:     event.EventPicture,
		CreatedAt:        event.CreatedAt,
		UpdatedAt:        event.UpdatedAt,
	}
}

func (h *EventHandler) CreateEvent(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	var input dtos.EventCreationInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode event creation input")
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for event creation input")
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	event, err := h.eventUsecase.CreateEvent(r.Context(), input)
	if err != nil {
		h.logger.Errorf(err, "Internal error during event creation by user: %s", input.AuthorID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 201 Created for event: %s", event.ID)
	respondJSON(w, http.StatusCreated, mapToEventResponse(event))
}

func (h *EventHandler) GetEvent(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	eventID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	event, err := h.eventUsecase.GetEvent(r.Context(), eventID)
	if err != nil {
		if errors.Is(err, domain.ErrEventNotFound) {
			h.logger.Warnf("Event not found by ID: %s", eventID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting event by ID: %s", eventID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for event ID: %s", eventID)
	respondJSON(w, http.StatusOK, mapToEventResponse(event))
}

func (h *EventHandler) GetEventByName(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	name := r.URL.Query().Get("name")
	if name == "" {
		h.logger.Warnf("Get event by name failed: name query parameter is missing")
		respondError(w, http.StatusBadRequest, "Name parameter is required")
		return
	}

	event, err := h.eventUsecase.GetEventByName(r.Context(), name)
	if err != nil {
		if errors.Is(err, domain.ErrEventNotFound) {
			h.logger.Warnf("Event not found by name: %s", name)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting event by name: %s", name)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for event name: %s", name)
	respondJSON(w, http.StatusOK, mapToEventResponse(event))
}

func (h *EventHandler) GetEventsByDate(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	date := r.URL.Query().Get("date")
	if date == "" {
		h.logger.Warnf("Get event by date failed: date query parameter is missing")
		respondError(w, http.StatusBadRequest, "Date parameter is required")
		return
	}

	parsedDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		h.logger.Errorf(err, "Invalid date format provided: %s", date)
		respondError(w, http.StatusBadRequest, "Invalid date format. Use YYYY-MM-DD")
		return
	}

	events, err := h.eventUsecase.GetEventsByDate(r.Context(), parsedDate)
	if err != nil {
		if errors.Is(err, domain.ErrEventsNotFound) {
			h.logger.Warnf("No events found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all events from the date: %s", date)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.EventResponse, len(events))
	for i, event := range events {
		response[i] = mapToEventResponse(event)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d events", len(events))
	respondJSON(w, http.StatusOK, response)
}

func (h *EventHandler) GetByAuthor(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "author_id")
	authorID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event author ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	events, err := h.eventUsecase.GetEventsByAuthor(r.Context(), authorID)
	if err != nil {
		if errors.Is(err, domain.ErrEventsNotFound) {
			h.logger.Warnf("No events found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all events from user: %s", authorID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.EventResponse, len(events))
	for i, event := range events {
		response[i] = mapToEventResponse(event)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d events", len(events))
	respondJSON(w, http.StatusOK, response)
}

func (h *EventHandler) UpdateEvent(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	eventID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event ID format in URL for update: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var input dtos.UpdateEventRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode update event input for ID: %s", eventID)
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for update event input for ID: %s", eventID)
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	event, err := h.eventUsecase.UpdateEvent(r.Context(), eventID, input)
	if err != nil {
		if errors.Is(err, domain.ErrEventNotFound) {
			h.logger.Warnf("Event not found for update, ID: %s", eventID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}

		h.logger.Errorf(err, "Internal error during update for event ID: %s", eventID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for updated event ID: %s", eventID)
	respondJSON(w, http.StatusOK, mapToEventResponse(event))
}

func (h *EventHandler) DeleteEvent(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	eventID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event ID format in URL for deletion: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	err = h.eventUsecase.DeleteEvent(r.Context(), eventID)
	if err != nil {
		if errors.Is(err, domain.ErrEventNotFound) {
			h.logger.Warnf("Event not found for deletion, ID: %s", eventID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during deletion for event ID: %s", eventID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 204 No Content for deleted event ID: %s", eventID)
	w.WriteHeader(http.StatusNoContent)
}

func (h *EventHandler) GetAllEvents(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	events, err := h.eventUsecase.GetAllEvents(r.Context())
	if err != nil {
		if errors.Is(err, domain.ErrEventsNotFound) {
			h.logger.Warnf("No events found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all events")
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.EventResponse, len(events))
	for i, event := range events {
		response[i] = mapToEventResponse(event)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d events", len(events))
	respondJSON(w, http.StatusOK, response)
}
