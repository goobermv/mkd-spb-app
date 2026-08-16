package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-playground/validator/v10"
	_ "github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	router "github.com/goobermv/mkd-spb-app/internal/network"
	"github.com/goobermv/mkd-spb-app/internal/network/handlers"
	"github.com/goobermv/mkd-spb-app/internal/network/middleware"

	"github.com/goobermv/mkd-spb-app/internal/repositories/postgres"
	usecase "github.com/goobermv/mkd-spb-app/internal/usecases"

	"github.com/goobermv/mkd-spb-app/pkg/hash"
	"github.com/goobermv/mkd-spb-app/pkg/logger"
	"github.com/goobermv/mkd-spb-app/pkg/token"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://user:password@localhost:5432/mkd_spb?sslmode=disable"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "super_secret_key_for_development"
	}

	ctx := context.Background()

	dbPool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer dbPool.Close()

	if err := dbPool.Ping(ctx); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}
	log.Println("Successfully connected to the database!")

	jwtManager := token.NewJWTManager(jwtSecret, 72*time.Hour)
	passwordHasher := hash.NewPasswordHasher()
	appLogger := logger.NewLogger("API")
	appValidator := validator.New(validator.WithRequiredStructEnabled())

	userRepo := postgres.NewUserRepository(dbPool)
	applicationRepo := postgres.NewApplicationRepository(dbPool)
	eventRepo := postgres.NewEventRepository(dbPool)
	eventRegistrationRepo := postgres.NewEventRegistrationRepository(dbPool)
	eventReviewRepo := postgres.NewEventReviewRepository(dbPool)
	newsBlockRepo := postgres.NewNewsBlockRepository(dbPool)
	notificationRepo := postgres.NewNotificationRepository(dbPool)

	userUsecase := usecase.NewUserUsecase(userRepo, passwordHasher, jwtManager, appLogger)
	applicationUsecase := usecase.NewApplicationUsecase(applicationRepo, appLogger)
	eventUsecase := usecase.NewEventUsecase(eventRepo, appLogger)
	eventRegistrationUsecase := usecase.NewEventRegistrationUsecase(eventRegistrationRepo, appLogger)
	eventReviewUsecase := usecase.NewEventReviewUsecase(eventReviewRepo, appLogger)
	newsBlockUsecase := usecase.NewNewsBlockUsecase(newsBlockRepo, appLogger)
	notificationUsecase := usecase.NewNotificationUsecase(notificationRepo, appLogger)

	userHandler := handlers.NewUserHandler(userUsecase, appLogger, appValidator)
	applicationHandler := handlers.NewApplicationHandler(applicationUsecase, appLogger, appValidator)
	eventHandler := handlers.NewEventHandler(eventUsecase, appLogger, appValidator)
	eventRegistrationHandler := handlers.NewEventRegistrationHandler(eventRegistrationUsecase, appLogger, appValidator)
	eventReviewHandler := handlers.NewEventReviewHandler(eventReviewUsecase, appLogger, appValidator)
	newsBlockHandler := handlers.NewNewsBlockHandler(newsBlockUsecase, appLogger, appValidator)
	notificationHandler := handlers.NewNotificationHandler(notificationUsecase, appLogger, appValidator)

	authMiddleware := middleware.NewAuthMiddleware(jwtManager)

	r := router.NewRouter(
		userHandler,
		applicationHandler,
		eventHandler,
		eventRegistrationHandler,
		eventReviewHandler,
		newsBlockHandler,
		notificationHandler,
		authMiddleware,
	)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("Server starting on port %s...", port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server failed to start: %v", err)
	}
}
