# ADR-001: TypeScript Migration

## Date
[28-06-2026]

## Status
Accepted

## Context
FoodVice backend was written in JavaScript (CommonJS). As the codebase grew and a Clean Architecture refactor began, the absence of static typing meant layer boundary violations (Mongoose documents leaking into use cases, mismatched repo signatures) were only caught at runtime. Introducing TypeScript alongside the refactor rather than after means interfaces and DTOs are designed correctly from the start.

## Decision
Migrate the entire backend to TypeScript incrementally, one feature module at a time, starting with the reel upload flow as the reference implementation. `strict: true` is enabled from day one. Zod schemas are the single source of truth for input types — DTOs are inferred via `z.infer<>` rather than manually declared. `any` is banned; `unknown` is used where type is genuinely uncertain.

## Consequences
✓ Layer boundary violations caught at compile time, not runtime  
✓ Repository interfaces and use case signatures are self-documenting contracts  
✓ Zod inference eliminates duplication between runtime validation and static types  
✓ Refactoring is safer — renaming a DTO field surfaces every callsite  

✗ Migration adds per-module overhead before the module can be considered done  
✗ `strict: true` surfaces latent null/undefined bugs that must be fixed, not suppressed  
✗ Mongoose typing has rough edges (`.populate()` return types) requiring explicit handling per model