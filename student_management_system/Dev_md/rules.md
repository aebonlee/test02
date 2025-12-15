# 개발 규칙 및 컨벤션

## 코딩 스타일 가이드

### 1. Python 코딩 스타일 (PEP 8 기반)

#### 네이밍 컨벤션
- **클래스명**: PascalCase (예: `StudentManager`)
- **함수명/변수명**: snake_case (예: `get_student_list`)
- **상수명**: UPPER_SNAKE_CASE (예: `MAX_STUDENTS`)
- **private 멤버**: 언더스코어 접두사 (예: `_student_id`)

#### 파일 및 폴더 구조
- **모듈명**: snake_case.py (예: `data_manager.py`)
- **패키지명**: lowercase (예: `models`, `gui`)
- **설정 파일**: UPPERCASE.확장자 (예: `README.md`)

### 2. 코드 작성 규칙

#### 함수/메서드 작성
```python
def function_name(param1: type, param2: type = default) -> return_type:
    """
    간단한 함수 설명
    
    Args:
        param1: 매개변수 1 설명
        param2: 매개변수 2 설명
        
    Returns:
        반환값 설명
        
    Raises:
        ExceptionType: 예외 발생 조건
    """
    # 함수 구현
    pass
```

#### 클래스 작성
```python
class ClassName:
    """클래스에 대한 설명"""
    
    def __init__(self, param: type):
        """생성자 설명"""
        self._private_var = param
    
    @property
    def public_property(self) -> type:
        """프로퍼티 설명"""
        return self._private_var
    
    def public_method(self) -> type:
        """공개 메서드 설명"""
        return self._private_method()
    
    def _private_method(self) -> type:
        """비공개 메서드 설명"""
        pass
```

### 3. 예외 처리 규칙

#### 기본 원칙
- 예상 가능한 모든 예외 상황 처리
- 사용자 친화적인 오류 메시지 제공
- 로그 기록을 통한 디버깅 지원

#### 예외 처리 패턴
```python
try:
    # 위험한 작업
    result = risky_operation()
    return result
except SpecificException as e:
    # 구체적인 예외 처리
    logger.error(f"구체적인 오류: {e}")
    raise CustomException("사용자 친화적 메시지")
except Exception as e:
    # 일반적인 예외 처리
    logger.error(f"예상치 못한 오류: {e}")
    raise
```

### 4. 데이터 검증 규칙

#### 입력 검증
- 모든 사용자 입력에 대한 검증 수행
- 타입 힌팅을 통한 명시적 타입 선언
- 범위 및 형식 검증

#### 검증 패턴
```python
def validate_student_id(student_id: str) -> bool:
    """학번 유효성 검증"""
    if not student_id:
        raise ValueError("학번은 필수 입력 사항입니다.")
    
    if not student_id.isdigit():
        raise ValueError("학번은 숫자여야 합니다.")
    
    if len(student_id) != 8:
        raise ValueError("학번은 8자리여야 합니다.")
    
    return True
```

## 아키텍처 규칙

### 1. 계층 구조
```
GUI Layer (Presentation)
    ↓
Business Logic Layer (Service)
    ↓
Data Access Layer (Model)
    ↓
Data Storage Layer (JSON/Database)
```

### 2. 모듈 분리 원칙
- **models/**: 데이터 모델 및 비즈니스 로직
- **gui/**: 사용자 인터페이스
- **data/**: 데이터 저장소
- **utils/**: 공통 유틸리티 (필요시)

### 3. 의존성 규칙
- 상위 계층이 하위 계층에 의존
- 하위 계층은 상위 계층에 의존하지 않음
- 순환 의존성 금지

## 데이터 관리 규칙

### 1. 데이터 저장 규칙
- JSON 형식으로 구조화된 데이터 저장
- UTF-8 인코딩 사용
- 들여쓰기 포함한 가독성 있는 형식

### 2. 백업 규칙
- 중요한 변경 전 자동 백업 수행
- 백업 파일명에 타임스탬프 포함
- 최대 백업 보관 개수 제한 (예: 10개)

### 3. 데이터 무결성 규칙
- 외래 키 제약 조건 확인
- 중복 데이터 방지
- 데이터 일관성 검증

## GUI 설계 규칙

### 1. 사용자 경험 (UX) 원칙
- 직관적이고 일관된 인터페이스
- 사용자 피드백 제공 (로딩, 성공, 오류)
- 접근성 고려 (키보드 내비게이션)

### 2. 레이아웃 규칙
- 논리적 그룹핑
- 적절한 여백과 간격
- 반응형 디자인 (창 크기 조절 대응)

### 3. 이벤트 처리 규칙
- 모든 사용자 액션에 대한 피드백
- 긴 작업에 대한 진행 표시
- 오류 상황에 대한 명확한 안내

## 테스트 규칙

### 1. 단위 테스트
- 각 클래스/메서드별 테스트 케이스 작성
- 정상 케이스와 예외 케이스 모두 테스트
- 테스트 커버리지 80% 이상 목표

### 2. 통합 테스트
- 모듈 간 상호작용 테스트
- 데이터 흐름 검증
- 사용자 시나리오 기반 테스트

### 3. 사용성 테스트
- 실제 사용 시나리오 기반
- 다양한 사용자 그룹 고려
- 피드백 수집 및 반영

## 버전 관리 규칙

### 1. 커밋 메시지 규칙
```
[타입]: 간단한 설명

상세 설명 (필요시)

- 변경 사항 1
- 변경 사항 2
```

#### 커밋 타입
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 도구, 설정 변경

### 2. 브랜치 전략
- `main`: 안정 버전
- `develop`: 개발 진행 브랜치
- `feature/기능명`: 기능별 개발 브랜치
- `hotfix/이슈명`: 긴급 수정 브랜치

### 3. 릴리즈 규칙
- 시맨틱 버저닝 (Semantic Versioning)
- `major.minor.patch` 형식
- 변경 내용에 따른 버전 증가

## 보안 규칙

### 1. 데이터 보안
- 중요한 정보 암호화
- 입력 데이터 검증 및 살균
- SQL 인젝션 등 공격 방지

### 2. 접근 제어
- 사용자 권한 관리
- 민감한 기능에 대한 접근 제한
- 세션 관리

### 3. 로깅 및 모니터링
- 중요한 작업에 대한 로그 기록
- 개인정보 로깅 금지
- 보안 이벤트 모니터링

## 성능 규칙

### 1. 효율성 원칙
- 불필요한 연산 최소화
- 메모리 사용량 최적화
- 반응 시간 단축

### 2. 확장성 고려
- 대용량 데이터 처리 고려
- 동시 사용자 지원
- 모듈화를 통한 확장 용이성

### 3. 리소스 관리
- 파일 핸들 적절히 닫기
- 메모리 누수 방지
- CPU 집약적 작업 최적화