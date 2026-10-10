package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"github.com/goobermv/mkd-spb-app/internal/domain"
	"github.com/goobermv/mkd-spb-app/internal/network/handlers"
	customMiddleware "github.com/goobermv/mkd-spb-app/internal/network/middleware"
)

func NewRouter(
	userHandler *handlers.UserHandler,
	applicationHandler *handlers.ApplicationHandler,
	eventHandler *handlers.EventHandler,
	eventRegistrationHandler *handlers.EventRegistrationHandler,
	eventReviewHandler *handlers.EventReviewHandler,
	newsBlockHandler *handlers.NewsBlockHandler,
	notificationHandler *handlers.NotificationHandler,
	authMiddleware *customMiddleware.AuthMiddleware,
) http.Handler {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Route("/api/v1", func(r chi.Router) {

		r.Group(func(r chi.Router) {
			r.Post("/users/register", userHandler.Register)
			r.Post("/users/login", userHandler.Login)

			r.Get("/events", eventHandler.GetAllEvents)
			r.Get("/events/{id}", eventHandler.GetEvent)
			r.Get("/events/name/{name}", eventHandler.GetEventByName)
			r.Get("/events/date/{date}", eventHandler.GetEventsByDate)

			r.Get("/news_blocks/{id}", newsBlockHandler.GetNewsBlock)
			r.Get("/news_blocks/title/{title}", newsBlockHandler.GetNewsBlockByTitle)
			r.Get("/news_blocks/date/{date}", newsBlockHandler.GetNewsBlocksByDate)
			r.Get("/news_blocks", newsBlockHandler.GetAllNewsBlocks)
		})

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.RequireAuth)

			r.Get("/users/me", userHandler.GetMe)
			r.Get("/users/{id}", userHandler.GetUser)
			r.Patch("/users/{id}", userHandler.UpdateUser)
			r.Patch("/users/{id}/password", userHandler.UpdateUserPassword)
			r.Delete("/users/{id}", userHandler.DeleteUser)

			r.Post("/applications", applicationHandler.CreateApplication)
			r.Get("/applications/my", applicationHandler.GetApplicationByUser)
			r.Get("/applications/{id}", applicationHandler.GetApplication)
			r.Patch("/applications/{id}", applicationHandler.UpdateApplication)
			r.Delete("/applications/{id}", applicationHandler.DeleteApplication)

			r.Post("/event_registrations", eventRegistrationHandler.CreateEventRegistration)
			r.Get("/event_registrations/{id}", eventRegistrationHandler.GetEventRegistration)
			r.Get("/event_registrations/user/{user_id}", eventRegistrationHandler.GetEventRegistrationsByUser)
			r.Patch("/event_registrations/{id}", eventRegistrationHandler.UpdateEventRegistration)
			r.Delete("/event_registrations/{id}", eventRegistrationHandler.DeleteEventRegistration)

			r.Post("/event_reviews", eventReviewHandler.CreateEventReview)
			r.Get("/event_reviews/{id}", eventReviewHandler.GetEventReview)
			r.Patch("/event_reviews/{id}", eventReviewHandler.UpdateEventReview)
			r.Delete("/event_reviews/{id}", eventReviewHandler.DeleteEventReview)

			r.Get("/notifications/{id}", notificationHandler.GetNotification)
			r.Get("/notifications/user/{user_id}", notificationHandler.GetNotificationByUser)

			r.Group(func(r chi.Router) {
				r.Use(authMiddleware.RequireRoles(domain.UserRoleActivist, domain.UserRoleAdmin))

				r.Post("/events", eventHandler.CreateEvent)
				r.Get("/events/author/{author_id}", eventHandler.GetByAuthor)
				r.Patch("/events/{id}", eventHandler.UpdateEvent)
				r.Delete("/events/{id}", eventHandler.DeleteEvent)

				r.Get("/event_registrations/event/{event_id}", eventRegistrationHandler.GetEventRegistrationsByEvent)
				r.Get("/event_reviews/event/{event_id}", eventReviewHandler.GetEventReviewsByEvent)

				r.Post("/news_blocks", newsBlockHandler.CreateNewsBlock)
				r.Patch("/news_blocks/{id}", newsBlockHandler.UpdateNewsBlock)

				r.Post("/notifications", notificationHandler.CreateNotification)
				r.Patch("/notifications/{id}", notificationHandler.UpdateNotification)
				r.Delete("/notifications/{id}", notificationHandler.DeleteNotification)
			})

			r.Group(func(r chi.Router) {
				r.Use(authMiddleware.RequireRoles(domain.UserRoleAdmin))

				r.Get("/users/name/{name}", userHandler.GetUserByName)
				r.Get("/users/email/{email}", userHandler.GetUserByEmail)
				r.Get("/users", userHandler.GetAllUsers)
				r.Get("/users/export", userHandler.ExportUsers)
				r.Patch("/users/{id}/role", userHandler.UpdateUserRole)

				r.Get("/applications/date/{date}", applicationHandler.GetApplicationByDate)
				r.Get("/applications", applicationHandler.GetAllApplications)

				r.Get("/news_blocks/author/{author_id}", newsBlockHandler.GetNewsBlocksByAuthor)
				r.Delete("/news_blocks/{id}", newsBlockHandler.DeleteNewsBlock)
			})
		})
	})

	return r
}
