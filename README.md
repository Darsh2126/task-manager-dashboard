# Task Manager Dashboard - https://task-manager-dashboard-kappa.vercel.app/

A task management dashboard built as a React practical assignment.

The application allows users to sign up, log in, and manage their tasks
through a responsive dashboard. Users can create, edit, delete, search,
filter, sort, paginate, and move tasks between status columns using drag
and drop.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- React Hook Form
- Zod
- IndexedDB
- dnd-kit
- Jest
- React Testing Library
- ESLint
- Prettier

## Project Structure

The project structure is being developed incrementally along with the
implementation.

The structure shown below represents the current stage of the project
and is not treated as a fixed final structure.

### Folder Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   └── tasks/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── logout-button.tsx
│   │   └── sidebar.tsx
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── filters/
│   └── tasks/
│
├── hooks/
│
├── lib/
│   ├── enums/
│   └── shared/
│
├── schemas/
│
├── services/
│   ├── auth/
│   └── task/
│
├── store/
│   ├── auth/
│   └── task/
│
├── types/
│
└── __tests__/
    ├── auth/
    ├── shared/
    ├── store/
    └── tasks/
```

Will provide the final structure once it fully generated.

### Folder Responsibilities

- `app/` --- application routes and page composition
- `components/` --- shared UI and layout components
- `features/` --- feature-specific components and behaviour
- `store/` --- global application state
- `hooks/` --- reusable React hooks
- `schemas/` --- form and input validation
- `types/` --- shared TypeScript types
- `lib/` --- shared utilities and application helpers
- `services/` --- persistence and API-related operations

The project uses feature-oriented components with separate state and
service responsibilities.

## Component Structure

The application uses feature-oriented components.

For example:

```text
features/
├── auth/
│   ├── login-form
│   └── signup-form
│
└── tasks/
    ├── task-board
    ├── task-column
    ├── task-card
    ├── task-form
    └── task-toolbar
```

## Running Locally

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm run dev
```

The application can then be opened using the local URL provided by
Next.js.

## Environment Variables

Environment-specific configuration will be kept in environment files
where required.

Sensitive values should not be committed to the repository.

## Design Decisions

### Next.js

Next.js is used for the application framework and routing.

The App Router is used to organize authentication and dashboard routes.

### Zustand

Zustand is used for global authentication and task state.

### React Hook Form and Zod

React Hook Form handles form state and submission while Zod provides
validation schemas.

This keeps validation rules separate from the UI.

### IndexedDB

IndexedDB is used instead of a separate mock backend so the application
can persist authentication and task data without requiring another
service to run locally.

### Feature-Oriented Components

Feature-specific components are grouped under `features`.

This keeps task-related and authentication-related UI close to their
respective domains while shared UI remains reusable.

### Versioning Desicions

### Version 0.1.x
1. Initial Project Setup added

### Version 0.2.x
1. Added Authentication with Protected Routes functionality

### Version 0.3.x
1. Created Task Dashboard Layout
2. Added Task Board CRUD management

### Version 0.4.x
1. Implemented Drag and Drop functionality and its layout.
- The reason behind implementing DND over sorting and other part is because the DND is occuring over Cards and the whole
filtering and sorting is happening with Data
2. Added Column Based and Cross Column DND functionality

### Version 0.5.x
1. Added Sorting, Filtering and Pagination functionality
2. Done some other UI enhancements after implementation

### Version 0.6.x
1. Added JEST testing functionality
2. Updating README files.
3. Resolved IndexDB related bug in production build.

### Version 1.1.x
1. Update the Task Pagination logic