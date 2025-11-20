# AGENTS.md — botc-kr

> **Note**: This file is the entry point for AI agents (Claude, Cursor, Copilot, etc.). For detailed initialization and operational guides, please refer to **[CLAUDE.md](CLAUDE.md)**.

## 1. Project Overview
- **Name**: Blood on the Clocktower (Unofficial Korean Localization)
- **Goal**: Provide Korean scripts (JSON/PDF) and utility tools (Savant Generator, Night Helper) for BotC players.
- **Stack**: React + TypeScript + Vite + TailwindCSS
- **Deploy**: GitHub Pages (via `gh-pages` branch)

## 2. Key Commands
- **Install**: `yarn` (preferred) or `npm ci`
- **Dev Server**: `yarn dev` (Runs on `http://localhost:5173`)
- **Build**: `yarn build`
- **Lint**: `yarn lint` / `yarn lint:fix`
- **Format**: `yarn format`
- **Deploy**: `yarn deploy`

## 3. Core Architecture
- **Entry**: `index.html` → `src/main.tsx` → `src/App.tsx`
- **Routing**: Hash-based routing (e.g., `/#savant-generator`, `/#helper`)
- **Data**:
  - `public/scripts.json`: Metadata for all scripts.
  - Remote Resources: JSON/PDFs are fetched from `wonhyo-e/botc-translations`.

## 4. Agent Guidelines
- **Read First**: Always check `CLAUDE.md` for the latest conventions, directory structure, and "Playbook".
- **Code Style**:
  - Strict TypeScript (avoid `any`).
  - Functional components with hooks.
  - TailwindCSS for styling.
- **Commit Messages**: Follow conventional commits (e.g., `feat: add new script`, `fix: resolve layout issue`).

## 5. Quick Links
- **[CLAUDE.md](CLAUDE.md)**: Detailed developer guide & playbook.
- **[package.json](package.json)**: Dependencies & scripts.
- **[public/scripts.json](public/scripts.json)**: Script data source.
