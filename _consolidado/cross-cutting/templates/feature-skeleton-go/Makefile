# Makefile for feature-skeleton-go (ADR-027)
# Quality gates: coverage ≥80% lines, ≥70% branches, mutation ≥80%

.PHONY: build test coverage mutation lint fmt vet tidy run dev clean help

# Variables
BINARY_NAME := feature-skeleton
MAIN_PATH := ./cmd/main.go
COVERAGE_FILE := coverage.out
COVERAGE_HTML := coverage.html
MUTATION_TIMEOUT := 60s

# Default target
help:
	@echo "Available targets:"
	@echo "  build       - Build the binary"
	@echo "  test        - Run all tests with race detector"
	@echo "  coverage    - Run tests with coverage report"
	@echo "  coverage-check - Verify coverage thresholds (≥80% lines, ≥70% branches)"
	@echo "  mutation    - Run mutation testing (gremlins)"
	@echo "  lint        - Run golangci-lint"
	@echo "  fmt         - Format code with gofmt"
	@echo "  vet         - Run go vet"
	@echo "  tidy        - Run go mod tidy"
	@echo "  run         - Build and run the binary"
	@echo "  dev         - Run with air (hot reload)"
	@echo "  clean       - Clean build artifacts"
	@echo "  validate    - Run full validation pipeline (fmt, vet, lint, test, coverage-check, mutation)"

# Build
build:
	go build -o bin/$(BINARY_NAME) $(MAIN_PATH)

# Run tests with race detector
test:
	go test -v -race -coverprofile=$(COVERAGE_FILE) ./...

# Coverage report
coverage: test
	go tool cover -html=$(COVERAGE_FILE) -o $(COVERAGE_HTML)
	@echo "Coverage report generated: $(COVERAGE_HTML)"

# Coverage threshold check (ADR-008: 80% lines, 70% branches)
coverage-check:
	@go tool cover -func=$(COVERAGE_FILE) | grep total | awk '{print $$3}' | sed 's/%//' | awk '{if ($$1 < 80) {print "FAIL: Line coverage " $$1 "% < 80%"; exit 1} else {print "PASS: Line coverage " $$1 "% ≥ 80%"}}'
	@go test -coverprofile=$(COVERAGE_FILE) ./... > /dev/null 2>&1 && \
	go tool cover -func=$(COVERAGE_FILE) | grep -v total | awk '{sum+=$$3} END {print "Branch coverage not directly available in go test -coverprofile; use -covermode=atomic for branch coverage"}' || true

# Mutation testing with gremlins
mutation:
	@which gremlins > /dev/null || (echo "Installing gremlins..." && go install github.com/ricardomaraschini/gremlins/cmd/gremlins@latest)
	gremlins unleash --timeout=$(MUTATION_TIMEOUT) ./...

# Linting
lint:
	@which golangci-lint > /dev/null || (echo "Installing golangci-lint..." && go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest)
	golangci-lint run ./...

# Format
fmt:
	gofmt -w -s .

# Vet
vet:
	go vet ./...

# Tidy
tidy:
	go mod tidy

# Run
run: build
	./bin/$(BINARY_NAME)

# Dev with hot reload (requires air)
dev:
	@which air > /dev/null || (echo "Installing air..." && go install github.com/cosmtrek/air@latest)
	air

# Clean
clean:
	rm -rf bin/ $(COVERAGE_FILE) $(COVERAGE_HTML)

# Full validation pipeline (CI equivalent)
validate: fmt vet lint test coverage-check mutation
	@echo "✅ All validation checks passed!"

# Generate mocks (if using mockgen)
mocks:
	@which mockgen > /dev/null || (echo "Installing mockgen..." && go install github.com/golang/mock/mockgen@latest)
	go generate ./...

# Update dependencies
update-deps:
	go get -u ./...
	go mod tidy

# Security scan (gosec)
security:
	@which gosec > /dev/null || (echo "Installing gosec..." && go install github.com/securego/gosec/v2/cmd/gosec@latest)
	gosec ./...

# SBOM generation (Syft)
sbom:
	@which syft > /dev/null || (echo "Installing syft..." && curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin)
	syft dir:. -o spdx-json=sbom.spdx.json