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

type ApplicationHandler struct {
	applicationUsecase usecase.ApplicationUsecase
	logger             logger.Logger
	validator          *validator.Validate
}

func NewApplicationHandler(applicationUseCase usecase.ApplicationUsecase, logger logger.Logger, validator *validator.Validate) *ApplicationHandler {
	return &ApplicationHandler{
		applicationUsecase: applicationUseCase,
		logger:             logger,
		validator:          validator,
	}
}

func mapToApplicationResponse(application *domain.Application) dtos.ApplicationResponse {
	return dtos.ApplicationResponse{
		ID:                        application.ID,
		UserID:                    application.UserID,
		UserMotivationDescription: application.UserMotivationDescription,
		Status:                    application.Status,
		CreatedAt:                 application.CreatedAt,
		UpdatedAt:                 application.UpdatedAt,
	}
}

func (h *ApplicationHandler) CreateApplication(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	var input dtos.ApplicationCreationInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode creation input")
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for creation input")
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	application, err := h.applicationUsecase.CreateApplication(r.Context(), input)
	if err != nil {
		h.logger.Errorf(err, "Internal error during application creation for user: %s", input.UserID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 201 Created for application: %s", application.ID)
	respondJSON(w, http.StatusCreated, mapToApplicationResponse(application))
}

func (h *ApplicationHandler) GetApplication(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	applicationID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid application ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	application, err := h.applicationUsecase.GetApplication(r.Context(), applicationID)
	if err != nil {
		if errors.Is(err, domain.ErrApplicationNotFound) {
			h.logger.Warnf("Application not found by ID: %s", applicationID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting application by ID: %s", applicationID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for application ID: %s", applicationID)
	respondJSON(w, http.StatusOK, mapToApplicationResponse(application))
}

func (h *ApplicationHandler) GetApplicationByDate(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	date := r.URL.Query().Get("date")
	if date == "" {
		h.logger.Warnf("Get application by date failed: date query parameter is missing")
		respondError(w, http.StatusBadRequest, "Date parameter is required")
		return
	}

	parsedDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		h.logger.Errorf(err, "Invalid date format provided: %s", date)
		respondError(w, http.StatusBadRequest, "Invalid date format. Use YYYY-MM-DD")
		return
	}

	applications, err := h.applicationUsecase.GetApplicationsByDate(r.Context(), parsedDate)
	if err != nil {
		if errors.Is(err, domain.ErrApplicationsNotFound) {
			h.logger.Warnf("No applications found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all applications from the date: %s", date)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.ApplicationResponse, len(applications))
	for i, application := range applications {
		response[i] = mapToApplicationResponse(application)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d applications", len(applications))
	respondJSON(w, http.StatusOK, response)

}

func (h *ApplicationHandler) GetApplicationByUser(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "user_id")
	userID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid application user ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	applications, err := h.applicationUsecase.GetApplicationsByUser(r.Context(), userID)
	if err != nil {
		if errors.Is(err, domain.ErrApplicationsNotFound) {
			h.logger.Warnf("No applications found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all applications from user: %s", userID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.ApplicationResponse, len(applications))
	for i, application := range applications {
		response[i] = mapToApplicationResponse(application)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d applications", len(applications))
	respondJSON(w, http.StatusOK, response)
}

func (h *ApplicationHandler) UpdateApplication(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	applicationID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid application ID format in URL for update: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var input dtos.UpdateApplicationRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode update application input for ID: %s", applicationID)
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for update application input for ID: %s", applicationID)
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	application, err := h.applicationUsecase.UpdateApplication(r.Context(), applicationID, input)
	if err != nil {
		if errors.Is(err, domain.ErrApplicationNotFound) {
			h.logger.Warnf("Application not found for update, ID: %s", applicationID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}

		h.logger.Errorf(err, "Internal error during update for application ID: %s", applicationID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for updated application ID: %s", applicationID)
	respondJSON(w, http.StatusOK, mapToApplicationResponse(application))
}

func (h *ApplicationHandler) DeleteApplication(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	applicationID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid application ID format in URL for deletion: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	err = h.applicationUsecase.DeleteApplication(r.Context(), applicationID)
	if err != nil {
		if errors.Is(err, domain.ErrApplicationNotFound) {
			h.logger.Warnf("Application not found for deletion, ID: %s", applicationID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during deletion for application ID: %s", applicationID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 204 No Content for deleted application ID: %s", applicationID)
	w.WriteHeader(http.StatusNoContent)
}

func (h *ApplicationHandler) GetAllApplications(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	applications, err := h.applicationUsecase.GetAllApplications(r.Context())
	if err != nil {
		if errors.Is(err, domain.ErrApplicationsNotFound) {
			h.logger.Warnf("No applications found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all applications")
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.ApplicationResponse, len(applications))
	for i, application := range applications {
		response[i] = mapToApplicationResponse(application)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d applications", len(applications))
	respondJSON(w, http.StatusOK, response)
}
