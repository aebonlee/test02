import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
from .student import StudentManager
from .attendance import AttendanceManager
from .grade import GradeManager


class DataManager:
    def __init__(self, data_folder: str = "data"):
        self.data_folder = data_folder
        self.students_file = os.path.join(data_folder, "students.json")
        self.attendance_file = os.path.join(data_folder, "attendance.json")
        self.grades_file = os.path.join(data_folder, "grades.json")
        self.backup_folder = os.path.join(data_folder, "backups")
        
        self.student_manager = StudentManager()
        self.attendance_manager = AttendanceManager()
        self.grade_manager = GradeManager()
        
        self._ensure_data_folder()
        self.load_all_data()
    
    def _ensure_data_folder(self):
        os.makedirs(self.data_folder, exist_ok=True)
        os.makedirs(self.backup_folder, exist_ok=True)
    
    def save_students(self) -> bool:
        try:
            data = self.student_manager.to_dict()
            data['last_saved'] = datetime.now().isoformat()
            
            with open(self.students_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"학생 데이터 저장 오류: {e}")
            return False
    
    def load_students(self) -> bool:
        try:
            if not os.path.exists(self.students_file):
                return True
            
            with open(self.students_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.student_manager.from_dict(data)
            return True
        except Exception as e:
            print(f"학생 데이터 로드 오류: {e}")
            return False
    
    def save_attendance(self) -> bool:
        try:
            data = self.attendance_manager.to_dict()
            data['last_saved'] = datetime.now().isoformat()
            
            with open(self.attendance_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"출결 데이터 저장 오류: {e}")
            return False
    
    def load_attendance(self) -> bool:
        try:
            if not os.path.exists(self.attendance_file):
                return True
            
            with open(self.attendance_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.attendance_manager.from_dict(data)
            return True
        except Exception as e:
            print(f"출결 데이터 로드 오류: {e}")
            return False
    
    def save_grades(self) -> bool:
        try:
            data = self.grade_manager.to_dict()
            data['last_saved'] = datetime.now().isoformat()
            
            with open(self.grades_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"성적 데이터 저장 오류: {e}")
            return False
    
    def load_grades(self) -> bool:
        try:
            if not os.path.exists(self.grades_file):
                return True
            
            with open(self.grades_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.grade_manager.from_dict(data)
            return True
        except Exception as e:
            print(f"성적 데이터 로드 오류: {e}")
            return False
    
    def save_all_data(self) -> Dict[str, bool]:
        results = {
            'students': self.save_students(),
            'attendance': self.save_attendance(),
            'grades': self.save_grades()
        }
        return results
    
    def load_all_data(self) -> Dict[str, bool]:
        results = {
            'students': self.load_students(),
            'attendance': self.load_attendance(),
            'grades': self.load_grades()
        }
        return results
    
    def create_backup(self) -> bool:
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_subfolder = os.path.join(self.backup_folder, f"backup_{timestamp}")
            os.makedirs(backup_subfolder, exist_ok=True)
            
            import shutil
            
            files_to_backup = [
                (self.students_file, "students.json"),
                (self.attendance_file, "attendance.json"),
                (self.grades_file, "grades.json")
            ]
            
            for source_file, filename in files_to_backup:
                if os.path.exists(source_file):
                    dest_file = os.path.join(backup_subfolder, filename)
                    shutil.copy2(source_file, dest_file)
            
            return True
        except Exception as e:
            print(f"백업 생성 오류: {e}")
            return False
    
    def restore_backup(self, backup_timestamp: str) -> bool:
        try:
            backup_subfolder = os.path.join(self.backup_folder, f"backup_{backup_timestamp}")
            if not os.path.exists(backup_subfolder):
                return False
            
            import shutil
            
            files_to_restore = [
                ("students.json", self.students_file),
                ("attendance.json", self.attendance_file),
                ("grades.json", self.grades_file)
            ]
            
            for filename, dest_file in files_to_restore:
                source_file = os.path.join(backup_subfolder, filename)
                if os.path.exists(source_file):
                    shutil.copy2(source_file, dest_file)
            
            return self.load_all_data()['students'] and self.load_all_data()['attendance'] and self.load_all_data()['grades']
        except Exception as e:
            print(f"백업 복원 오류: {e}")
            return False
    
    def get_backup_list(self) -> list:
        try:
            backups = []
            if os.path.exists(self.backup_folder):
                for folder in os.listdir(self.backup_folder):
                    if folder.startswith("backup_"):
                        timestamp = folder[7:]  # "backup_" 제거
                        backups.append(timestamp)
            return sorted(backups, reverse=True)
        except Exception as e:
            print(f"백업 목록 조회 오류: {e}")
            return []
    
    def export_data_to_json(self, export_file: str) -> bool:
        try:
            export_data = {
                'export_date': datetime.now().isoformat(),
                'students': self.student_manager.to_dict(),
                'attendance': self.attendance_manager.to_dict(),
                'grades': self.grade_manager.to_dict()
            }
            
            with open(export_file, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"데이터 내보내기 오류: {e}")
            return False
    
    def import_data_from_json(self, import_file: str) -> bool:
        try:
            with open(import_file, 'r', encoding='utf-8') as f:
                import_data = json.load(f)
            
            if 'students' in import_data:
                self.student_manager.from_dict(import_data['students'])
            if 'attendance' in import_data:
                self.attendance_manager.from_dict(import_data['attendance'])
            if 'grades' in import_data:
                self.grade_manager.from_dict(import_data['grades'])
            
            return self.save_all_data()
        except Exception as e:
            print(f"데이터 가져오기 오류: {e}")
            return False
    
    def get_system_info(self) -> Dict[str, Any]:
        students_count = self.student_manager.get_student_count()
        attendance_count = len(self.attendance_manager.get_all_attendance())
        grades_count = len(self.grade_manager.get_all_grades())
        
        info = {
            'students_count': students_count,
            'attendance_records': attendance_count,
            'grade_records': grades_count,
            'subjects': self.grade_manager.get_subjects(),
            'data_folder': self.data_folder,
            'last_update': datetime.now().isoformat()
        }
        
        for file_path in [self.students_file, self.attendance_file, self.grades_file]:
            if os.path.exists(file_path):
                stat = os.stat(file_path)
                file_info = {
                    'size': stat.st_size,
                    'last_modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                }
                filename = os.path.basename(file_path)
                info[f'{filename}_info'] = file_info
        
        return info
    
    def clear_all_data(self) -> bool:
        try:
            self.student_manager.clear_all_students()
            self.attendance_manager.clear_all_attendance()
            self.grade_manager.clear_all_grades()
            
            return all(self.save_all_data().values())
        except Exception as e:
            print(f"전체 데이터 삭제 오류: {e}")
            return False
    
    def validate_data_integrity(self) -> Dict[str, list]:
        issues = {
            'orphaned_attendance': [],
            'orphaned_grades': [],
            'invalid_data': []
        }
        
        try:
            all_student_ids = {s.student_id for s in self.student_manager.get_all_students()}
            
            for attendance in self.attendance_manager.get_all_attendance():
                if attendance.student_id not in all_student_ids:
                    issues['orphaned_attendance'].append(f"학번 {attendance.student_id}의 출결 기록")
            
            for grade in self.grade_manager.get_all_grades():
                if grade.student_id not in all_student_ids:
                    issues['orphaned_grades'].append(f"학번 {grade.student_id}의 성적 기록")
        
        except Exception as e:
            issues['invalid_data'].append(f"데이터 무결성 검증 오류: {e}")
        
        return issues