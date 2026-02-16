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
   - 로컬에서 해시 라우팅으로 페이지 전환: `/#savant-generator`, `/#helper`, `/#pdfgen`(현재 비활성)
4. 품질 점검
   - 린트: `yarn lint` / 자동수정: `yarn lint:fix`
   - 포맷: `yarn format`
5. 빌드/프리뷰
   - 빌드: `yarn build`
   - 프리뷰: `yarn preview`
6. 배포(GitHub Pages)
   - `yarn deploy` (dist를 `gh-pages` 브랜치로 푸시)

### 3) 디렉터리/핵심 파일 지도

- `index.html`: 엔트리 HTML (SEO 메타, 루트 `#root`)
- `src/main.tsx`: React 엔트리
- `src/App.tsx`: 해시 기반 경량 라우팅
  - 기본: 스크립트 목록
  - `#savant-generator`: 서번트 명제 생성기
  - `#helper`: 밤 순서/캐릭터 헬퍼
  - `#pdfgen`: PDF 생성기(현재 UI 연결 비활성)
- `public/scripts.json`: 노출 스크립트 메타 소스
- `src/components/ScriptList.tsx`: 스크립트 목록 페이지 루트
  - `ScriptCategory.tsx`, `ScriptCard.tsx`, `ScriptImage.tsx`, `ActionButtons.tsx`
  - 데이터 로딩/다운로드 유틸: `src/utils/ScriptUtils.tsx`
- `src/components/SavantProposition.tsx`: 서번트 명제 생성기 (문구 배열 유지)
- `src/components/helper/`:
  - `Helper.tsx`: 원격 JSON 스크립트 로드(ko_KR 경로), 라디ックス UI(Tabs/Select/Dialog)
  - `CharacterDialog.tsx`, `CharacterRow.tsx`: 캐릭터 상세/선택 UI
  - 도우미 상수: `src/constants/nightInfo.tsx`
- `src/assets/`: 이미지/폰트 등 정적 리소스
- 스타일: `src/index.css`, `tailwind.config.js`
- 번들 설정: `vite.config.ts`

### 4) 실행 흐름(요약)

- 초기 진입 시 `App.tsx`에서 `window.location.hash`를 읽어 페이지 결정
- 스크립트 페이지
  - `ScriptUtils.fetchScripts()` → `/scripts.json`을 fetch하여 카드 목록 렌더
  - 카드 내 액션: JSON 복사, JSON/PDF 다운로드, 공유 URL 복사(`https://botc-kr.github.io/#<scriptId>`)
  - 해시 `#<scriptId>`로 직접 진입 시 해당 카드까지 스무스 스크롤
- 서번트 페이지
  - 고정 문구 배열에서 무작위 선택, 아이콘 회전 애니메이션(`spin-slow`)
- 헬퍼 페이지
  - `Helper.tsx`의 `SCRIPTS` 상수 목록에서 선택 → 각 스크립트 원격 JSON 로드
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
- 헬퍼 스크립트 목록: `src/components/helper/Helper.tsx`의 `SCRIPTS` 상수 수정(ko_KR JSON URL 사용)
- 일반/밤 정보 프리셋: `src/constants/nightInfo.tsx` (필요 시 메시지/팀/선택수 조정)

### 7) PDF 생성기 상태

- `src/components/PDFGenerator.tsx`는 현재 주석 처리(비활성)
- 연결 재활성화 방법
  - `App.tsx`에서 `PDFGenerator` 주석 해제 및 `#pdfgen` 라우트 표시
  - jsPDF 폰트(`src/assets/fonts/*`) 및 이미지 리소스 경로 확인

### 8) 품질/컨벤션

- 린트: ESLint 9 + TypeScript ESLint, HTML ESLint
- 포맷: Prettier (`yarn format`)
- 타입: 가급적 `any` 지양, 명시적 함수 시그니처
- 네이밍: 의미 있는 전체 단어 사용(약어 지양)
- 제어 흐름: 가드 클로즈, 에러/엣지 우선 처리

### 9) 배포/정적 경로 주의

- Vite `base: '/'` 설정(루트 도메인 `botc-kr.github.io` 기준)
- 배포: `yarn deploy` → `dist`를 `gh-pages` 브랜치로 푸시
- 정적 자원: `public/` 경로는 루트(`/`) 기준 제공. 런타임 fetch는 절대경로(`/scripts.json`) 사용

### 10) 외부 의존/통신

- 기본 번역 리소스: `public/translations/assets` (로컬 정적 경로 `/translations/assets`)
- `normalizeTranslationUrl`은 과거 `https://raw.githubusercontent.com/wonhyo-e/botc-translations/...` URL을 상응하는 로컬 경로로 변환해 하위 호환을 지원합니다.
- 네트워크 장애 대비: JSON/PDF fetch 실패 시 경고 노출(`ScriptUtils`)
- 현재 Firebase 등 추가 백엔드는 사용하지 않음(의존은 있으나 미사용)

### 11) 알려진 사항/향후 작업

- 리액트 라우터 의존성은 있으나 해시 기반 수동 라우팅 사용 중(정식 라우팅 검토 가능)
- PDF 생성기 비활성 → UI/UX 확정 후 연결
- 오프라인 캐시/서비스워커(PWA) 검토 여지
- `scripts.json` 검증 스키마 도입 고려(JSON Schema)

### 12) 작업 플레이북(에이전트용)

일반 수정 시

1. 변경 의도 요약 후 대상 파일 열람
2. 관련 모듈/유틸 영향 범위 확인(`ScriptUtils`, `HeaderFooter`, 헬퍼 상수 등)
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

### 13) 변경이력(수기 업데이트)

- 2025-08-12: 최초 작성. 프로젝트 구조/데이터 흐름/작업 플레이북 정리.
- 2025-08-12: 리팩토링 1차
  - PageType 중앙화(`src/constants/pages.ts`), 해시 라우팅 유틸 추가(`src/constants/routes.ts`)
  - 컴포넌트 prop 타입 통일, alias import 표준화
  - 섹션 id 상수화(`src/constants/sections.ts`), 번역 리소스 URL 헬퍼 추가(`src/constants/urls.ts`)
  - `alert()` → `notify()`로 공통화(`src/lib/utils.js`), `ScriptUtils` 전반 적용
  - 중복 타입/미사용 props 제거(`src/types/types.tsx`)
- 2025-08-12: 리팩토링 2차
  - UI 상수 분리: `HEADER_OFFSET_PX`(`src/constants/ui.ts`)
  - 서번트 명제 상수 분리: `SAVANT_PROPOSITIONS`(`src/constants/savant.ts`)
  - 네트워크 안정성: `fetchWithRetry` 도입(`src/utils/fetchRetry.ts`) 및 `ScriptUtils` 적용

### 14) 라이선스/크레딧

- 번역물 라이선스: CC BY-NC 4.0 (README 참고)
- 원작: The Pandemonium Institute (Blood on the Clocktower)

### 15) 문의/피드백

- GitHub Issues 활용 권장
- 배포 페이지/저장소 링크: 헤더의 GitHub 아이콘 참조
