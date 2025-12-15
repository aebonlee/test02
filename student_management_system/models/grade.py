from datetime import datetime, date
from typing import List, Dict, Any, Optional
from enum import Enum


class GradeType(Enum):
    EXAM = "시험"
    ASSIGNMENT = "과제"
    QUIZ = "퀴즈"
    PROJECT = "프로젝트"
    PARTICIPATION = "참여도"


class Grade:
    def __init__(self, student_id: str, subject: str, grade_type: GradeType, 
                 score: float, max_score: float = 100.0, grade_date: date = None, 
                 description: str = ""):
        if not student_id or not subject:
            raise ValueError("학번과 과목명은 필수 입력 사항입니다.")
        
        if not (0 <= score <= max_score):
            raise ValueError(f"점수는 0 이상 {max_score} 이하여야 합니다.")
        
        self._student_id = student_id
        self._subject = subject
        self._grade_type = grade_type
        self._score = score
        self._max_score = max_score
        self._grade_date = grade_date or date.today()
        self._description = description
        self._created_at = datetime.now()
    
    @property
    def student_id(self) -> str:
        return self._student_id
    
    @property
    def subject(self) -> str:
        return self._subject
    
    @property
    def grade_type(self) -> GradeType:
        return self._grade_type
    
    @property
    def score(self) -> float:
        return self._score
    
    @score.setter
    def score(self, value: float):
        if not (0 <= value <= self._max_score):
            raise ValueError(f"점수는 0 이상 {self._max_score} 이하여야 합니다.")
        self._score = value
    
    @property
    def max_score(self) -> float:
        return self._max_score
    
    @property
    def grade_date(self) -> date:
        return self._grade_date
    
    @property
    def description(self) -> str:
        return self._description
    
    @description.setter
    def description(self, value: str):
        self._description = value
    
    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    @property
    def percentage(self) -> float:
        return (self._score / self._max_score) * 100 if self._max_score > 0 else 0
    
    @property
    def letter_grade(self) -> str:
        percentage = self.percentage
        if percentage >= 95:
            return "A+"
        elif percentage >= 90:
            return "A"
        elif percentage >= 85:
            return "B+"
        elif percentage >= 80:
            return "B"
        elif percentage >= 75:
            return "C+"
        elif percentage >= 70:
            return "C"
        elif percentage >= 65:
            return "D+"
        elif percentage >= 60:
            return "D"
        else:
            return "F"
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'student_id': self._student_id,
            'subject': self._subject,
            'grade_type': self._grade_type.value,
            'score': self._score,
            'max_score': self._max_score,
            'grade_date': self._grade_date.isoformat(),
            'description': self._description,
            'created_at': self._created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Grade':
        grade_type = GradeType(data['grade_type'])
        grade_date = date.fromisoformat(data['grade_date'])
        
        grade = cls(
            student_id=data['student_id'],
            subject=data['subject'],
            grade_type=grade_type,
            score=data['score'],
            max_score=data.get('max_score', 100.0),
            grade_date=grade_date,
            description=data.get('description', '')
        )
        
        if 'created_at' in data:
            grade._created_at = datetime.fromisoformat(data['created_at'])
        
        return grade
    
    def __str__(self) -> str:
        return f"Grade({self._student_id}, {self._subject}, {self._score}/{self._max_score})"


class GradeManager:
    def __init__(self):
        self._grades: List[Grade] = []
    
    def add_grade(self, grade: Grade) -> bool:
        self._grades.append(grade)
        return True
    
    def remove_grade(self, student_id: str, subject: str, grade_type: GradeType, 
                    grade_date: date) -> bool:
        grade = self.find_grade(student_id, subject, grade_type, grade_date)
        if grade:
            self._grades.remove(grade)
            return True
        return False
    
    def find_grade(self, student_id: str, subject: str, grade_type: GradeType, 
                   grade_date: date) -> Optional[Grade]:
        for grade in self._grades:
            if (grade.student_id == student_id and 
                grade.subject == subject and 
                grade.grade_type == grade_type and 
                grade.grade_date == grade_date):
                return grade
        return None
    
    def update_grade(self, student_id: str, subject: str, grade_type: GradeType, 
                    grade_date: date, new_score: float = None, 
                    new_description: str = None) -> bool:
        grade = self.find_grade(student_id, subject, grade_type, grade_date)
        if not grade:
            return False
        
        if new_score is not None:
            grade.score = new_score
        if new_description is not None:
            grade.description = new_description
        
        return True
    
    def get_student_grades(self, student_id: str) -> List[Grade]:
        return [grade for grade in self._grades if grade.student_id == student_id]
    
    def get_subject_grades(self, subject: str) -> List[Grade]:
        return [grade for grade in self._grades if grade.subject == subject]
    
    def get_student_subject_grades(self, student_id: str, subject: str) -> List[Grade]:
        return [grade for grade in self._grades 
                if grade.student_id == student_id and grade.subject == subject]
    
    def calculate_student_average(self, student_id: str, subject: str = None) -> float:
        if subject:
            grades = self.get_student_subject_grades(student_id, subject)
        else:
            grades = self.get_student_grades(student_id)
        
        if not grades:
            return 0.0
        
        total_percentage = sum(grade.percentage for grade in grades)
        return total_percentage / len(grades)
    
    def calculate_weighted_average(self, student_id: str, subject: str, 
                                 weights: Dict[GradeType, float]) -> float:
        grades = self.get_student_subject_grades(student_id, subject)
        if not grades:
            return 0.0
        
        total_weighted_score = 0.0
        total_weight = 0.0
        
        grade_by_type = {}
        for grade in grades:
            if grade.grade_type not in grade_by_type:
                grade_by_type[grade.grade_type] = []
            grade_by_type[grade.grade_type].append(grade)
        
        for grade_type, weight in weights.items():
            if grade_type in grade_by_type:
                type_grades = grade_by_type[grade_type]
                avg_percentage = sum(g.percentage for g in type_grades) / len(type_grades)
                total_weighted_score += avg_percentage * weight
                total_weight += weight
        
        return total_weighted_score / total_weight if total_weight > 0 else 0.0
    
    def get_grade_statistics(self, subject: str = None) -> Dict[str, float]:
        if subject:
            grades = self.get_subject_grades(subject)
        else:
            grades = self._grades
        
        if not grades:
            return {'count': 0, 'average': 0, 'min': 0, 'max': 0}
        
        percentages = [grade.percentage for grade in grades]
        
        return {
            'count': len(grades),
            'average': sum(percentages) / len(percentages),
            'min': min(percentages),
            'max': max(percentages)
        }
    
    def get_student_rank(self, student_id: str, subject: str) -> int:
        all_averages = []
        students = set(grade.student_id for grade in self.get_subject_grades(subject))
        
        for sid in students:
            avg = self.calculate_student_average(sid, subject)
            all_averages.append((sid, avg))
        
        all_averages.sort(key=lambda x: x[1], reverse=True)
        
        for rank, (sid, avg) in enumerate(all_averages, 1):
            if sid == student_id:
                return rank
        
        return len(all_averages) + 1
    
    def get_failing_students(self, subject: str, threshold: float = 60.0) -> List[str]:
        failing_students = []
        students = set(grade.student_id for grade in self.get_subject_grades(subject))
        
        for student_id in students:
            avg = self.calculate_student_average(student_id, subject)
            if avg < threshold:
                failing_students.append(student_id)
        
        return failing_students
    
    def get_all_grades(self) -> List[Grade]:
        return self._grades.copy()
    
    def get_subjects(self) -> List[str]:
        return list(set(grade.subject for grade in self._grades))
    
    def clear_all_grades(self):
        self._grades.clear()
    
    def clear_student_grades(self, student_id: str):
        self._grades = [grade for grade in self._grades if grade.student_id != student_id]
    
    def to_dict(self) -> Dict[str, List[Dict[str, Any]]]:
        return {
            'grades': [grade.to_dict() for grade in self._grades]
        }
    
    def from_dict(self, data: Dict[str, List[Dict[str, Any]]]):
        self._grades.clear()
        if 'grades' in data:
            for grade_data in data['grades']:
                try:
                    grade = Grade.from_dict(grade_data)
                    self._grades.append(grade)
                except Exception as e:
                    print(f"성적 데이터 로드 오류: {e}")