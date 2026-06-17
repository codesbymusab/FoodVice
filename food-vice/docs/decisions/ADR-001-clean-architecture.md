# ADR-001: Clean Architecture

## Date
[20-04-2026]

## Status
Accepted

## Context
FoodVice started as a standard MVC Node.js app. As features grew
(AI recommendations, dual databases, multiple auth strategies),
controllers became bloated with business logic mixed with HTTP concerns.

## Decision
Adopted Clean Architecture with 3 layers: interfaces, application, infrastructure.
Business logic lives exclusively in use cases. External dependencies
(databases, AI services) are hidden behind port interfaces.

## Consequences
✓ Can swap infrastructure without touching business logic
✓ Use cases are testable without spinning up a database
✓ Clear ownership: each file has exactly one responsibility

✗ More boilerplate for simple CRUD operations
✗ Steeper onboarding for new developers unfamiliar with the pattern