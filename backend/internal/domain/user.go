package domain

import (
	"time"

	"github.com/google/uuid"
)

const (
	UserRoleRegular  = "Regular"  // Пользователь
	UserRoleActivist = "Activist" // Активист
	UserRoleAdmin    = "Admin"    // Админ
)

type User struct {
	ID              uuid.UUID
	Email           string
	PasswordHash    string
	FullName        string
	BirthDate       time.Time
	Country         string
	JobField        string
	UserDescription string
	VKLink          string
	UserRole        string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// user profile picture will probably go in the infrastructure layer
