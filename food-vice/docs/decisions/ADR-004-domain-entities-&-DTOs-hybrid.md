# ADR-002: Hybrid Use of Domain Entities and DTOs Across Layer Boundaries

## Date
[28-06-2026]

## Status
Accepted

## Context
Clean Architecture requires data to change representation as it crosses layer boundaries. Using raw Mongoose documents throughout couples every layer to the ORM. But creating full domain entity classes for objects that currently have no behavior is premature overhead. A clear rule is needed for which representation to use at each boundary and when.

## Decision

Adopt a hybrid strategy based on current need, with an explicit trigger for upgrading from plain interface to domain entity.

**Input DTOs** — Zod schemas live in `application/dtos/input/`. Types are inferred via `z.infer<>`. Query parameters are a separate schema from body DTOs, validated by a dedicated `validateQuery` middleware.

**Output DTOs** — Plain TypeScript interfaces in `application/dtos/output/`. Repository implementations map Mongoose documents to these before returning. Raw Mongoose documents never cross the repository boundary into the application layer.


**Domain Entities** — Introduced only when an invariant would otherwise be duplicated across multiple use cases. That duplication is the trigger, not the existence of the concept itself.

**Value Objects** — Introduced when a primitive value with its own validation rule appears in more than one place (e.g. `MediaUrl` must be a valid https URL).

## Consequences
✓ Mongoose documents are contained within the infrastructure layer  
✓ Use cases work with DTOs and interfaces, never ORM objects  
✓ Plain interfaces can be upgraded to entities incrementally as behavior accumulates  
✓ Read and write concerns are cleanly separated at the repository interface level  

✗ Two patterns (plain DTO and entity) coexist during transition, requiring contributors to know the rule for which applies where  
