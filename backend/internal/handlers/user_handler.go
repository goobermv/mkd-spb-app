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

type UserHandler struct {
	userUsecase usecase.UserUsecase
	logger      logger.Logger
	validator   *validator.Validate
}

func NewUserHandler(userUsecase usecase.UserUsecase, logger logger.Logger, validator *validator.Validate) *UserHandler {
	return &UserHandler{
		userUsecase: userUsecase,
		logger:      logger,
		validator:   validator,
	}
}

func mapToUserResponse(userUsecase *domain.User) dtos.UserResponse {
	return dtos.UserResponse{
		ID:              userUsecase.ID,
		Email:           userUsecase.Email,
		FullName:        userUsecase.FullName,
		Role:            userUsecase.UserRole,
		BirthDate:       userUsecase.BirthDate,
		Country:         userUsecase.Country,
		JobField:        userUsecase.JobField,
		UserDescription: userUsecase.UserDescription,
		VKLink:          userUsecase.VKLink,
		CreatedAt:       userUsecase.CreatedAt,
	}
}

func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	var input dtos.RegisterInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode register input")
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for register input")
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	user, err := h.userUsecase.Register(r.Context(), input)
	if err != nil {
		if errors.Is(err, domain.ErrUserAlreadyExists) {
			h.logger.Warnf("Registration conflict: user already exists - %s", input.Email)
			respondError(w, http.StatusConflict, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during registration for email: %s", input.Email)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 201 Created for user: %s", user.ID)
	respondJSON(w, http.StatusCreated, mapToUserResponse(user))
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	var input dtos.LoginInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode login input")
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for login input")
		respondError(w, http.StatusBadRequest, "Validation error")
		return
	}

	token, user, err := h.userUsecase.Login(r.Context(), input)
	if err != nil {
		if errors.Is(err, domain.ErrInvalidCredentials) {
			h.logger.Warnf("Login failed: invalid credentials for email - %s", input.Email)
			respondError(w, http.StatusUnauthorized, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during login for email: %s", input.Email)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	authResp := dtos.AuthResponse{
		Token: token,
		User:  mapToUserResponse(user),
	}

	h.logger.Successf("HTTP response 200 OK for login, user ID: %s", user.ID)
	respondJSON(w, http.StatusOK, authResp)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	userID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid user ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	user, err := h.userUsecase.GetUser(r.Context(), userID)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			h.logger.Warnf("User not found by ID: %s", userID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting user by ID: %s", userID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for user ID: %s", userID)
	respondJSON(w, http.StatusOK, mapToUserResponse(user))
}

func (h *UserHandler) GetUserByName(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	name := r.URL.Query().Get("name")
	if name == "" {
		h.logger.Warnf("Get user by name failed: name query parameter is missing")
		respondError(w, http.StatusBadRequest, "Name parameter is required")
		return
	}

	user, err := h.userUsecase.GetUserByName(r.Context(), name)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			h.logger.Warnf("User not found by name: %s", name)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting user by name: %s", name)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for user name: %s", name)
	respondJSON(w, http.StatusOK, mapToUserResponse(user))
}

func (h *UserHandler) GetUserByEmail(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	email := r.URL.Query().Get("email")
	if email == "" {
		h.logger.Warnf("Get user by email failed: email query parameter is missing")
		respondError(w, http.StatusBadRequest, "Email parameter is required")
		return
	}

	user, err := h.userUsecase.GetUserByEmail(r.Context(), email)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			h.logger.Warnf("User not found by email: %s", email)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting user by email: %s", email)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for user email: %s", email)
	respondJSON(w, http.StatusOK, mapToUserResponse(user))
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	userID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid user ID format in URL for update: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var input dtos.UpdateUserInfoRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode update user input for ID: %s", userID)
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for update user input for ID: %s", userID)
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	user, err := h.userUsecase.UpdateUser(r.Context(), userID, input)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			h.logger.Warnf("User not found for update, ID: %s", userID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		if errors.Is(err, domain.ErrEmailExists) {
			h.logger.Warnf("Update conflict: email already exists for ID: %s", userID)
			respondError(w, http.StatusConflict, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during update for user ID: %s", userID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for updated user ID: %s", userID)
	respondJSON(w, http.StatusOK, mapToUserResponse(user))
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	userID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid user ID format in URL for deletion: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	err = h.userUsecase.DeleteUser(r.Context(), userID)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			h.logger.Warnf("User not found for deletion, ID: %s", userID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during deletion for user ID: %s", userID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 204 No Content for deleted user ID: %s", userID)
	w.WriteHeader(http.StatusNoContent)
}

func (h *UserHandler) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	users, err := h.userUsecase.GetAllUsers(r.Context())
	if err != nil {
		if errors.Is(err, domain.ErrUsersNotFound) {
			h.logger.Warnf("No users found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all users")
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.UserResponse, len(users))
	for i, user := range users {
		response[i] = mapToUserResponse(user)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d users", len(users))
	respondJSON(w, http.StatusOK, response)
}
