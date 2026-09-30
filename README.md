# Misba Mushtaq Portfolio

A modern, static-first personal portfolio and digital resume platform built with **Astro 7**, **Tailwind CSS v4**, **Lucide Icons**, and **Astro View Transitions**.

## Features

- **Modern & Elegant Design**: Glassmorphic UI with subtle ambient glows, micro-interactions, responsive typography, and refined layout.
- **Theme Options**: Multi-mode theme switcher supporting **Light**, **Dark**, and **System** preferences with zero Flash of Unstyled Content (FOUC) and smooth View Transition animations.
- **View Transitions**: Integrated Astro `ClientRouter` with persistent theme states, shared element morph transitions (`transition:name`), and seamless navigation.
- **Interactive Demos**:
  - **Student Registration Portal** (`/projects/registration/`): Live real-time student ID preview synchronized with form inputs, form validation, and feedback notifications.
  - **Digital Resume System** (`/resume/`): Clean printable layout optimized with print CSS (`window.print()`).
- **Lucide Icons**: Crisp, scalable iconography via `@lucide/astro`.
- **Package Manager**: Fully managed and locked with **pnpm**.

## Commands

Run commands from the project root using **pnpm**:

| Command | Action |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the local development server |
| `pnpm check` | Run Astro and TypeScript diagnostics |
| `pnpm build` | Check and build the production static site to `dist/` |
| `pnpm preview` | Preview the production build locally |

## Tech Stack

- **Framework**: Astro 7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: `@lucide/astro`
- **Routing & Transitions**: Astro View Transitions (`ClientRouter`)
- **Package Manager**: pnpm v11+
