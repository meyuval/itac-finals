---
name: typescript-best-practices
description: Best practices for writing modern, type-safe TypeScript. Use when authoring or reviewing TypeScript, choosing types vs interfaces, configuring tsconfig, handling errors, narrowing, generics, async code, or module structure. Keywords - typescript, ts, tsconfig, strict, types, interface, generics, type safety, narrowing, any, unknown.
---

# TypeScript Best Practices

Guidance for writing and reviewing TypeScript that is strict, readable, and safe. Apply these when authoring new code or reviewing a diff. Prefer correctness and clarity over cleverness.

## 1. Compiler configuration (non-negotiable)

Enable the strictest reasonable settings. A good baseline `tsconfig.json` compiler section:

```jsonc
{
  "compilerOptions": {
    "strict": true,                        // enables all strict flags below
    "noUncheckedIndexedAccess": true,      // arr[i] is T | undefined
    "noImplicitOverride": true,            // require `override` keyword
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true,    // `foo?: T` is not `foo: T | undefined`
    "verbatimModuleSyntax": true,          // explicit type-only imports/exports
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

`strict: true` is the single most important line. Do not disable strict flags to silence errors — fix the type instead.

## 2. Avoid `any`; reach for `unknown`

- **Never use `any`** to escape the type checker. It silently disables checking and spreads.
- Use **`unknown`** for values of genuinely unknown shape (API responses, `JSON.parse`, `catch` bindings), then narrow before use.
- If you must allow `any` temporarily, mark it: `// TODO: type this` and prefer a `// eslint-disable-next-line` over a blanket config.

```ts
function parse(input: string): unknown {
  return JSON.parse(input);
}

const data = parse(raw);
if (isUser(data)) {
  // data is User here
}
```

## 3. Typing style

- **`interface` for object shapes** that may be extended/implemented or are public API; **`type` for unions, intersections, tuples, mapped/conditional types, and function types.** Consistency matters more than the exact rule — pick one and apply it.
- **Prefer type inference** for locals and return values of simple functions; **annotate explicitly** on exported/public function signatures and module boundaries.
- Use `readonly` and `as const` for immutable data. `as const` turns literals into narrow readonly types.
- Prefer **discriminated unions** over optional-field grab-bags or boolean flags:

```ts
type Result<T> =
  | { status: 'ok'; value: T }
  | { status: 'error'; error: Error };
```

- Model "one of N" with string-literal unions, not `enum` (enums have runtime/erasability quirks). If you need an enum, prefer `as const` objects:

```ts
const Role = { Admin: 'admin', User: 'user' } as const;
type Role = (typeof Role)[keyof typeof Role];
```

## 4. Narrowing and type guards

- Use `typeof`, `in`, `instanceof`, and equality checks to narrow.
- Write **user-defined type guards** (`x is T`) for reusable checks, and use **assertion functions** (`asserts x is T`) for invariants.
- Avoid `as` type assertions — they bypass checking. When unavoidable, keep them narrow and comment why. Never use double assertions (`as unknown as T`) except at well-documented FFI/boundary points.

```ts
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x;
}
```

## 5. Error handling

- In `catch`, the binding is `unknown`. Narrow before use:

```ts
try { /* ... */ }
catch (err) {
  if (err instanceof Error) log(err.message);
  else log(String(err));
}
```

- Prefer typed `Result`/`Either` returns for expected failures; reserve `throw` for truly exceptional conditions.
- Never swallow errors silently. Don't annotate `catch (err: any)`.

## 6. Null and undefined

- Rely on `strictNullChecks` (part of `strict`). Handle `null`/`undefined` explicitly.
- Use optional chaining `?.` and nullish coalescing `??` (not `||`, which also triggers on `0`/`''`/`false`).
- Avoid the non-null assertion `!` — it's an unchecked claim. Narrow instead.

## 7. Generics

- Add generics only when they carry a real relationship between inputs and outputs. Don't make a function generic for decoration.
- Constrain type parameters (`<T extends ...>`) to the minimum needed.
- Name them meaningfully when it aids reading (`TValue`, `TKey`) rather than always `T`, `U`.

## 8. Async code

- Type async functions as returning `Promise<T>`; let inference handle the wrapping.
- Always `await` or explicitly handle promises — enable `@typescript-eslint/no-floating-promises`.
- Use `Promise.all` for independent concurrent work; don't `await` in a loop when calls are independent.

## 9. Modules and structure

- Use ES module `import`/`export`. With `verbatimModuleSyntax`, use `import type { X }` for type-only imports so they're erased at compile time.
- Avoid default exports for anything non-trivial — named exports refactor and auto-import better.
- Keep public surface small; don't re-export everything through a barrel if it creates cycles.

## 10. Utility types

Lean on built-ins instead of hand-rolling: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `ReturnType`, `Parameters`, `Awaited`, `NonNullable`. Derive types from a single source of truth (`typeof`, `keyof`) rather than duplicating shapes.

## Review checklist

When reviewing TypeScript, flag:
- [ ] Any use of `any` (explicit or implicit)
- [ ] `as` assertions, especially `as unknown as`, and `!` non-null assertions
- [ ] `catch (e: any)` or unnarrowed `catch` usage
- [ ] Floating/unawaited promises
- [ ] `||` where `??` is intended
- [ ] Booleans/optional fields that should be a discriminated union
- [ ] Duplicated type shapes that could be derived
- [ ] Missing return-type annotations on exported functions
- [ ] Disabled strict flags in tsconfig
