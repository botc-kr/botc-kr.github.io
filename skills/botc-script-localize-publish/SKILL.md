---
name: botc-script-localize-publish
description: Given a BotC script role list, generate Korean script assets via Elixir generators, add to Home and Helper, generate PDF, validate format, then commit and push.
---

# BotC Script Localize + Publish

이 스킬은 `botc-kr.github.io` 저장소에서 새 스크립트를 한글화하고 배포 가능한 상태까지 한 번에 처리할 때 사용한다.

## Use When

- 사용자가 영어 스크립트(역할 ID 목록)를 주고 한글화 생성까지 요청할 때
- 홈 스크립트 목록(`public/scripts.json`)과 Helper 목록(`src/features/helper/scripts.ts`) 반영이 함께 필요할 때
- PDF 생성, 커밋, 푸시까지 한 번에 끝내야 할 때

## Non-Negotiables

- 역할 순서는 사용자 입력 순서를 그대로 유지한다.
- 캐릭터 설명/데이터를 수작업으로 작성하지 않는다. 반드시 Elixir 기반 제너레이터를 실행한다.
- `translations-tooling/assets/json/en_GB.json`에 없는 역할은 키를 추가하고 빈 값으로 우선 등록한다.
- 아이콘 경로는 상대경로가 아닌 절대 URL이어야 하며, 제너레이터 결과를 따른다.
- Helper 포맷 검증 실패(`스크립트 데이터 형식이 올바르지 않습니다`)가 나면 배포하지 않는다.

## Required Files To Touch

- `translations-tooling/assets/script_definitions/<script_id>.json`
- `translations-tooling/assets/csv/scripts.csv`
- `src/features/helper/scripts.ts`
- `public/scripts.json` (생성 결과)
- `translations-tooling/assets/scripts/ko_KR/<script_id>.json` (생성 결과)
- `public/translations/assets/scripts/ko_KR/<script_id>.json`
- `translations-tooling/assets/pdf/ko_KR/<script_id>.pdf` (생성 결과)
- `public/translations/assets/pdf/ko_KR/<script_id>.pdf`

## Workflow

1. `script_definition` 생성/수정
- 경로: `translations-tooling/assets/script_definitions/<script_id>.json`
- 형식:
```json
{
  "meta": { "name": "<English Script Name>", "author": "<Author>" },
  "roles": ["role_a", "role_b", "role_c"]
}
```

2. 스크립트 메타 등록
- `translations-tooling/assets/csv/scripts.csv`에 행 추가
- `id`, `name_ko`, `json_path`, `pdf_path`를 정확히 채운다.

3. Helper 목록 등록
- `src/features/helper/scripts.ts`에 `createHelperScript('<script_id>', '<Korean Name>')` 추가

4. 누락 역할 보강 (`en_GB.json`)
- `translations-tooling/assets/json/en_GB.json`에 없는 역할 ID가 있으면 placeholder 객체를 추가한다.
- 이후 한글 역할 JSON 생성:
```bash
cd translations-tooling
mix run generate_json_from_csv.exs
```

5. Elixir 스크립트 제너레이터 실행
```bash
cd translations-tooling
mix run generate_scripts.exs
```

6. 런타임 자산 동기화
```bash
cp translations-tooling/assets/scripts/ko_KR/<script_id>.json public/translations/assets/scripts/ko_KR/<script_id>.json
```

7. 홈 목록 JSON 재생성
```bash
python3 translations-tooling/generate_public_scripts_json_from_csv.py
```

8. PDF 생성 및 동기화
```bash
cd translations-tooling
.venv-pdf/bin/python -m pdf_gen.main assets/scripts/ko_KR/<script_id>.json -o assets/pdf/ko_KR/<script_id>.pdf
cd ..
cp translations-tooling/assets/pdf/ko_KR/<script_id>.pdf public/translations/assets/pdf/ko_KR/<script_id>.pdf
```

9. Helper 포맷 검증
- 빈 `team` 값이 있으면 Helper 타입가드에서 실패한다.
- 점검 명령:
```bash
jq -r '.[] | select(.id != "_meta") | select((.team != null) and ((.team | IN("townsfolk","outsider","minion","demon","traveler","info")) | not)) | "\(.id)\t\(.team)"' public/translations/assets/scripts/ko_KR/<script_id>.json
```
- 출력이 있으면 수정 후 5~9 반복.

10. 역할 순서 검증
```bash
jq -r '.roles[]' translations-tooling/assets/script_definitions/<script_id>.json
jq -r '.[] | select(.id != "_meta") | .id | sub("^ko_KR_"; "")' public/translations/assets/scripts/ko_KR/<script_id>.json
```
- 두 결과가 동일 순서여야 한다.

11. 빌드 확인 (권장)
```bash
yarn build
```

12. 커밋 & 푸시
```bash
git add <changed-files>
git commit -m "feat: add <script_id> korean script pipeline assets"
git push origin main
```

## Failure Playbook

- Helper에서 `스크립트 데이터 형식이 올바르지 않습니다`
  - 원인 1: `team: ""` 같은 invalid team
  - 원인 2: 필수 필드 타입 불일치(`name`, `image`, `firstNight`, `otherNight`, `ability`)
  - 조치: 해당 역할 보정 또는 `script_definition`에서 제외 후 재생성

- PDF 생성 시 traveler 경고
  - 현재 PDF 파이프라인은 `traveler`를 테이블 팀으로 쓰지 않을 수 있다.
  - 경고만 있는지 확인하고, 필요 시 PDF 규칙 별도 조정.
