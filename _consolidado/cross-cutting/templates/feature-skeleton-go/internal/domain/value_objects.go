// Package domain — Value Objects
// ADR-027: Multi-language feature-skeleton (Go variant)
package domain

import (
	"errors"
	"fmt"
)

// FeatureIdentifier — Value object for feature identification
type FeatureIdentifier struct {
	value string
}

var (
	ErrInvalidFeatureID = errors.New("invalid feature identifier: must be non-empty alphanumeric with hyphens")
)

func NewFeatureIdentifier(value string) (FeatureIdentifier, error) {
	if value == "" {
		return FeatureIdentifier{}, ErrInvalidFeatureID
	}
	// Simple validation: alphanumeric + hyphens
	for _, r := range value {
		if !((r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '-') {
			return FeatureIdentifier{}, ErrInvalidFeatureID
		}
	}
	return FeatureIdentifier{value: value}, nil
}

func (f FeatureIdentifier) String() string {
	return f.value
}

func (f FeatureIdentifier) Equals(other FeatureIdentifier) bool {
	return f.value == other.value
}

// FeatureName — Value object for feature name
type FeatureName struct {
	value string
}

var ErrInvalidFeatureName = errors.New("invalid feature name: must be 1-100 chars")

func NewFeatureName(value string) (FeatureName, error) {
	if len(value) < 1 || len(value) > 100 {
		return FeatureName{}, ErrInvalidFeatureName
	}
	return FeatureName{value: value}, nil
}

func (f FeatureName) String() string {
	return f.value
}

func (f FeatureName) MarshalJSON() ([]byte, error) {
	return []byte(fmt.Sprintf("%q", f.value)), nil
}