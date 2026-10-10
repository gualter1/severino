// Package infrastructure — Logging (zerolog with PII sanitization)
// ADR-027: Multi-language feature-skeleton (Go variant) + ADR-014 (Logging Sanitization)
package infrastructure

import (
	"io"
	"regexp"
	"strings"

	"github.com/rs/zerolog"
)

var (
	piiPatterns = []*regexp.Regexp{
		regexp.MustCompile(`\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b`),                     // CPF
		regexp.MustCompile(`\b\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}\b`),               // CNPJ
		regexp.MustCompile(`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`),  // Email
		regexp.MustCompile(`\b(?:\+55\s?)?(?:\(\d{2}\)\s?)?\d{4,5}-?\d{4}\b`),       // Phone BR
		regexp.MustCompile(`\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b`),            // Credit Card
		regexp.MustCompile(`(?i)(password|secret|token|api[_-]?key|auth[_-]?token)\s*[:=]\s*\S+`), // Credentials
		regexp.MustCompile(`Bearer\s+[A-Za-z0-9\-_.]+`),                             // Bearer Token
	}
)

// SanitizeWriter wraps a writer to sanitize PII before writing
type SanitizeWriter struct {
	w io.Writer
}

func NewSanitizeWriter(w io.Writer) *SanitizeWriter {
	return &SanitizeWriter{w: w}
}

func (s *SanitizeWriter) Write(p []byte) (n int, err error) {
	sanitized := s.sanitize(string(p))
	return s.w.Write([]byte(sanitized))
}

func (s *SanitizeWriter) sanitize(input string) string {
	result := input
	for _, pattern := range piiPatterns {
		result = pattern.ReplaceAllString(result, "[REDACTED]")
	}
	return result
}

// Logger returns a zerolog logger with PII sanitization
func Logger() zerolog.Logger {
	sanitizedWriter := NewSanitizeWriter(zerolog.ConsoleWriter{Out: zerolog.NewConsoleWriter()})
	return zerolog.New(sanitizedWriter).With().Timestamp().Logger()
}

// StructuredLogger returns a JSON logger with PII sanitization
func StructuredLogger() zerolog.Logger {
	sanitizedWriter := NewSanitizeWriter(zerolog.ConsoleWriter{Out: zerolog.NewConsoleWriter()})
	return zerolog.New(sanitizedWriter).With().Timestamp().Logger()
}

// SanitizeMap sanitizes a map for logging
func SanitizeMap(m map[string]interface{}) map[string]interface{} {
	result := make(map[string]interface{})
	for k, v := range m {
		switch val := v.(type) {
		case string:
			result[k] = SanitizeString(val)
		case map[string]interface{}:
			result[k] = SanitizeMap(val)
		case []interface{}:
			result[k] = SanitizeSlice(val)
		default:
			result[k] = v
		}
	}
	return result
}

func SanitizeString(s string) string {
	for _, pattern := range piiPatterns {
		s = pattern.ReplaceAllString(s, "[REDACTED]")
	}
	return s
}

func SanitizeSlice(s []interface{}) []interface{} {
	result := make([]interface{}, len(s))
	for i, v := range s {
		switch val := v.(type) {
		case string:
			result[i] = SanitizeString(val)
		case map[string]interface{}:
			result[i] = SanitizeMap(val)
		case []interface{}:
			result[i] = SanitizeSlice(val)
		default:
			result[i] = v
		}
	}
	return result
}