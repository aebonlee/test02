from datetime import datetime, date
from typing import List, Dict, Any, Optional
from enum import Enum


class AttendanceStatus(Enum):
    PRESENT = "출석"
    ABSENT = "결석"
    LATE = "지각"
    EARLY_LEAVE = "조퇴"


class AttendanceRecord:
    def __init__(self, student_id: str, date: date, status: AttendanceStatus, 
                 time_in: Optional[datetime] = None, time_out: Optional[datetime] = None, 
                 notes: str = ""):
        if not student_id:
            raise ValueError("학번은 필수 입력 사항입니다.")
        
        self._student_id = student_id
        self._date = date
        self._status = status
        self._time_in = time_in
        self._time_out = time_out
        self._notes = notes
        self._created_at = datetime.now()
    
    @property
    def student_id(self) -> str:
        return self._student_id
    
    @property
    def date(self) -> date:
        return self._date
    
    @property
    def status(self) -> AttendanceStatus:
        return self._status
    
    @status.setter
    def status(self, value: AttendanceStatus):
        self._status = value
    
    @property
    def time_in(self) -> Optional[datetime]:
        return self._time_in
    
    @time_in.setter
    def time_in(self, value: Optional[datetime]):
        self._time_in = value
    
    @property
    def time_out(self) -> Optional[datetime]:
        return self._time_out
    
    @time_out.setter
    def time_out(self, value: Optional[datetime]):
        self._time_out = value
    
    @property
    def notes(self) -> str:
        return self._notes
    
    @notes.setter
    def notes(self, value: str):
        self._notes = value
    
    @property
    def created_at(self) -> datetime:
        return self._created_at
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'student_id': self._student_id,
            'date': self._date.isoformat(),
            'status': self._status.value,
            'time_in': self._time_in.isoformat() if self._time_in else None,
            'time_out': self._time_out.isoformat() if self._time_out else None,
            'notes': self._notes,
            'created_at': self._created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AttendanceRecord':
        status = AttendanceStatus(data['status'])
        record_date = date.fromisoformat(data['date'])
        time_in = datetime.fromisoformat(data['time_in']) if data.get('time_in') else None
        time_out = datetime.fromisoformat(data['time_out']) if data.get('time_out') else None
        
        record = cls(
            student_id=data['student_id'],
            date=record_date,
            status=status,
            time_in=time_in,
            time_out=time_out,
            notes=data.get('notes', '')
        )
        
        if 'created_at' in data:
            record._created_at = datetime.fromisoformat(data['created_at'])
        
        return record
    
    def __str__(self) -> str:
        return f"AttendanceRecord({self._student_id}, {self._date}, {self._status.value})"


class AttendanceManager:
    def __init__(self):
        self._attendance_records: List[AttendanceRecord] = []
    
    def add_attendance(self, record: AttendanceRecord) -> bool:
        existing_record = self.find_attendance(record.student_id, record.date)
        if existing_record:
            raise ValueError(f"학번 {record.student_id}의 {record.date} 출결 기록이 이미 존재합니다.")
        
        self._attendance_records.append(record)
        return True
    
    def update_attendance(self, student_id: str, record_date: date, 
                         status: AttendanceStatus = None, time_in: datetime = None, 
                         time_out: datetime = None, notes: str = None) -> bool:
        record = self.find_attendance(student_id, record_date)
        if not record:
            return False
        
        if status is not None:
            record.status = status
        if time_in is not None:
            record.time_in = time_in
        if time_out is not None:
            record.time_out = time_out
        if notes is not None:
            record.notes = notes
        
        return True
    
    def remove_attendance(self, student_id: str, record_date: date) -> bool:
        record = self.find_attendance(student_id, record_date)
        if record:
            self._attendance_records.remove(record)
            return True
        return False
    
    def find_attendance(self, student_id: str, record_date: date) -> Optional[AttendanceRecord]:
        for record in self._attendance_records:
            if record.student_id == student_id and record.date == record_date:
                return record
        return None
    
    def get_student_attendance(self, student_id: str) -> List[AttendanceRecord]:
        return [record for record in self._attendance_records if record.student_id == student_id]
    
    def get_date_attendance(self, record_date: date) -> List[AttendanceRecord]:
        return [record for record in self._attendance_records if record.date == record_date]
    
    def get_attendance_by_period(self, start_date: date, end_date: date) -> List[AttendanceRecord]:
        return [record for record in self._attendance_records 
                if start_date <= record.date <= end_date]
    
    def get_student_attendance_summary(self, student_id: str) -> Dict[str, int]:
        records = self.get_student_attendance(student_id)
        summary = {status.value: 0 for status in AttendanceStatus}
        
        for record in records:
            summary[record.status.value] += 1
        
        return summary
    
    def get_attendance_rate(self, student_id: str) -> float:
        records = self.get_student_attendance(student_id)
        if not records:
            return 0.0
        
        present_count = sum(1 for record in records if record.status == AttendanceStatus.PRESENT)
        return (present_count / len(records)) * 100
    
    def mark_attendance_by_time(self, student_id: str, record_date: date, 
                               check_in_time: datetime, standard_time: datetime) -> AttendanceStatus:
        if check_in_time <= standard_time:
            status = AttendanceStatus.PRESENT
        else:
            status = AttendanceStatus.LATE
        
        existing_record = self.find_attendance(student_id, record_date)
        if existing_record:
            existing_record.status = status
            existing_record.time_in = check_in_time
        else:
            record = AttendanceRecord(student_id, record_date, status, time_in=check_in_time)
            self.add_attendance(record)
        
        return status
    
    def get_all_attendance(self) -> List[AttendanceRecord]:
        return self._attendance_records.copy()
    
    def clear_all_attendance(self):
        self._attendance_records.clear()
    
    def to_dict(self) -> Dict[str, List[Dict[str, Any]]]:
        return {
            'attendance_records': [record.to_dict() for record in self._attendance_records]
        }
    
    def from_dict(self, data: Dict[str, List[Dict[str, Any]]]):
        self._attendance_records.clear()
        if 'attendance_records' in data:
            for record_data in data['attendance_records']:
                try:
                    record = AttendanceRecord.from_dict(record_data)
                    self._attendance_records.append(record)
                except Exception as e:
                    print(f"출결 데이터 로드 오류: {e}")