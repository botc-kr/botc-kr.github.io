# PDF Generator - Refactored Architecture

이 프로젝트는 Blood on the Clocktower 스크립트를 한국어 PDF로 생성하는 모듈화된 시스템입니다.

## 🏗️ 아키텍처 개선사항

### 1. 단일 책임 원칙 (Single Responsibility Principle)

- **PDFGenerator**: 전체 PDF 생성 프로세스 조율
- **DataProcessor**: 데이터 검증 및 처리
- **TableBuilder**: 테이블 생성 로직
- **FontManager**: 폰트 등록 및 관리
- **ImageHandler**: 이미지 처리 및 캐싱
- **FooterHandler**: 푸터 생성

### 2. 의존성 주입 (Dependency Injection)

각 컴포넌트는 생성자를 통해 의존성을 주입받아 테스트 가능성과 유연성을 향상시켰습니다.

### 3. 타입 안전성 (Type Safety)

- `dataclass`를 사용한 명확한 데이터 모델
- `Enum`을 사용한 팀 타입 정의
- 구체적인 타입 힌트 적용

### 4. 에러 처리 (Error Handling)

- 커스텀 예외 클래스 정의
- 계층화된 예외 처리
- 상세한 로깅

### 5. 설정 분리 (Configuration Separation)

- 상수들을 별도 파일로 분리
- 설정값의 중앙화된 관리

## 📁 파일 구조

```
pdf_gen/
├── __init__.py              # 모듈 export
├── pdf_generator.py         # 메인 PDF 생성기
├── constants.py             # 상수 정의
├── exceptions.py            # 커스텀 예외 클래스
├── models.py                # 데이터 모델
├── config.py                # 설정 클래스
├── data_processor.py        # 데이터 처리 로직
├── table_builder.py         # 테이블 생성 로직
├── footer_handler.py        # 푸터 처리 로직
├── styles.py                # 스타일 관리
├── image_handler.py         # 이미지 처리
├── example_usage.py         # 사용 예제
└── README.md               # 이 파일
```

## 🚀 사용법

### 기본 사용법

```python
from pdf_gen import PDFGenerator, FontManager, StyleManager, ImageHandler, FontConfig

# 컴포넌트 초기화
font_config = FontConfig()
font_manager = FontManager(font_config)
style_manager = StyleManager()
image_handler = ImageHandler()

# PDF 생성기 생성
pdf_generator = PDFGenerator(
    font_manager=font_manager,
    style_manager=style_manager,
    image_handler=image_handler
)

# PDF 생성
data = [...]  # 스크립트 데이터
pdf_generator.create_pdf(data, "output.pdf")
```

### 데이터 형식

```python
data = [
    {
        "id": "_meta",
        "name": "스크립트 이름",
        "author": "작성자"
    },
    {
        "id": "character_id",
        "name": "캐릭터 이름",
        "ability": "능력 설명",
        "team": "townsfolk|outsider|minion|demon",
        "image": "이미지 URL (선택사항)"
    }
]
```

## 🔧 주요 개선사항

### 1. 모듈화

- 각 기능이 독립적인 클래스로 분리
- 재사용 가능한 컴포넌트 설계
- 테스트 용이성 향상

### 2. 에러 처리

- 구체적인 예외 클래스
- 상세한 에러 메시지
- 로깅 시스템 통합

### 3. 타입 안전성

- `dataclass` 기반 데이터 모델
- `Enum`을 사용한 타입 정의
- 완전한 타입 힌트

### 4. 설정 관리

- 상수 분리
- 중앙화된 설정 관리
- 환경별 설정 가능

### 5. 성능 최적화

- 이미지 캐싱 시스템
- 효율적인 메모리 사용
- 압축 최적화

## 🧪 테스트 가능성

각 컴포넌트는 독립적으로 테스트할 수 있도록 설계되었습니다:

```python
# 예시: DataProcessor 테스트
from pdf_gen import DataProcessor

processor = DataProcessor()
result = processor.validate_and_process_data(test_data)
assert result.meta.name == "Expected Name"
```

## 📈 확장성

새로운 기능 추가가 용이한 구조:

1. **새로운 테이블 타입**: `TableBuilder`에 메서드 추가
2. **새로운 스타일**: `StyleManager`에 스타일 추가
3. **새로운 이미지 처리**: `ImageHandler` 확장
4. **새로운 데이터 타입**: `models.py`에 모델 추가

## 🔍 로깅

시스템은 상세한 로깅을 제공합니다:

```python
import logging
logging.basicConfig(level=logging.INFO)

# 로그 레벨별 정보 확인 가능
# INFO: 일반적인 작업 진행 상황
# WARNING: 경고 상황
# ERROR: 오류 상황
```

이 리팩토링을 통해 코드의 유지보수성, 테스트 가능성, 확장성이 크게 향상되었습니다.
