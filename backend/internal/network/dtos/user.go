package dtos

import (
	"time"

	"github.com/google/uuid"
)

type RegisterInput struct {
	Email           string    `json:"email" validate:"required,email"`
	Password        string    `json:"password" validate:"required,min=8"`
	FullName        string    `json:"full_name" validate:"required,min=2"`
	BirthDate       time.Time `json:"birth_date" validate:"required"`
	Country         string    `json:"country" validate:"required"`
	JobField        string    `json:"job_field" validate:"required"`
	UserDescription string    `json:"user_description"`
	VKLink          string    `json:"vk_link" validate:"omitempty"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserResponse struct {
	ID              uuid.UUID `json:"id"`
	Email           string    `json:"email"`
	FullName        string    `json:"full_name"`
	Role            string    `json:"role"`
	BirthDate       time.Time `json:"birth_date"`
	Country         string    `json:"country"`
	JobField        string    `json:"job_field"`
	UserDescription string    `json:"user_description"`
	VKLink          string    `json:"vk_link"`
	CreatedAt       time.Time `json:"created_at"`
}

type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

type UpdateUserInfoRequest struct {
	Email           *string    `json:"email,omitempty" validate:"omitempty,email"`
	FullName        *string    `json:"full_name,omitempty" validate:"omitempty,min=2"`
	BirthDate       *time.Time `json:"birth_date,omitempty"`
	Country         *string    `json:"country,omitempty"`
	JobField        *string    `json:"job_field,omitempty"`
	UserDescription *string    `json:"user_description,omitempty"`
	VKLink          *string    `json:"vk_link,omitempty" validate:"omitempty,url"`
}

type UpdateUserPasswordRequest struct {
	OldPassword *string `json:"old_password" validate:"required"`
	NewPassword *string `json:"new_password" validate:"required,min=8"`
}
