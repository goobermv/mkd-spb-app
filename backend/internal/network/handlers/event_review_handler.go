package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/network/dtos"
	usecase "github.com/goobermv/mkd-spb-app/internal/usecases"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/google/uuid"
)

type EventReviewHandler struct {
	eventReviewUsecase usecase.EventReviewUsecase
	logger             logger.Logger
	validator          *validator.Validate
}

func NewEventReviewHandler(eventReviewUseCase usecase.EventReviewUsecase, logger logger.Logger, validator *validator.Validate) *EventReviewHandler {
	return &EventReviewHandler{
		eventReviewUsecase: eventReviewUseCase,
		logger:             logger,
		validator:          validator,
	}
}

func mapToEventReviewResponse(eventReview *domain.EventReview) dtos.EventReviewResponse {
	return dtos.EventReviewResponse{
		ID:          eventReview.ID,
		AuthorID:    eventReview.AuthorID,
		EventID:     eventReview.EventID,
		EventRating: eventReview.EventRating,
		ReviewText:  eventReview.ReviewText,
		Date:        eventReview.Date,
	}
}

func (h *EventReviewHandler) CreateEventReview(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	var input dtos.CreateEventReviewInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode event review creation input")
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for event review creation input")
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	eventReview, err := h.eventReviewUsecase.CreateEventReview(r.Context(), input)
	if err != nil {
		h.logger.Errorf(err, "Internal error during event review creation for user: %s", input.AuthorID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 201 Created for event review: %s", eventReview.ID)
	respondJSON(w, http.StatusCreated, mapToEventReviewResponse(eventReview))
}

func (h *EventReviewHandler) GetEventReview(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	eventReviewID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event review ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	eventReview, err := h.eventReviewUsecase.GetEventReview(r.Context(), eventReviewID)
	if err != nil {
		if errors.Is(err, domain.ErrEventReviewNotFound) {
			h.logger.Warnf("Event review not found by ID: %s", eventReviewID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting event review by ID: %s", eventReviewID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for event review ID: %s", eventReviewID)
	respondJSON(w, http.StatusOK, mapToEventReviewResponse(eventReview))
}

func (h *EventReviewHandler) GetEventReviewsByEvent(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "event_id")
	eventID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event review event ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	eventReviews, err := h.eventReviewUsecase.GetEventReviewsByEvent(r.Context(), eventID)
	if err != nil {
		if errors.Is(err, domain.ErrEventReviewsNotFound) {
			h.logger.Warnf("No event reviews found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all event reviews from event: %s", eventID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.EventReviewResponse, len(eventReviews))
	for i, eventReview := range eventReviews {
		response[i] = mapToEventReviewResponse(eventReview)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d event reviews", len(eventReviews))
	respondJSON(w, http.StatusOK, response)
}

func (h *EventReviewHandler) UpdateEventReview(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	eventReviewID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event review ID format in URL for update: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var input dtos.UpdateEventReviewRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode update event review input for ID: %s", eventReviewID)
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for update event review input for ID: %s", eventReviewID)
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	eventReview, err := h.eventReviewUsecase.UpdateEventReview(r.Context(), eventReviewID, input)
	if err != nil {
		if errors.Is(err, domain.ErrEventReviewNotFound) {
			h.logger.Warnf("Event review not found for update, ID: %s", eventReviewID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}

		h.logger.Errorf(err, "Internal error during update for event review ID: %s", eventReviewID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for updated event review ID: %s", eventReviewID)
	respondJSON(w, http.StatusOK, mapToEventReviewResponse(eventReview))
}

func (h *EventReviewHandler) DeleteEventReview(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	eventReviewID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid event review ID format in URL for deletion: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	err = h.eventReviewUsecase.DeleteEventReview(r.Context(), eventReviewID)
	if err != nil {
		if errors.Is(err, domain.ErrEventReviewNotFound) {
			h.logger.Warnf("Event Review not found for deletion, ID: %s", eventReviewID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during deletion for event review ID: %s", eventReviewID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 204 No Content for deleted event review ID: %s", eventReviewID)
	w.WriteHeader(http.StatusNoContent)
}
