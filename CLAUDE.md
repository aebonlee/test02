# 학생 출결·성적 관리 시스템 - Claude Code Project Documentation

## 프로젝트 개요

### 프로젝트명
학생 출결·성적 관리 시스템 v1.0

### 개발 목적
교육기관에서 학생들의 출결과 성적을 효율적으로 관리할 수 있는 통합 관리 시스템 구축

### 주요 기능
- 👥 학생 정보 관리 (등록, 수정, 삭제)
- 📅 출결 관리 (출석, 지각, 결석, 조퇴)
- 📊 성적 관리 (시험, 과제, 퀴즈, 프로젝트)
- 💾 데이터 백업/복원 기능
- 📈 통계 및 리포트 기능

## 기술 스택

### 언어 및 프레임워크
- **Language**: Python 3.x
- **GUI Framework**: Tkinter
- **Data Format**: JSON

### 핵심 라이브러리
- `tkinter` - GUI 구현
- `datetime` - 날짜/시간 처리
- `json` - 데이터 저장/로드
- `enum` - 열거형 정의
- `typing` - 타입 힌팅

## 프로젝트 구조

```
student_management_system/
├── models/
│   ├── __init__.py
│   ├── student.py          # 학생 클래스 및 관리자
│   ├── attendance.py       # 출결 클래스 및 관리자
│   ├── grade.py           # 성적 클래스 및 관리자
│   └── data_manager.py    # 데이터 관리 클래스
├── gui/
│   ├── __init__.py
│   ├── main_window.py     # 메인 GUI 창
│   ├── student_gui.py     # 학생 관리 GUI (예정)
│   ├── attendance_gui.py  # 출결 관리 GUI (예정)
│   └── grade_gui.py      # 성적 관리 GUI (예정)
├── data/                  # 데이터 저장 폴더
│   ├── students.json
│   ├── attendance.json
│   ├── grades.json
│   └── backups/          # 백업 폴더
└── Dev_md/               # 개발 문서 폴더
    ├── prompts.md
    ├── rules.md
    ├── guides.md
    ├── development_log.md
    └── evaluation_report.md
```

## 구현된 주요 클래스

### 1. Student 클래스 (`models/student.py`)
- **기능**: 학생 정보 관리
- **속성**: 학번, 이름, 이메일, 전화번호, 생성일시
- **주요 메서드**: 
  - `to_dict()`, `from_dict()` - 직렬화/역직렬화
  - 프로퍼티를 통한 데이터 검증

### 2. StudentManager 클래스
- **기능**: 학생 목록 관리
- **주요 메서드**:
  - `add_student()` - 학생 추가
  - `remove_student()` - 학생 삭제
  - `find_student_by_id()` - 학번으로 검색
  - `find_students_by_name()` - 이름으로 검색
  - `update_student()` - 학생 정보 수정

### 3. AttendanceRecord 클래스 (`models/attendance.py`)
- **기능**: 출결 기록 관리
- **속성**: 학번, 날짜, 출결 상태, 입실/퇴실 시간, 메모
- **출결 상태**: 출석, 결석, 지각, 조퇴 (AttendanceStatus enum)

### 4. AttendanceManager 클래스
- **기능**: 출결 기록 관리
- **주요 메서드**:
  - `add_attendance()` - 출결 기록 추가
  - `get_student_attendance_summary()` - 학생별 출결 요약
  - `get_attendance_rate()` - 출석률 계산
  - `mark_attendance_by_time()` - 시간 기반 출결 처리

### 5. Grade 클래스 (`models/grade.py`)
- **기능**: 성적 정보 관리
- **속성**: 학번, 과목, 성적 유형, 점수, 만점, 날짜, 설명
- **성적 유형**: 시험, 과제, 퀴즈, 프로젝트, 참여도 (GradeType enum)
- **자동 계산**: 백분율, 등급(A+~F)

### 6. GradeManager 클래스
- **기능**: 성적 관리
- **주요 메서드**:
  - `add_grade()` - 성적 추가
  - `calculate_student_average()` - 학생 평균 계산
  - `calculate_weighted_average()` - 가중평균 계산
  - `get_student_rank()` - 학생 순위 조회
  - `get_grade_statistics()` - 성적 통계

### 7. DataManager 클래스 (`models/data_manager.py`)
- **기능**: 전체 데이터 관리
- **주요 기능**:
  - JSON 파일 저장/로드
  - 백업 생성/복원
  - 데이터 내보내기/가져오기
  - 데이터 무결성 검증

### 8. MainWindow 클래스 (`gui/main_window.py`)
- **기능**: 메인 GUI 창
- **주요 특징**:
  - 직관적인 대시보드 인터페이스
  - 실시간 시스템 정보 표시
  - 통합 메뉴 시스템
  - 키보드 단축키 지원

## 개발 원칙

### 1. 객체 지향 설계 (OOP)
- 각 도메인별로 클래스 분리
- 캡슐화를 통한 데이터 보호
- 상속과 다형성 활용

### 2. 데이터 검증 및 예외 처리
- 입력 데이터 유효성 검증
- 적절한 예외 처리
- 사용자 친화적인 오류 메시지

### 3. 모듈화 및 재사용성
- 기능별 모듈 분리
- 느슨한 결합도 유지
- 코드 재사용성 극대화

### 4. 사용자 인터페이스 (UI/UX)
- 직관적인 GUI 설계
- 일관된 디자인 패턴
- 접근성 고려

## 실행 방법

### 요구사항
- Python 3.7 이상
- tkinter (Python 기본 패키지)

### 실행 명령
```bash
cd student_management_system
python gui/main_window.py
```

## 주요 기능 사용법

### 1. 학생 관리
- 메인 화면에서 "👥 학생 관리" 버튼 클릭
- 학생 등록/수정/삭제 기능 제공

### 2. 출결 관리
- 메인 화면에서 "📅 출결 관리" 버튼 클릭
- 날짜별 출결 입력 및 통계 확인

### 3. 성적 관리
- 메인 화면에서 "📊 성적 관리" 버튼 클릭
- 과목별/학생별 성적 입력 및 분석

### 4. 데이터 관리
- 파일 메뉴에서 백업/복원/내보내기/가져오기 기능 사용
- 자동 저장 기능 (Ctrl+S)

## 주요 단축키

- `Ctrl+S`: 데이터 저장
- `Ctrl+O`: 데이터 불러오기  
- `Alt+F4`: 프로그램 종료

## 데이터 저장 형식

### JSON 구조
```json
{
  "students": [...],
  "attendance_records": [...],
  "grades": [...],
  "last_saved": "ISO datetime"
}
```

## 향후 개발 계획

1. 학생/출결/성적 관리 GUI 완성
2. 고급 통계 및 리포트 기능 추가
3. 데이터베이스 연동 (SQLite)
4. 웹 인터페이스 개발
5. 다국어 지원

## 개발 히스토리

### v1.0 (2024-12-15)
- 기본 클래스 구조 설계 및 구현
- 메인 GUI 창 완성
- JSON 기반 데이터 저장/로드 구현
- 백업/복원 기능 구현

## 라이센스
MIT License

## 기여자
- AI Assistant (Claude) - 시스템 설계 및 구현