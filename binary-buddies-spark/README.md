# Binary Buddies Web Application

## Project Overview

This is the frontend web application for Binary Buddies, built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd binary-buddies-spark

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev
```

### Development

The development server will start on `http://localhost:3000` with hot-reloading enabled.

## Technologies Used

This project is built with:

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn-ui** - UI components
- **TanStack Query** - Data fetching
- **Framer Motion** - Animations

## Building for Production

```sh
npm run build
```

## Docker Deployment

The application can be deployed using Docker:

```sh
docker compose up -d
```

## Project Structure

- `/app` - Next.js app router pages
- `/components` - React components
- `/hooks` - Custom React hooks
- `/services` - API services
- `/types` - TypeScript type definitions
- `/lib` - Utility functions
