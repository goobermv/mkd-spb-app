package domain

import (
	"time"

	"github.com/google/uuid"
)

const (
	NewsBlockCategoryPublicAdministration                   = "Public administration"                       // Государственное управление
	NewsBlockCategoryMedia                                  = "Media"                                       // Медиа
	NewsBlockCategoryScienceAndEducation                    = "Science and education"                       // Наука и образование
	NewsBlockCategoryEntrepreneurship                       = "Entrepreneurship"                            // Предпринимательство
	NewsBlockCategoryDigitalizationAndIT                    = "Digitalization and IT"                       // Цифровизация и IT
	NewsBlockCategoryCreativeIndustriesCultureAndCreativity = "Creative industries, culture and creativity" // Креативные индустрии, культура и творчество
	NewsBlockCategoryCivicEngagement                        = "Civic engagement"                            // Гражданская активность
	NewsBlockCategorySportsAndHealth                        = "Sports and health"                           // Спорт и здоровье
)

const (
	NewsBlockPublicationStatusUndergoingModeration = "Undergoing moderation" // Проходит модерацию
	NewsBlockPublicationStatusPublished            = "Published"             // Опубликовано
	NewsBlockPublicationStatusDeclined             = "Declined"              // Откленен
)

type NewsBlock struct {
	ID                uuid.UUID
	AuthorID          uuid.UUID
	Title             string
	Description       string
	NewsBlockCategory string
	PublicationDate   time.Time // надо подумать нужно ли это поле если есть CreatedAt
	PublicationStatus string
	NewsBlockPicture  string
	CreatedAt         time.Time
	UpdatedAt         time.Time
}
