# 개발 가이드

## 프로젝트 설정 및 환경 구성

### 1. 개발 환경 요구사항
- **Python**: 3.7 이상
- **IDE**: VS Code, PyCharm 권장
- **Git**: 버전 관리
- **운영체제**: Windows 10/11, macOS, Linux

### 2. 프로젝트 클론 및 설정
```bash
# 프로젝트 클론
git clone [repository-url]
cd student_management_system

# 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 의존성 설치 (requirements.txt 있는 경우)
pip install -r requirements.txt
```

### 3. 프로젝트 실행
```bash
# 메인 애플리케이션 실행
python gui/main_window.py

# 또는 모듈로 실행
python -m gui.main_window
```

## 개발 워크플로우

### 1. 새로운 기능 개발 과정
```
1. 이슈/요구사항 분석
   ↓
2. 설계 및 계획 수립
   ↓
3. 브랜치 생성 (feature/기능명)
   ↓
4. 코딩 및 테스트
   ↓
5. 코드 리뷰
   ↓
6. 메인 브랜치 병합
   ↓
7. 배포 및 문서 업데이트
```

### 2. 코드 작성 순서
1. **모델 클래스** 먼저 구현
2. **비즈니스 로직** 구현
3. **GUI 컴포넌트** 구현
4. **통합 테스트** 수행
5. **문서화** 작업

### 3. 테스트 주도 개발 (TDD)
```python
# 1. 테스트 케이스 작성 (실패)
def test_student_creation():
    student = Student("20240001", "홍길동")
    assert student.student_id == "20240001"
    assert student.name == "홍길동"

# 2. 최소 구현 (통과)
class Student:
    def __init__(self, student_id, name):
        self.student_id = student_id
        self.name = name

# 3. 리팩토링 및 개선
class Student:
    def __init__(self, student_id: str, name: str):
        if not student_id:
            raise ValueError("학번은 필수입니다")
        self._student_id = student_id
        self._name = name
    
    @property
    def student_id(self) -> str:
        return self._student_id
```

## 클래스 설계 가이드

### 1. 모델 클래스 설계 패턴
```python
class ModelClass:
    """모델 클래스 템플릿"""
    
    def __init__(self, required_param: type, optional_param: type = None):
        """생성자에서 데이터 검증"""
        self._validate_input(required_param)
        self._required_param = required_param
        self._optional_param = optional_param
        self._created_at = datetime.now()
    
    @property
    def required_param(self) -> type:
        """읽기 전용 속성"""
        return self._required_param
    
    @property
    def optional_param(self) -> type:
        """읽기/쓰기 속성"""
        return self._optional_param
    
    @optional_param.setter
    def optional_param(self, value: type):
        """setter에서 데이터 검증"""
        self._validate_optional(value)
        self._optional_param = value
    
    def _validate_input(self, param: type):
        """입력 검증 메서드"""
        if not param:
            raise ValueError("필수 매개변수입니다")
    
    def to_dict(self) -> Dict[str, Any]:
        """직렬화 메서드"""
        return {
            'required_param': self._required_param,
            'optional_param': self._optional_param,
            'created_at': self._created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ModelClass':
        """역직렬화 메서드"""
        instance = cls(
            required_param=data['required_param'],
            optional_param=data.get('optional_param')
        )
        if 'created_at' in data:
            instance._created_at = datetime.fromisoformat(data['created_at'])
        return instance
```

### 2. 매니저 클래스 설계 패턴
```python
class ManagerClass:
    """매니저 클래스 템플릿"""
    
    def __init__(self):
        self._items: List[ModelClass] = []
    
    def add_item(self, item: ModelClass) -> bool:
        """아이템 추가"""
        if self._exists(item):
            raise ValueError("이미 존재하는 아이템입니다")
        self._items.append(item)
        return True
    
    def remove_item(self, identifier: str) -> bool:
        """아이템 삭제"""
        item = self.find_item(identifier)
        if item:
            self._items.remove(item)
            return True
        return False
    
    def find_item(self, identifier: str) -> Optional[ModelClass]:
        """아이템 검색"""
        for item in self._items:
            if item.identifier == identifier:
                return item
        return None
    
    def get_all_items(self) -> List[ModelClass]:
        """모든 아이템 조회"""
        return self._items.copy()
    
    def _exists(self, item: ModelClass) -> bool:
        """중복 체크"""
        return self.find_item(item.identifier) is not None
```

## GUI 개발 가이드

### 1. Tkinter GUI 구조 패턴
```python
class GuiWindow:
    """GUI 윈도우 템플릿"""
    
    def __init__(self, parent=None, data_manager=None):
        self.parent = parent
        self.data_manager = data_manager
        
        # 윈도우 설정
        self.window = tk.Toplevel(parent) if parent else tk.Tk()
        self.setup_window()
        
        # UI 구성
        self.setup_styles()
        self.setup_widgets()
        self.setup_bindings()
        
        # 데이터 로드
        self.load_data()
    
    def setup_window(self):
        """윈도우 기본 설정"""
        self.window.title("윈도우 제목")
        self.window.geometry("800x600")
        self.window.transient(self.parent)
        self.window.grab_set()
    
    def setup_styles(self):
        """스타일 설정"""
        self.style = ttk.Style()
        self.style.configure('Custom.TButton', font=('맑은 고딕', 10))
    
    def setup_widgets(self):
        """위젯 배치"""
        # 메인 프레임
        self.main_frame = ttk.Frame(self.window, padding="10")
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        # 입력 영역
        self.create_input_section()
        
        # 버튼 영역
        self.create_button_section()
        
        # 리스트 영역
        self.create_list_section()
    
    def create_input_section(self):
        """입력 폼 생성"""
        input_frame = ttk.LabelFrame(self.main_frame, text="정보 입력", padding="10")
        input_frame.pack(fill=tk.X, pady=(0, 10))
        
        # 입력 필드들
        ttk.Label(input_frame, text="라벨:").grid(row=0, column=0, sticky="w")
        self.entry = ttk.Entry(input_frame, width=30)
        self.entry.grid(row=0, column=1, padx=(10, 0))
    
    def create_button_section(self):
        """버튼 영역 생성"""
        button_frame = ttk.Frame(self.main_frame)
        button_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Button(button_frame, text="추가", command=self.add_item).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(button_frame, text="수정", command=self.edit_item).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="삭제", command=self.delete_item).pack(side=tk.LEFT, padx=5)
    
    def create_list_section(self):
        """리스트 영역 생성"""
        # Treeview 위젯
        self.tree = ttk.Treeview(self.main_frame, columns=("col1", "col2"), show="headings")
        self.tree.heading("col1", text="컬럼 1")
        self.tree.heading("col2", text="컬럼 2")
        
        # 스크롤바
        scrollbar = ttk.Scrollbar(self.main_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        
        # 패킹
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    def setup_bindings(self):
        """이벤트 바인딩"""
        self.tree.bind("<Double-1>", self.on_item_double_click)
        self.window.bind("<Return>", lambda e: self.add_item())
        self.window.bind("<Escape>", lambda e: self.window.destroy())
    
    def load_data(self):
        """데이터 로드 및 화면 갱신"""
        pass
    
    def add_item(self):
        """아이템 추가"""
        pass
    
    def edit_item(self):
        """아이템 수정"""
        pass
    
    def delete_item(self):
        """아이템 삭제"""
        pass
    
    def on_item_double_click(self, event):
        """아이템 더블클릭 이벤트"""
        pass
```

### 2. 이벤트 처리 패턴
```python
def handle_user_action(self):
    """사용자 액션 처리 패턴"""
    try:
        # 1. 입력 데이터 수집
        data = self.collect_input_data()
        
        # 2. 데이터 검증
        self.validate_input(data)
        
        # 3. 비즈니스 로직 실행
        result = self.data_manager.perform_action(data)
        
        # 4. UI 업데이트
        self.update_ui(result)
        
        # 5. 성공 피드백
        self.show_success_message("작업이 완료되었습니다.")
        
    except ValueError as e:
        # 사용자 입력 오류
        self.show_error_message(f"입력 오류: {e}")
    except Exception as e:
        # 시스템 오류
        self.show_error_message(f"시스템 오류가 발생했습니다: {e}")
        logger.error(f"Unexpected error: {e}")
```

## 데이터 관리 가이드

### 1. JSON 데이터 구조 설계
```json
{
  "metadata": {
    "version": "1.0",
    "created_at": "2024-12-15T10:00:00",
    "last_modified": "2024-12-15T15:30:00"
  },
  "students": [
    {
      "student_id": "20240001",
      "name": "홍길동",
      "email": "hong@example.com",
      "phone": "010-1234-5678",
      "created_at": "2024-12-15T10:00:00"
    }
  ],
  "attendance_records": [...],
  "grades": [...]
}
```

### 2. 데이터 검증 체크리스트
- [ ] 필수 필드 존재 확인
- [ ] 데이터 타입 일치 확인
- [ ] 범위 및 형식 검증
- [ ] 외래 키 무결성 확인
- [ ] 중복 데이터 체크
- [ ] 비즈니스 규칙 준수 확인

### 3. 백업 및 복구 전략
```python
class BackupStrategy:
    """백업 전략"""
    
    def create_backup(self):
        """백업 생성"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = f"data/backups/backup_{timestamp}"
        
        # 1. 백업 폴더 생성
        os.makedirs(backup_path, exist_ok=True)
        
        # 2. 데이터 파일 복사
        self.copy_data_files(backup_path)
        
        # 3. 백업 메타데이터 저장
        self.save_backup_metadata(backup_path)
    
    def restore_backup(self, backup_id: str):
        """백업 복원"""
        backup_path = f"data/backups/backup_{backup_id}"
        
        # 1. 백업 존재 확인
        if not os.path.exists(backup_path):
            raise FileNotFoundError("백업 파일을 찾을 수 없습니다")
        
        # 2. 현재 데이터 백업 (안전장치)
        self.create_backup()
        
        # 3. 백업 데이터 복원
        self.restore_data_files(backup_path)
        
        # 4. 데이터 무결성 검증
        self.validate_restored_data()
```

## 오류 처리 및 디버깅

### 1. 로깅 설정
```python
import logging

# 로거 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# 사용 예시
logger.info("애플리케이션 시작")
logger.warning("경고 메시지")
logger.error("오류 발생", exc_info=True)
```

### 2. 예외 처리 베스트 프랙티스
```python
class CustomException(Exception):
    """사용자 정의 예외"""
    def __init__(self, message: str, error_code: str = None):
        super().__init__(message)
        self.error_code = error_code

def robust_operation():
    """견고한 작업 처리"""
    try:
        # 위험한 작업 수행
        result = perform_risky_operation()
        return result
    
    except FileNotFoundError:
        logger.error("파일을 찾을 수 없습니다")
        raise CustomException("데이터 파일이 존재하지 않습니다", "FILE_NOT_FOUND")
    
    except PermissionError:
        logger.error("파일 접근 권한이 없습니다")
        raise CustomException("파일에 접근할 권한이 없습니다", "PERMISSION_DENIED")
    
    except json.JSONDecodeError as e:
        logger.error(f"JSON 파싱 오류: {e}")
        raise CustomException("데이터 형식이 올바르지 않습니다", "INVALID_FORMAT")
    
    except Exception as e:
        logger.error(f"예상치 못한 오류: {e}", exc_info=True)
        raise CustomException("시스템 오류가 발생했습니다", "SYSTEM_ERROR")
```

### 3. 디버깅 도구 활용
```python
import pdb

def debug_function():
    """디버깅이 필요한 함수"""
    data = get_some_data()
    
    # 브레이크포인트 설정
    pdb.set_trace()
    
    processed_data = process_data(data)
    return processed_data

# 또는 breakpoint() 사용 (Python 3.7+)
def debug_function_v2():
    data = get_some_data()
    breakpoint()  # 더 간단한 방법
    processed_data = process_data(data)
    return processed_data
```

## 성능 최적화 가이드

### 1. 메모리 관리
```python
import gc
from functools import lru_cache

class OptimizedManager:
    """최적화된 매니저 클래스"""
    
    def __init__(self):
        self._cache = {}
        self._max_cache_size = 1000
    
    @lru_cache(maxsize=128)
    def expensive_calculation(self, param):
        """비용이 큰 계산 캐싱"""
        # 복잡한 계산 수행
        return complex_calculation(param)
    
    def cleanup_cache(self):
        """캐시 정리"""
        if len(self._cache) > self._max_cache_size:
            # 오래된 캐시 항목 제거
            old_keys = list(self._cache.keys())[:100]
            for key in old_keys:
                del self._cache[key]
        
        # 가비지 컬렉션 수행
        gc.collect()
```

### 2. 비동기 처리
```python
import threading
from concurrent.futures import ThreadPoolExecutor

def heavy_operation_with_progress(items, callback):
    """진행률을 보여주는 무거운 작업"""
    total = len(items)
    
    def process_item(item, index):
        result = heavy_process(item)
        progress = (index + 1) / total * 100
        callback(progress, result)
        return result
    
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = [
            executor.submit(process_item, item, i) 
            for i, item in enumerate(items)
        ]
        
        results = [future.result() for future in futures]
        return results
```

## 배포 및 유지보수

### 1. 빌드 프로세스
```bash
# 1. 의존성 정리
pip freeze > requirements.txt

# 2. 실행 파일 생성 (PyInstaller 사용)
pip install pyinstaller
pyinstaller --windowed --onefile gui/main_window.py

# 3. 배포 패키지 생성
mkdir dist/student_management_system
cp -r data/ dist/student_management_system/
cp -r models/ dist/student_management_system/
cp -r gui/ dist/student_management_system/
```

### 2. 설치 가이드 작성
```markdown
# 설치 가이드

## 시스템 요구사항
- Python 3.7 이상
- Windows 10 이상 / macOS 10.14 이상 / Ubuntu 18.04 이상

## 설치 방법
1. Python 설치
2. 프로그램 다운로드
3. 의존성 설치: `pip install -r requirements.txt`
4. 실행: `python gui/main_window.py`

## 문제 해결
- 문제 1: 해결 방법 1
- 문제 2: 해결 방법 2
```

### 3. 업데이트 전략
- 시맨틱 버저닝 사용
- 변경 로그 유지
- 하위 호환성 고려
- 점진적 업데이트 제공