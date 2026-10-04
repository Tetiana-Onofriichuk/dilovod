# Calorie Tracker Backend

Backend API for the Calorie Tracker application.

## Tech Stack

- NestJS
- TypeScript
- MongoDB
- Mongoose

## Installation

Clone the repository:

```bash
git clone https://github.com/Tetiana-Onofriichuk/calorie-tracker-backend.git
```

Go to the project folder:

```bash
cd calorie-tracker-backend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root of the project.

Use `.env.example` as a template:

```env
MONGODB_URI=
PORT=3000
```

Add your MongoDB connection string to `MONGODB_URI`.

> Never commit the `.env` file to Git.

## Running the Application

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run start:prod
```

## Other Commands

Build the project:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Run ESLint:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## API

The API runs locally on:

```text
http://localhost:3000
```

## Project Structure

```text
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

The project structure will be expanded as new modules are added.
