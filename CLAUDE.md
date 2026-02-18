## CLAUDE.md — botc-kr (AI Agent Init Guide)

이 문서는 Claude Code, Cursor, Copilot 등 에이전트가 이 저장소를 빠르게 이해하고 실행/수정/배포까지 수행할 수 있도록 하는 초기화 가이드입니다. 프로젝트 변경 시 이 파일을 함께 업데이트하세요.

### 1) 프로젝트 개요

- **목적**: Blood on the Clocktower(시계탑에 흐른 피) 비공식 한글화 자료(스크립트 JSON/PDF)와 보조 도구(서번트 명제 생성기, 밤 순서 헬퍼)를 제공하는 정적 웹앱
- **스택**: React + TypeScript + Vite, TailwindCSS, Radix UI, lucide-react
- **배포**: GitHub Pages (`gh-pages` 패키지 사용)
- **데이터 소스**:
  - `public/scripts.json`: 사이트에서 노출할 스크립트 메타데이터 목록
  - 원문/번역 리소스: `public/translations/assets` 내 정적 파일(JSON/PDF/이미지).  
    (레거시 환경변수로 기존 GitHub Raw 경로를 받아올 수 있습니다.)

### 2) 빠른 시작(init)

1. Node 18+ (권장) 설치 확인
2. 의존성 설치
   - Yarn 권장: `yarn`
   - 또는 NPM: `npm ci`
3. 개발 서버
   - `yarn dev` 혹은 `npm run dev`
   - 로컬에서 해시 라우팅으로 페이지 전환: `/#savant-generator`, `/#helper`, `/#tracker`
4. 품질 점검
   - 린트: `yarn lint` / 자동수정: `yarn lint:fix`
   - 타입체크: `yarn typecheck`
   - 통합 검증: `yarn verify` (`lint + typecheck + build`)
   - 포맷: `yarn format`
   - 번역 CSV 다운로드: `yarn translations:csv:download`
   - 번역 CSV 제어문자 정리: `yarn translations:csv:sanitize`
   - 번역 CSV 제어문자 정리(다운로드본): `yarn translations:csv:sanitize:downloaded`
   - 번역 CSV 검증: `yarn translations:csv:validate`
   - 번역 CSV 검증(엄격): `yarn translations:csv:validate:strict`
   - 스크립트 CSV 검증(엄격): `yarn translations:csv:validate:scripts-strict`
   - 스크립트 메타 생성: `yarn translations:scripts:generate`
   - 원클릭 동기화: `yarn translations:sync-scripts` (`download -> sanitize -> strict validate scripts -> generate`)
5. 빌드/프리뷰
   - 빌드: `yarn build`
   - 프리뷰: `yarn preview`
6. 배포(GitHub Pages)
   - `yarn deploy` (dist를 `gh-pages` 브랜치로 푸시)

### 3) 디렉터리/핵심 파일 지도

- `index.html`: 엔트리 HTML (SEO 메타, 루트 `#root`)
- `src/main.tsx`: React 엔트리
- `src/App.tsx`: 페이지 라우팅 훅(`useHashPageRoute`) 기반 엔트리
  - 기본: 스크립트 목록
  - `#savant-generator`: 서번트 명제 생성기
  - `#helper`: 밤 순서/캐릭터 헬퍼
  - `#tracker`: 게임 로그 대시보드
- `src/hooks/useHashPageRoute.ts`: 해시 변경 감지/페이지 전환 공통 훅
- `src/constants/pageConfig.ts`: 페이지 해시/네비게이션 라벨 중앙화 메타데이터
- `src/components/layout/`: 전역 레이아웃
  - `Header.tsx`, `Footer.tsx`
- `public/scripts.json`: 노출 스크립트 메타 소스
- `src/features/scripts/components/ScriptList.tsx`: 스크립트 목록 페이지 루트
  - `src/features/scripts/components/ScriptCategory.tsx`
  - `src/features/scripts/components/ScriptCard.tsx`
  - `src/features/scripts/components/ScriptImage.tsx`
  - `src/features/scripts/components/ActionButtons.tsx`
  - `src/features/scripts/hooks/useScriptActions.ts`
  - `src/features/scripts/hooks/useScripts.ts`
  - `src/features/scripts/hooks/useScrollToScriptHash.ts`
  - `src/features/scripts/services/scriptCategoryService.ts`
  - 데이터 로딩/다운로드 유틸: `src/features/scripts/services/scriptService.ts`
- `src/components/SavantProposition.tsx`: 서번트 명제 생성기 (문구 배열 유지)
- `src/features/helper/`:
  - `components/Helper.tsx`: 원격 JSON 스크립트 로드(ko_KR 경로), 캐릭터 상세 다이얼로그 관리
  - `components/dialog/`: 캐릭터 다이얼로그 하위 UI(`InfoCardButton`, `CharacterSelectionPanel`, `AlignmentSelector`)
  - `components/HelperTabs.tsx`, `components/HelperScriptSelect.tsx`: 탭/스크립트 선택 UI 분리
  - `components/CharacterDialog.tsx`, `components/CharacterRow.tsx`: 캐릭터 상세/선택 UI
  - `hooks/useHelperEntries.ts`: 선택된 스크립트 엔트리 로딩/에러 처리
  - `hooks/useHelperCharacters.ts`: 엔트리 기반 캐릭터/밤 순서 파생 데이터 계산
  - `hooks/useHelperScriptSelection.ts`: 스크립트 선택 상태 + localStorage 동기화
  - `services/helperMessageFormatter.ts`: 캐릭터/진영 플레이스홀더 메시지 포매팅
  - `services/helperScriptService.ts`: 아이콘 매핑/스크립트 로딩 서비스
  - 도우미 상수: `src/constants/nightInfo.ts`
- `src/features/tracker/`:
  - `TrackerApp.tsx`, `Dashboard.tsx`, `api.ts`, `types.ts`
  - `components/ChartsPanel.tsx`, `components/StatsSummary.tsx`, `components/GameLogTable.tsx`, `components/WinnerBadge.tsx`
  - `constants.ts`: 승리 진영 색상/배지 공통 상수
  - `hooks/useGameLogs.ts`: 로그 로딩/정렬 로직 분리
- `src/assets/`: 이미지/폰트 등 정적 리소스
- 스타일: `src/index.css` (TailwindCSS v4 CSS-first 설정)
- 번들 설정: `vite.config.ts`

### 4) 실행 흐름(요약)

- 초기 진입 시 `useHashPageRoute`가 `window.location.hash`를 읽어 페이지를 결정하고 해시 변경을 구독
- 스크립트 페이지
  - `scriptService.fetchScripts()` → `/scripts.json`을 fetch하여 카드 목록 렌더
  - 카드 내 액션: JSON 복사, JSON/PDF 다운로드, 공유 URL 복사(`https://botc-kr.github.io/#<scriptId>`)
  - 해시 `#<scriptId>`로 직접 진입 시 해당 카드까지 스무스 스크롤
- 서번트 페이지
  - 고정 문구 배열에서 무작위 선택, 아이콘 회전 애니메이션(`spin-slow`)
- 헬퍼 페이지
  - `src/features/helper/scripts.ts` 목록에서 선택 → 각 스크립트 원격 JSON 로드
  - 첫날밤/그 외 밤/캐릭터 탭으로 분리 표시, 캐릭터 다이얼로그로 조합형 안내 메시지 제공

### 5) 스크립트 데이터 추가/수정 가이드

- 스크립트 목록은 `public/scripts.json`에서 관리합니다. 형식 예시:

```json
{
  "author": "The Pandemonium Institute",
  "synopsis": "...한글 설명...",
  "name": "불길한 조짐",
  "id": "trouble_brewing",
  "pdf": "https://raw.githubusercontent.com/.../trouble_brewing.pdf",
  "json": "https://raw.githubusercontent.com/.../trouble_brewing.json",
  "official": true,
  "logo": "tb",
  "note": "번역 노트 (선택)"
}
```

- `logo` 처리 규칙

  - 값이 `tb`/`bmr`/`snv`인 경우: 로컬 이미지 매핑(`ScriptImage.tsx`)
  - 그 외: 절대 URL 권장(원격 이미지)

- 새 스크립트 추가 시 체크리스트
  - `public/scripts.json`에 항목 추가(필수 키: `id`, `name`, `author`, `json`, `pdf`)
  - `official`, `teensyville` 플래그 정확히 지정(필터링/섹션 구분용)
  - 로고 이미지 키/URL 확인(없는 경우 기본 이미지로 폴백)
  - 원격 JSON/PDF 링크의 가용성 확인(HTTP 200)

### 6) 서번트 명제/헬퍼 데이터 편집

- 서번트 명제: `src/components/SavantProposition.tsx`의 `propositions` 배열 수정
- 헬퍼 스크립트 목록: `src/features/helper/scripts.ts` 수정(ko_KR JSON URL 사용)
- 일반/밤 정보 프리셋: `src/constants/nightInfo.ts` (필요 시 메시지/팀/선택수 조정)

### 7) 품질/컨벤션

- 린트: ESLint 9 + TypeScript ESLint
- 포맷: Prettier (`yarn format`)
- 타입: 가급적 `any` 지양, 명시적 함수 시그니처
- 네이밍: 의미 있는 전체 단어 사용(약어 지양)
- 제어 흐름: 가드 클로즈, 에러/엣지 우선 처리

### 8) 배포/정적 경로 주의

- Vite `base: '/'` 설정(루트 도메인 `botc-kr.github.io` 기준)
- 배포: `yarn deploy` → `dist`를 `gh-pages` 브랜치로 푸시
- 정적 자원: `public/` 경로는 루트(`/`) 기준 제공. 런타임 fetch는 절대경로(`/scripts.json`) 사용

### 9) 외부 의존/통신

- 기본 번역 리소스: `public/translations/assets` (로컬 정적 경로 `/translations/assets`)
- `normalizeTranslationUrl`은 과거 `https://raw.githubusercontent.com/wonhyo-e/botc-translations/...` URL을 상응하는 로컬 경로로 변환해 하위 호환을 지원합니다.
- 네트워크 장애 대비: JSON/PDF fetch 실패 시 경고 노출(`scriptService`, `helperScriptService`)

### 10) 알려진 사항/향후 작업

- 해시 기반 수동 라우팅 사용 중(필요 시 정식 라우팅 검토 가능)
- 오프라인 캐시/서비스워커(PWA) 검토 여지
- `scripts.json` 검증 스키마 도입 고려(JSON Schema)

### 11) 작업 플레이북(에이전트용)

일반 수정 시

1. 변경 의도 요약 후 대상 파일 열람
2. 관련 모듈/유틸 영향 범위 확인(`scriptService`, `components/layout`, 헬퍼 상수 등)
3. 최소 단위의 안전한 수정 → 빌드 → 수동 점검(로컬)
4. 린트/포맷 → 커밋 메시지 규칙(`type: subject`, 예: `feat: add new script entry`)
5. `CLAUDE.md`의 관련 섹션 업데이트(스키마/흐름 변경 시)

새 스크립트 추가 시

1. `public/scripts.json`에 항목 추가
2. 링크/이미지 키 확인, 필요 시 `ScriptImage` 매핑 확장
3. 로컬 런에서 카드/필터/해시 스크롤 동작 확인

서번트/헬퍼 데이터 변경 시

1. 해당 상수/배열 수정 → UI 표시/선택 로직 확인

배포 전 체크리스트

- [ ] `yarn build` 성공
- [ ] 주요 페이지(스크립트/서번트/헬퍼) 수동 점검
- [ ] 외부 리소스 링크 200 확인
- [ ] `yarn deploy`

### 12) 변경이력(수기 업데이트)

- 2025-08-12: 최초 작성. 프로젝트 구조/데이터 흐름/작업 플레이북 정리.
- 2025-08-12: 리팩토링 1차
  - PageType 중앙화(`src/constants/pages.ts`), 해시 라우팅 유틸 추가(`src/constants/routes.ts`)
  - 컴포넌트 prop 타입 통일, alias import 표준화
  - 섹션 id 상수화(`src/constants/sections.ts`), 번역 리소스 URL 헬퍼 추가(`src/constants/urls.ts`)
  - `alert()` → `notify()`로 공통화(`src/lib/utils.ts`), 스크립트 로직 전반 적용
- 2025-08-12: 리팩토링 2차
  - UI 상수 분리: `HEADER_OFFSET_PX`(`src/constants/ui.ts`)
  - 서번트 명제 상수 분리: `SAVANT_PROPOSITIONS`(`src/constants/savant.ts`)
  - 네트워크 안정성: `fetchWithRetry` 도입(`src/utils/fetchRetry.ts`) 및 스크립트 서비스 적용
- 2026-02-18: 리팩토링 3차
  - 미사용 레거시 코드/의존성 정리(`PDFGenerator`, CRA 테스트/리포트 파일, 미사용 패키지)
  - 타입 분리(`src/features/scripts/types.ts`, `src/features/helper/types.ts`) 및 공통 스크롤 유틸(`src/utils/scroll.ts`) 추가
  - `helper`/`tracker` 기능을 `src/features/`로 재배치하고 로딩 서비스 분리(`helperScriptService`, `scriptService`)
- 2026-02-18: 리팩토링 4차
  - TailwindCSS v4 마이그레이션(`@tailwindcss/vite`, CSS-first `@theme`) 및 eslint 10 업그레이드
  - 공통 비동기 상태 컴포넌트(`src/components/AsyncState.tsx`) 도입
  - 레이아웃/헬퍼/트래커/스크립트 기능을 훅·서브컴포넌트·서비스로 추가 분해
- 2026-02-18: 리팩토링 5차
  - 타이머 기반 임시 UI 상태 공통화(`src/hooks/useTransientValue.ts`)
  - `helper` 캐릭터 다이얼로그 하위 컴포넌트 분해 및 메시지 포매터 도입
  - `scripts`/`helper`/`tracker` 데이터 로딩 흐름을 전용 훅(`useScripts`, `useHelperEntries`, `useGameLogs`)으로 분리
  - 역할 ID 정규화 재사용 및 캐릭터 정보 조회 정확 매칭 우선 처리
- 2026-02-18: 리팩토링 6차
  - 런타임 타입 가드 강화(`isHelperEntry`)로 helper 스크립트 파싱 안전성 강화 및 일부 unsafe cast 제거
  - `helper` 파생 데이터 훅(`useHelperCharacters`) 및 `tracker` 대시보드 파생 데이터 훅(`useDashboardMetrics`) 분리
  - 페이지 메타데이터 중앙화(`pageConfig`)로 라우팅/헤더 중복 제거
  - 클립보드 기능 지원 여부 기반 액션 처리 및 라우팅 해시 location 유틸 일원화
  - 품질 게이트 스크립트 추가(`typecheck`, `verify`) 및 Prettier 옵션 최신화
- 2026-02-18: 번역 CSV 파이프라인 보강
  - 구글 시트 CSV 검증 스크립트 추가(`translations-tooling/validate_google_sheet_csv.py`)
  - CSV 제어문자 정리 스크립트 추가(`translations-tooling/sanitize_csv_control_chars.py`)
  - 루트 실행 커맨드 추가(`translations:csv:download`, `translations:csv:sanitize`, `translations:csv:sanitize:downloaded`, `translations:csv:validate`, `translations:csv:validate:strict`, `translations:csv:validate:scripts-strict`, `translations:scripts:generate`, `translations:sync-scripts`)
  - strict 모드 검증 추가(경고 실패, 제어문자/헤더 정규화 실패, scripts.csv 헤더/ID/경로 규칙 강화)
  - `translations-tooling/README.md`, `AGENTS.md` 명령 가이드 갱신

### 13) 라이선스/크레딧

- 번역물 라이선스: CC BY-NC 4.0 (README 참고)
- 원작: The Pandemonium Institute (Blood on the Clocktower)

### 14) 문의/피드백

- GitHub Issues 활용 권장
- 배포 페이지/저장소 링크: 헤더의 GitHub 아이콘 참조
