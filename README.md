# Hono API with React Frontend Template

![Bun](https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff) ![Hono](https://img.shields.io/badge/Hono-E36002?logo=hono&logoColor=fff) ![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)

This template uses Hono as the API and Static host for the built React frontend. The included packages are minimal, and there is no styling or UI library installed on the frontend.

## Structure

Workspaces are set up for both the server and frontend, so no need to install both sets of dependencies. Shared dev dependencies can be installed to root.

To install dependencies:

```sh
# Server
bun add package1 package2 --filter=server

# Frontend
bun add package1 package2 --filter=frontend

# Shared/Dev
bun add -D package1 package2
```

### Folder Structure

```bash
(root)/
├── frontend/           # React frontend
├── server/             # API and hosting
└── shared/             # Shared folder, useful for shared types or utils
    └── types/          # For shared types
        └── index.ts    # Placeholder barrel file for shared types
```

### Aliases

Each of the folders have been configured with an alias, in the root tsconfig.json file.

```bash
@frontend/* # for all frontend code.
@shared/*   # for all shared code.
@server/*   # for all server code.
```

This will allow you to easily import without using a ton of dots in relative imports. For example:

```ts
import type { SharedType } from '@shared/types';
...
import { databaseFunction } from '@server/lib/db';
...
import ExampleComponent from '@frontend/components/ExampleComponent';
```

## Server-Side

### Packages Included (Server)

- Hono
- Zod
- Zod Validator for Hono
- Eslint
- Prettier

### To install dependencies for both frontend and server

```sh
bun install
```

### To run

```sh
bun run dev:server
```

### Environment Variables

Zod is leveraged to ensure presence of required variables, as well as for type safety. Please see "/server/env.ts".

First, Create a .env file. Make sure to update '/server/env.ts' with any addded definitions.

<!-- markdownlint-disable MD010 -->

```typescript
// server/env.ts
export const ServerEnv = z.object({
	PORT: z.coerce.number().int().positive().default(3000),
	SHOW_ROUTES: z.preprocess((arg) => arg === 'true', z.boolean().default(false)),
	// Additional variables, as well as any type coercion
});
```

ProcessEnv is exported, which calls ServerEnv.parse on process.env.
Import and use this object where needed instead of process.env directly.

### Additional API Routes

See the routes folder. Use index.ts for hooking up all routes, as the apiRoutes is what is linked up to the main app.

> [!IMPORTANT]
> Make sure to use chaining in routes to maintain types for the frontend.
>
> Good:
>
> ```ts
> const route = new Hono().get('/', ...).get('/:id', ...).post('/', ...);
> ```
>
> Bad:
>
> ```ts
> const route = new Hono();
> route.get('/', ...);
> route.get('/:id', ...);
> route.post('/', ...);
> ```

## Frontend

### Packages Included (Frontend)

- React
- Rsbuild
- @tanstack/react-router

### Additional Routes

Tanstack Router is set up in file-mode. A \_\_root file and index file are provided.

Review the documentation for Tanstack Router for full details.

### Using the API

The main client is located in "/frontend/src/lib/api/index.ts" and uses the Hono client which implements type-safety from the server routes.

If you wish to replace this with axios or a different library, the '/api' path is proxied in rsbuild.

### Run Frontend for Development

```sh
bun run dev:frontend
```

View site on `http://localhost:5000`

## Build for Production

Since we are using a workspace setup, running build accomplishes two things:

- Runs the build script for the frontend, which outputs the static frontend into frontend/dist.
- Runs the build script for the server, which outputs a single js file to build/

```sh
bun run build
```
