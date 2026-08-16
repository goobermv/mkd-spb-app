package domain

import (
	"time"

	"github.com/google/uuid"
)

const (
	EventStatusInModeration = "In moderation" // В модерации
	EventStatusPublished    = "Published"     // Опубликовано
	EventStatusArchived     = "Archived"      // Архивировано
)

const (
	EventCategoryPublicAdministration                   = "Public administration"                       // Государственное управление
	EventCategoryMedia                                  = "Media"                                       // Медиа
	EventCategoryScienceAndEducation                    = "Science and education"                       // Наука и образование
	EventCategoryEntrepreneurship                       = "Entrepreneurship"                            // Предпринимательство
	EventCategoryDigitalizationAndIT                    = "Digitalization and IT"                       // Цифровизация и IT
	EventCategoryCreativeIndustriesCultureAndCreativity = "Creative industries, culture and creativity" // Креативные индустрии, культура и творчество
	EventCategoryCivicEngagement                        = "Civic engagement"                            // Гражданская активность
	EventCategorySportsAndHealth                        = "Sports and health"                           // Спорт и здоровье
)

type Event struct {
	ID               uuid.UUID
	AuthorID         uuid.UUID
	EventName        string
	Description      string
	Status           string
	EventCategory    string
	EventDateAndTime time.Time
	EventPicture     string
	CreatedAt        time.Time
	UpdatedAt        time.Time
}
