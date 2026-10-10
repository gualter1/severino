# Changelog

All notable changes to this feature template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Canonical feature skeleton per ADR-001 (Feature-based Packaging)
- Domain isolation layer with entities, value objects, services, events (zero external deps)
- Application layer: commands, queries, handlers with dependency injection
- Infrastructure adapters: PostgreSQL repository, in-memory event bus, external service adapter
- Interface surface: HTTP (REST), gRPC stubs, CLI, MCP manifest
- Contract-first design: OpenAPI 3.0, AsyncAPI 3.0, JSON Schema, MCP
- Test pyramid: unit (domain/handlers), integration (adapters), contract (API/schemas)
- CI workflow: lint, typecheck, unit, contract, integration, security, build (Docker)
- Observability baseline: structured logging, metrics prefix, trace propagation
- Security baseline: input validation, authz scopes, secrets via env, SBOM gate

## [1.0.0] - 2026-10-09

### Added
- Initial canonical template release
- Extraction lessons: oh-my-openagent (gates), cc-switch (dual-mode), distilly (meta-skill), skillpper (registry)
- Cross-references: ADR-001, 002, 003, 007, 010, 013, 014