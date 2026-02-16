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
- `translations-tooling/` directory is now included under this repo and contains generation scripts + source assets for translation data.
- Runtime assets are served from `public/translations/assets` and `VITE_TRANSLATIONS_BASE` defaults to `/translations/assets`.
- Script UI is now organized by feature under `src/features/scripts/`:
  - `src/features/scripts/components/ScriptList.tsx`
  - `src/features/scripts/components/ScriptCard.tsx`
  - `src/features/scripts/components/ScriptCategory.tsx`
  - `src/features/scripts/components/ScriptImage.tsx`
  - `src/features/scripts/components/ActionButtons.tsx`
  - `src/features/scripts/services/ScriptUtils.tsx`

## 4. Agent Guidelines
- **Read First**: Always check `CLAUDE.md` for the latest conventions, directory structure, and "Playbook".
- **Code Style**:
  - Strict TypeScript (avoid `any`).
  - Functional components with hooks.
  - TailwindCSS for styling.
- **Commit Messages**: Follow conventional commits (e.g., `feat: add new script`, `fix: resolve layout issue`).

## 5. BMAD 기능 카탈로그 (`_bmad`)
- 현재 설치 모듈: `core` (버전 `6.0.0-Beta.8`)
- 실행 경로: `{project-root}/_bmad/core/...`
- 공통 실행 규칙: 명령은 `/` 접두사로 호출 (`/bmad-*` 형식)
- 주요 실행 명령
  - `/bmad-brainstorming` (`BSP`): 브레인스토밍 워크플로우 실행
  - `/bmad-party-mode` (`PM`): 다중 에이전트 토론 모드 실행
  - `/bmad-help` (`BH`): 다음 단계 추천, 워크플로우 라우팅 안내
  - `/bmad-index-docs` (`ID`): 폴더 문서 인덱스 생성
  - `/bmad-shard-doc` (`SD`): 대형 문서 분할(섹션 단위)
  - `/bmad-editorial-review-prose` (`EP`): 문체/문장 가독성/톤 리뷰
  - `/bmad-editorial-review-structure` (`ES`): 구조(조직화/재배열/요약성) 리뷰
  - `/bmad-review-adversarial-general` (`AR`): 일반 adversarial(비판적) 리뷰
- 참고: `/bmad-master` 에이전트 실행 시 메뉴/상태 명령(`MH`, `LT`, `LW`, `DA` 등)을 통해 작업 목록 조회·제거 가능

## 6. Quick Links
- **[CLAUDE.md](CLAUDE.md)**: Detailed developer guide & playbook.
- **[package.json](package.json)**: Dependencies & scripts.
- **[public/scripts.json](public/scripts.json)**: Script data source.
- **[translations-tooling/README.md](translations-tooling/README.md)**: Translation generation and CSV/JSON workflow.

## 7. CI & Required Env
- Workflow: `/.github/workflows/ci.yml`
- `VITE_TRANSLATIONS_BASE` defaults to local assets (`/translations/assets`), but can be overridden in CI or local env if needed.
