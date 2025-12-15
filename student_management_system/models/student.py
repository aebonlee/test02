from datetime import datetime
from typing import List, Dict, Any
import json


class Student:
    def __init__(self, student_id: str, name: str, email: str = "", phone: str = ""):
        if not student_id or not name:
            raise ValueError("학번과 이름은 필수 입력 사항입니다.")
        
        self._student_id = student_id
        self._name = name
        self._email = email
        self._phone = phone
        self._created_at = datetime.now()
    
    @property
    def student_id(self) -> str:
        return self._student_id
    
    @property
    def name(self) -> str:
        return self._name
    
    @name.setter
    def name(self, value: str):
        if not value.strip():
            raise ValueError("이름은 비워둘 수 없습니다.")
        self._name = value
    
    @property
    def email(self) -> str:
        return self._email
    
    @email.setter
    def email(self, value: str):
        self._email = value
    
    @property
    def phone(self) -> str:
        return self._phone
    
    @phone.setter
    def phone(self, value: str):
        self._phone = value
    
    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'student_id': self._student_id,
            'name': self._name,
            'email': self._email,
            'phone': self._phone,
            'created_at': self._created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Student':
        student = cls(
            student_id=data['student_id'],
            name=data['name'],
            email=data.get('email', ''),
            phone=data.get('phone', '')
        )
        if 'created_at' in data:
            student._created_at = datetime.fromisoformat(data['created_at'])
        return student
    
    def __str__(self) -> str:
        return f"Student(ID: {self._student_id}, Name: {self._name})"
    
    def __repr__(self) -> str:
        return self.__str__()


class StudentManager:
    def __init__(self):
        self._students: List[Student] = []
    
    def add_student(self, student: Student) -> bool:
        if self.find_student_by_id(student.student_id):
            raise ValueError(f"학번 {student.student_id}는 이미 존재합니다.")
        
        self._students.append(student)
        return True
    
    def remove_student(self, student_id: str) -> bool:
        student = self.find_student_by_id(student_id)
        if student:
            self._students.remove(student)
            return True
        return False
    
    def find_student_by_id(self, student_id: str) -> Student:
        for student in self._students:
            if student.student_id == student_id:
                return student
        return None
    
    def find_students_by_name(self, name: str) -> List[Student]:
        return [student for student in self._students if name.lower() in student.name.lower()]
    
    def get_all_students(self) -> List[Student]:
        return self._students.copy()
    
    def update_student(self, student_id: str, name: str = None, email: str = None, phone: str = None) -> bool:
        student = self.find_student_by_id(student_id)
        if not student:
            return False
        
        if name is not None:
            student.name = name
        if email is not None:
            student.email = email
        if phone is not None:
            student.phone = phone
        
        return True
    
    def get_student_count(self) -> int:
        return len(self._students)
    
    def clear_all_students(self):
        self._students.clear()
    
    def to_dict(self) -> Dict[str, List[Dict[str, Any]]]:
        return {
            'students': [student.to_dict() for student in self._students]
        }
    
    def from_dict(self, data: Dict[str, List[Dict[str, Any]]]):
        self._students.clear()
        if 'students' in data:
            for student_data in data['students']:
                try:
                    student = Student.from_dict(student_data)
                    self._students.append(student)
                except Exception as e:
                    print(f"학생 데이터 로드 오류: {e}")