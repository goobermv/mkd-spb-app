package hash

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type PasswordHasher struct{}

func NewPasswordHasher() *PasswordHasher {
	return &PasswordHasher{}
}

func (s *PasswordHasher) Hash(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hashedBytes), nil
}

func (s *PasswordHasher) Verify(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
