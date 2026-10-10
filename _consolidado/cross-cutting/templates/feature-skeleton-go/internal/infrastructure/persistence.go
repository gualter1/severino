// Package infrastructure — Persistence (PostgreSQL example)
// ADR-027: Multi-language feature-skeleton (Go variant)
package infrastructure

import (
	"context"
	"database/sql"
	"errors"

	_ "github.com/lib/pq"
	"github.com/severino/feature-skeleton-go/internal/application"
	"github.com/severino/feature-skeleton-go/internal/domain"
)

var ErrNotFound = errors.New("entity not found")

// PostgresSampleRepository
type PostgresSampleRepository struct {
	db *sql.DB
}

func NewPostgresSampleRepository(dsn string) (*PostgresSampleRepository, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return &PostgresSampleRepository{db: db}, nil
}

func (r *PostgresSampleRepository) Save(ctx context.Context, entity *domain.SampleEntity) error {
	query := `
		INSERT INTO sample_entities (id, name, status, metadata, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (id) DO UPDATE SET
			name = EXCLUDED.name,
			status = EXCLUDED.status,
			metadata = EXCLUDED.metadata,
			updated_at = EXCLUDED.updated_at
	`
	_, err := r.db.ExecContext(ctx, query,
		entity.ID, entity.Name, entity.Status, entity.Metadata,
		entity.CreatedAt, entity.UpdatedAt,
	)
	return err
}

func (r *PostgresSampleRepository) FindByID(ctx context.Context, id string) (*domain.SampleEntity, error) {
	query := `SELECT id, name, status, metadata, created_at, updated_at FROM sample_entities WHERE id = $1`
	row := r.db.QueryRowContext(ctx, query, id)

	var entity domain.SampleEntity
	err := row.Scan(&entity.ID, &entity.Name, &entity.Status, &entity.Metadata, &entity.CreatedAt, &entity.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, ErrNotFound
	}
	return &entity, err
}

func (r *PostgresSampleRepository) List(ctx context.Context, limit, offset int, status string) ([]*domain.SampleEntity, error) {
	query := `SELECT id, name, status, metadata, created_at, updated_at FROM sample_entities`
	args := []interface{}{}
	argIdx := 1

	if status != "" {
		query += " WHERE status = $" + string(rune(argIdx+'0'))
		args = append(args, status)
		argIdx++
	}

	query += " ORDER BY created_at DESC LIMIT $" + string(rune(argIdx+'0')) + " OFFSET $" + string(rune(argIdx+1+'0'))
	args = append(args, limit, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entities []*domain.SampleEntity
	for rows.Next() {
		var entity domain.SampleEntity
		if err := rows.Scan(&entity.ID, &entity.Name, &entity.Status, &entity.Metadata, &entity.CreatedAt, &entity.UpdatedAt); err != nil {
			return nil, err
		}
		entities = append(entities, &entity)
	}
	return entities, rows.Err()
}

// Interface compliance check
var _ application.SampleRepository = (*PostgresSampleRepository)(nil)