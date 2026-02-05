# work-agents Frontend

Next.js frontend for the work-agents project.

## Tech Stack

- **Framework**: Next.js 15.5 (App Router)
- **UI Library**: React 19, Shadcn/UI
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router (pages & layouts)
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and libraries
│   ├── store/            # State management (Zustand)
│   ├── test/             # Frontend tests
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── package.json          # Node.js dependencies
```

## Key Directories

- `src/app`: Contains the application routes and pages.
- `src/components`: UI components, built with Shadcn/UI.
- `src/lib`: Utility functions, API clients, and constants.
- `src/store`: Global state management using Zustand.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
