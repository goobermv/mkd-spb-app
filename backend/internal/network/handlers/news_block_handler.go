package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/network/dtos"
	usecase "github.com/goobermv/mkd-spb-app/internal/usecases"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/google/uuid"
)

type NewsBlockHandler struct {
	newsBlockUsecase usecase.NewsBlockUsecase
	logger           logger.Logger
	validator        *validator.Validate
}

func NewNewsBlockHandler(newsBlockUseCase usecase.NewsBlockUsecase, logger logger.Logger, validator *validator.Validate) *NewsBlockHandler {
	return &NewsBlockHandler{
		newsBlockUsecase: newsBlockUseCase,
		logger:           logger,
		validator:        validator,
	}
}

func mapToNewsBlockResponse(newsBlock *domain.NewsBlock) dtos.NewsBlockResponse {
	return dtos.NewsBlockResponse{
		ID:                newsBlock.ID,
		AuthorID:          newsBlock.AuthorID,
		Title:             newsBlock.Title,
		Description:       newsBlock.Description,
		NewsBlockCategory: newsBlock.NewsBlockCategory,
		PublicationDate:   newsBlock.PublicationDate,
		PublicationStatus: newsBlock.PublicationStatus,
		NewsBlockPicture:  newsBlock.NewsBlockPicture,
		CreatedAt:         newsBlock.CreatedAt,
		UpdatedAt:         newsBlock.UpdatedAt,
	}
}

func (h *NewsBlockHandler) CreateNewsBlock(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	var input dtos.CreateNewsBlockInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode news block creation input")
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for news block creation input")
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	newsBlock, err := h.newsBlockUsecase.CreateNewsBlock(r.Context(), input)
	if err != nil {
		h.logger.Errorf(err, "Internal error during news block creation by user: %s", input.AuthorID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 201 Created for news block: %s", newsBlock.ID)
	respondJSON(w, http.StatusCreated, mapToNewsBlockResponse(newsBlock))
}

func (h *NewsBlockHandler) GetNewsBlock(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	newsBlockID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid news block ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	newsBlock, err := h.newsBlockUsecase.GetNewsBlock(r.Context(), newsBlockID)
	if err != nil {
		if errors.Is(err, domain.ErrNewsBlockNotFound) {
			h.logger.Warnf("News block not found by ID: %s", newsBlockID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting news block by ID: %s", newsBlockID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for news block ID: %s", newsBlockID)
	respondJSON(w, http.StatusOK, mapToNewsBlockResponse(newsBlock))
}

func (h *NewsBlockHandler) GetNewsBlockByTitle(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	title := r.URL.Query().Get("title")
	if title == "" {
		h.logger.Warnf("Get news block by title failed: title query parameter is missing")
		respondError(w, http.StatusBadRequest, "Title parameter is required")
		return
	}

	newsBlock, err := h.newsBlockUsecase.GetNewsBlockByTitle(r.Context(), title)
	if err != nil {
		if errors.Is(err, domain.ErrNewsBlockNotFound) {
			h.logger.Warnf("News block not found by title: %s", title)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when getting news block by title: %s", title)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for news block title: %s", title)
	respondJSON(w, http.StatusOK, mapToNewsBlockResponse(newsBlock))
}

func (h *NewsBlockHandler) GetNewsBlocksByDate(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	date := r.URL.Query().Get("date")
	if date == "" {
		h.logger.Warnf("Get news block by date failed: date query parameter is missing")
		respondError(w, http.StatusBadRequest, "Date parameter is required")
		return
	}

	parsedDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		h.logger.Errorf(err, "Invalid date format provided: %s", date)
		respondError(w, http.StatusBadRequest, "Invalid date format. Use YYYY-MM-DD")
		return
	}

	newsBlocks, err := h.newsBlockUsecase.GetNewsBlocksByDate(r.Context(), parsedDate)
	if err != nil {
		if errors.Is(err, domain.ErrNewsBlocksNotFound) {
			h.logger.Warnf("No news blocks found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all news blocks from the date: %s", date)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.NewsBlockResponse, len(newsBlocks))
	for i, newsBlock := range newsBlocks {
		response[i] = mapToNewsBlockResponse(newsBlock)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d news blocks", len(newsBlocks))
	respondJSON(w, http.StatusOK, response)
}

func (h *NewsBlockHandler) GetNewsBlocksByAuthor(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "author_id")
	authorID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid news block author ID format in URL: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	newsBlocks, err := h.newsBlockUsecase.GetNewsBlocksByAuthor(r.Context(), authorID)
	if err != nil {
		if errors.Is(err, domain.ErrNewsBlocksNotFound) {
			h.logger.Warnf("No news blocks found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all news blocks from author: %s", authorID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.NewsBlockResponse, len(newsBlocks))
	for i, newsBlock := range newsBlocks {
		response[i] = mapToNewsBlockResponse(newsBlock)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d news blocks", len(newsBlocks))
	respondJSON(w, http.StatusOK, response)
}

func (h *NewsBlockHandler) UpdateNewsBlock(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	newsBlockID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid news block ID format in URL for update: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var input dtos.UpdateNewsBlockRequest
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.logger.Errorf(err, "Failed to decode update news block input for ID: %s", newsBlockID)
		respondError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	if err := h.validator.Struct(input); err != nil {
		h.logger.Errorf(err, "Validation failed for update news block input for ID: %s", newsBlockID)
		respondError(w, http.StatusBadRequest, "Validation error: "+err.Error())
		return
	}

	newsBlock, err := h.newsBlockUsecase.UpdateNewsBlock(r.Context(), newsBlockID, input)
	if err != nil {
		if errors.Is(err, domain.ErrNewsBlockNotFound) {
			h.logger.Warnf("News block not found for update, ID: %s", newsBlockID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}

		h.logger.Errorf(err, "Internal error during update for news block ID: %s", newsBlockID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 200 OK for updated news block ID: %s", newsBlockID)
	respondJSON(w, http.StatusOK, mapToNewsBlockResponse(newsBlock))
}

func (h *NewsBlockHandler) DeleteNewsBlock(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	idStr := chi.URLParam(r, "id")
	newsBlockID, err := uuid.Parse(idStr)
	if err != nil {
		h.logger.Errorf(err, "Invalid news block ID format in URL for deletion: %s", idStr)
		respondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	err = h.newsBlockUsecase.DeleteNewsBlock(r.Context(), newsBlockID)
	if err != nil {
		if errors.Is(err, domain.ErrNewsBlockNotFound) {
			h.logger.Warnf("News block not found for deletion, ID: %s", newsBlockID)
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error during deletion for news block ID: %s", newsBlockID)
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	h.logger.Successf("HTTP response 204 No Content for deleted news block ID: %s", newsBlockID)
	w.WriteHeader(http.StatusNoContent)
}

func (h *NewsBlockHandler) GetAllNewsBlocks(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("Incoming HTTP request: %s %s", r.Method, r.URL.Path)

	newsBlocks, err := h.newsBlockUsecase.GetAllNewsBlocks(r.Context())
	if err != nil {
		if errors.Is(err, domain.ErrNewsBlocksNotFound) {
			h.logger.Warnf("No news blocks found")
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		h.logger.Errorf(err, "Internal error when retrieving all newsBlocks")
		respondError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	response := make([]dtos.NewsBlockResponse, len(newsBlocks))
	for i, newsBlock := range newsBlocks {
		response[i] = mapToNewsBlockResponse(newsBlock)
	}

	h.logger.Successf("HTTP response 200 OK: retrieved %d news blocks", len(newsBlocks))
	respondJSON(w, http.StatusOK, response)
}
