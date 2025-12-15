import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from datetime import datetime
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.data_manager import DataManager


class MainWindow:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("학생 출결·성적 관리 시스템 v1.0")
        self.root.geometry("1200x800")
        self.root.state('zoomed') if sys.platform == 'win32' else self.root.attributes('-zoomed', True)
        
        self.data_manager = DataManager()
        
        self.setup_styles()
        self.setup_menu()
        self.setup_main_frame()
        self.setup_status_bar()
        self.update_status()
    
    def setup_styles(self):
        style = ttk.Style()
        style.theme_use('clam')
        
        style.configure('Title.TLabel', font=('맑은 고딕', 16, 'bold'))
        style.configure('Subtitle.TLabel', font=('맑은 고딕', 12, 'bold'))
        style.configure('Header.TFrame', relief='raised', borderwidth=2)
        style.configure('Main.TButton', font=('맑은 고딕', 11), padding=10)
    
    def setup_menu(self):
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="파일", menu=file_menu)
        file_menu.add_command(label="데이터 저장", command=self.save_all_data, accelerator="Ctrl+S")
        file_menu.add_command(label="데이터 불러오기", command=self.load_all_data, accelerator="Ctrl+O")
        file_menu.add_separator()
        file_menu.add_command(label="데이터 내보내기", command=self.export_data)
        file_menu.add_command(label="데이터 가져오기", command=self.import_data)
        file_menu.add_separator()
        file_menu.add_command(label="백업 생성", command=self.create_backup)
        file_menu.add_command(label="백업 복원", command=self.restore_backup)
        file_menu.add_separator()
        file_menu.add_command(label="종료", command=self.on_closing, accelerator="Alt+F4")
        
        system_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="시스템", menu=system_menu)
        system_menu.add_command(label="시스템 정보", command=self.show_system_info)
        system_menu.add_command(label="데이터 무결성 검사", command=self.check_data_integrity)
        system_menu.add_command(label="전체 데이터 삭제", command=self.clear_all_data)
        
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="도움말", menu=help_menu)
        help_menu.add_command(label="사용법", command=self.show_help)
        help_menu.add_command(label="정보", command=self.show_about)
        
        self.root.bind('<Control-s>', lambda e: self.save_all_data())
        self.root.bind('<Control-o>', lambda e: self.load_all_data())
    
    def setup_main_frame(self):
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        header_frame = ttk.Frame(main_frame, style='Header.TFrame', padding="20")
        header_frame.pack(fill=tk.X, pady=(0, 20))
        
        title_label = ttk.Label(header_frame, text="학생 출결·성적 관리 시스템", 
                               style='Title.TLabel')
        title_label.pack()
        
        subtitle_label = ttk.Label(header_frame, text="학생 정보, 출결, 성적을 통합 관리합니다", 
                                  style='Subtitle.TLabel')
        subtitle_label.pack(pady=(5, 0))
        
        content_frame = ttk.Frame(main_frame)
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        buttons_frame = ttk.Frame(content_frame)
        buttons_frame.pack(expand=True)
        
        self.create_main_buttons(buttons_frame)
        
        info_frame = ttk.LabelFrame(content_frame, text="시스템 정보", padding="10")
        info_frame.pack(fill=tk.X, pady=(20, 0))
        
        self.info_text = tk.Text(info_frame, height=8, width=80, wrap=tk.WORD, 
                                state=tk.DISABLED, bg='#f0f0f0')
        self.info_text.pack(fill=tk.BOTH, expand=True)
        
        scrollbar = ttk.Scrollbar(info_frame, orient=tk.VERTICAL, command=self.info_text.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.info_text.config(yscrollcommand=scrollbar.set)
    
    def create_main_buttons(self, parent):
        button_configs = [
            ("👥 학생 관리", "학생 정보 등록, 수정, 삭제", self.open_student_management, '#4CAF50'),
            ("📅 출결 관리", "출석, 지각, 결석 등 출결 현황 관리", self.open_attendance_management, '#2196F3'),
            ("📊 성적 관리", "시험, 과제, 프로젝트 성적 관리", self.open_grade_management, '#FF9800'),
        ]
        
        for i, (title, desc, command, color) in enumerate(button_configs):
            row = i // 2
            col = i % 2
            
            button_frame = ttk.Frame(parent, relief='raised', borderwidth=1, padding="20")
            button_frame.grid(row=row, column=col, padx=10, pady=10, sticky='nsew')
            
            parent.grid_columnconfigure(col, weight=1)
            parent.grid_rowconfigure(row, weight=1)
            
            title_label = ttk.Label(button_frame, text=title, font=('맑은 고딕', 14, 'bold'))
            title_label.pack()
            
            desc_label = ttk.Label(button_frame, text=desc, font=('맑은 고딕', 10))
            desc_label.pack(pady=(5, 15))
            
            main_button = ttk.Button(button_frame, text="열기", style='Main.TButton', 
                                   command=command)
            main_button.pack()
    
    def setup_status_bar(self):
        self.status_frame = ttk.Frame(self.root)
        self.status_frame.pack(side=tk.BOTTOM, fill=tk.X)
        
        self.status_label = ttk.Label(self.status_frame, text="시스템 준비", 
                                     relief=tk.SUNKEN, anchor=tk.W, padding="5")
        self.status_label.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        self.time_label = ttk.Label(self.status_frame, relief=tk.SUNKEN, anchor=tk.E, padding="5")
        self.time_label.pack(side=tk.RIGHT)
        
        self.update_time()
    
    def update_time(self):
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.time_label.config(text=current_time)
        self.root.after(1000, self.update_time)
    
    def update_status(self, message="시스템 준비"):
        self.status_label.config(text=message)
        self.update_system_info()
    
    def update_system_info(self):
        try:
            info = self.data_manager.get_system_info()
            
            info_text = f"""📊 시스템 현황 (업데이트: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')})
─────────────────────────────────────────────────────
👥 등록 학생 수: {info['students_count']}명
📅 출결 기록 수: {info['attendance_records']}건
📊 성적 기록 수: {info['grade_records']}건
📚 등록 과목 수: {len(info['subjects'])}개

📂 데이터 저장 위치: {info['data_folder']}

📚 등록된 과목:
{', '.join(info['subjects']) if info['subjects'] else '등록된 과목 없음'}
"""
            
            self.info_text.config(state=tk.NORMAL)
            self.info_text.delete(1.0, tk.END)
            self.info_text.insert(tk.END, info_text)
            self.info_text.config(state=tk.DISABLED)
        except Exception as e:
            print(f"시스템 정보 업데이트 오류: {e}")
    
    def open_student_management(self):
        try:
            from .student_gui import StudentManagementWindow
            student_window = StudentManagementWindow(self.root, self.data_manager)
            student_window.window.grab_set()
        except ImportError as e:
            messagebox.showerror("오류", f"학생 관리 모듈을 불러올 수 없습니다: {e}")
    
    def open_attendance_management(self):
        try:
            from .attendance_gui import AttendanceManagementWindow
            attendance_window = AttendanceManagementWindow(self.root, self.data_manager)
            attendance_window.window.grab_set()
        except ImportError as e:
            messagebox.showerror("오류", f"출결 관리 모듈을 불러올 수 없습니다: {e}")
    
    def open_grade_management(self):
        try:
            from .grade_gui import GradeManagementWindow
            grade_window = GradeManagementWindow(self.root, self.data_manager)
            grade_window.window.grab_set()
        except ImportError as e:
            messagebox.showerror("오류", f"성적 관리 모듈을 불러올 수 없습니다: {e}")
    
    def save_all_data(self):
        try:
            results = self.data_manager.save_all_data()
            if all(results.values()):
                self.update_status("모든 데이터가 저장되었습니다")
                messagebox.showinfo("성공", "모든 데이터가 성공적으로 저장되었습니다.")
            else:
                failed = [key for key, value in results.items() if not value]
                messagebox.showwarning("경고", f"일부 데이터 저장 실패: {', '.join(failed)}")
        except Exception as e:
            messagebox.showerror("오류", f"데이터 저장 중 오류가 발생했습니다: {e}")
    
    def load_all_data(self):
        try:
            results = self.data_manager.load_all_data()
            if all(results.values()):
                self.update_status("모든 데이터가 로드되었습니다")
                messagebox.showinfo("성공", "모든 데이터가 성공적으로 로드되었습니다.")
            else:
                failed = [key for key, value in results.items() if not value]
                messagebox.showwarning("경고", f"일부 데이터 로드 실패: {', '.join(failed)}")
        except Exception as e:
            messagebox.showerror("오류", f"데이터 로드 중 오류가 발생했습니다: {e}")
    
    def export_data(self):
        try:
            filename = filedialog.asksaveasfilename(
                title="데이터 내보내기",
                defaultextension=".json",
                filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
            )
            
            if filename:
                if self.data_manager.export_data_to_json(filename):
                    messagebox.showinfo("성공", f"데이터가 성공적으로 내보내졌습니다:\n{filename}")
                else:
                    messagebox.showerror("오류", "데이터 내보내기에 실패했습니다.")
        except Exception as e:
            messagebox.showerror("오류", f"데이터 내보내기 중 오류가 발생했습니다: {e}")
    
    def import_data(self):
        try:
            filename = filedialog.askopenfilename(
                title="데이터 가져오기",
                filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
            )
            
            if filename:
                result = messagebox.askyesno("확인", "기존 데이터가 덮어쓰여집니다. 계속하시겠습니까?")
                if result:
                    if self.data_manager.import_data_from_json(filename):
                        self.update_status("데이터 가져오기 완료")
                        messagebox.showinfo("성공", "데이터가 성공적으로 가져와졌습니다.")
                    else:
                        messagebox.showerror("오류", "데이터 가져오기에 실패했습니다.")
        except Exception as e:
            messagebox.showerror("오류", f"데이터 가져오기 중 오류가 발생했습니다: {e}")
    
    def create_backup(self):
        try:
            if self.data_manager.create_backup():
                messagebox.showinfo("성공", "백업이 성공적으로 생성되었습니다.")
                self.update_status("백업 생성 완료")
            else:
                messagebox.showerror("오류", "백업 생성에 실패했습니다.")
        except Exception as e:
            messagebox.showerror("오류", f"백업 생성 중 오류가 발생했습니다: {e}")
    
    def restore_backup(self):
        try:
            backups = self.data_manager.get_backup_list()
            if not backups:
                messagebox.showinfo("정보", "복원 가능한 백업이 없습니다.")
                return
            
            backup_window = tk.Toplevel(self.root)
            backup_window.title("백업 복원")
            backup_window.geometry("400x300")
            backup_window.transient(self.root)
            backup_window.grab_set()
            
            ttk.Label(backup_window, text="복원할 백업을 선택하세요:", 
                     font=('맑은 고딕', 12)).pack(pady=10)
            
            listbox = tk.Listbox(backup_window, font=('맑은 고딕', 10))
            for backup in backups:
                listbox.insert(tk.END, backup)
            listbox.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
            
            button_frame = ttk.Frame(backup_window)
            button_frame.pack(pady=10)
            
            def restore_selected():
                selection = listbox.curselection()
                if selection:
                    backup_timestamp = backups[selection[0]]
                    if self.data_manager.restore_backup(backup_timestamp):
                        messagebox.showinfo("성공", "백업이 성공적으로 복원되었습니다.")
                        self.update_status("백업 복원 완료")
                        backup_window.destroy()
                    else:
                        messagebox.showerror("오류", "백업 복원에 실패했습니다.")
                else:
                    messagebox.showwarning("경고", "복원할 백업을 선택해주세요.")
            
            ttk.Button(button_frame, text="복원", command=restore_selected).pack(side=tk.LEFT, padx=5)
            ttk.Button(button_frame, text="취소", command=backup_window.destroy).pack(side=tk.LEFT, padx=5)
            
        except Exception as e:
            messagebox.showerror("오류", f"백업 복원 중 오류가 발생했습니다: {e}")
    
    def show_system_info(self):
        try:
            info = self.data_manager.get_system_info()
            info_window = tk.Toplevel(self.root)
            info_window.title("시스템 정보")
            info_window.geometry("600x500")
            info_window.transient(self.root)
            
            text_area = tk.Text(info_window, wrap=tk.WORD, font=('Consolas', 10))
            scrollbar = ttk.Scrollbar(info_window, orient=tk.VERTICAL, command=text_area.yview)
            text_area.config(yscrollcommand=scrollbar.set)
            
            text_area.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(10, 0), pady=10)
            scrollbar.pack(side=tk.RIGHT, fill=tk.Y, padx=(0, 10), pady=10)
            
            info_text = f"""시스템 정보
{'='*50}
등록 학생 수: {info['students_count']}명
출결 기록 수: {info['attendance_records']}건
성적 기록 수: {info['grade_records']}건
등록 과목 수: {len(info['subjects'])}개

데이터 저장 위치: {info['data_folder']}
마지막 업데이트: {info['last_update']}

등록된 과목:
{chr(10).join(info['subjects']) if info['subjects'] else '등록된 과목 없음'}
"""
            
            text_area.insert(tk.END, info_text)
            text_area.config(state=tk.DISABLED)
        except Exception as e:
            messagebox.showerror("오류", f"시스템 정보 조회 중 오류가 발생했습니다: {e}")
    
    def check_data_integrity(self):
        try:
            issues = self.data_manager.validate_data_integrity()
            
            if not any(issues.values()):
                messagebox.showinfo("데이터 무결성 검사", "데이터에 문제가 없습니다.")
                return
            
            issue_window = tk.Toplevel(self.root)
            issue_window.title("데이터 무결성 검사 결과")
            issue_window.geometry("600x400")
            issue_window.transient(self.root)
            
            text_area = tk.Text(issue_window, wrap=tk.WORD, font=('맑은 고딕', 10))
            scrollbar = ttk.Scrollbar(issue_window, orient=tk.VERTICAL, command=text_area.yview)
            text_area.config(yscrollcommand=scrollbar.set)
            
            text_area.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(10, 0), pady=10)
            scrollbar.pack(side=tk.RIGHT, fill=tk.Y, padx=(0, 10), pady=10)
            
            issue_text = "데이터 무결성 검사 결과\n" + "="*30 + "\n\n"
            
            if issues['orphaned_attendance']:
                issue_text += "🔶 고아 출결 기록 (해당 학생이 삭제됨):\n"
                for issue in issues['orphaned_attendance']:
                    issue_text += f"  - {issue}\n"
                issue_text += "\n"
            
            if issues['orphaned_grades']:
                issue_text += "🔶 고아 성적 기록 (해당 학생이 삭제됨):\n"
                for issue in issues['orphaned_grades']:
                    issue_text += f"  - {issue}\n"
                issue_text += "\n"
            
            if issues['invalid_data']:
                issue_text += "🔴 데이터 오류:\n"
                for issue in issues['invalid_data']:
                    issue_text += f"  - {issue}\n"
            
            text_area.insert(tk.END, issue_text)
            text_area.config(state=tk.DISABLED)
            
        except Exception as e:
            messagebox.showerror("오류", f"데이터 무결성 검사 중 오류가 발생했습니다: {e}")
    
    def clear_all_data(self):
        try:
            result = messagebox.askyesnocancel(
                "전체 데이터 삭제", 
                "정말로 모든 데이터를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.\n\n백업을 먼저 생성하시겠습니까?"
            )
            
            if result is None:
                return
            elif result:
                self.create_backup()
            
            confirm = messagebox.askyesno(
                "최종 확인", 
                "모든 학생, 출결, 성적 데이터가 삭제됩니다.\n정말로 계속하시겠습니까?"
            )
            
            if confirm:
                if self.data_manager.clear_all_data():
                    self.update_status("모든 데이터 삭제 완료")
                    messagebox.showinfo("완료", "모든 데이터가 삭제되었습니다.")
                else:
                    messagebox.showerror("오류", "데이터 삭제에 실패했습니다.")
        except Exception as e:
            messagebox.showerror("오류", f"데이터 삭제 중 오류가 발생했습니다: {e}")
    
    def show_help(self):
        help_window = tk.Toplevel(self.root)
        help_window.title("사용법")
        help_window.geometry("700x500")
        help_window.transient(self.root)
        
        text_area = tk.Text(help_window, wrap=tk.WORD, font=('맑은 고딕', 10), 
                           state=tk.DISABLED, bg='#f8f8f8')
        scrollbar = ttk.Scrollbar(help_window, orient=tk.VERTICAL, command=text_area.yview)
        text_area.config(yscrollcommand=scrollbar.set)
        
        text_area.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(10, 0), pady=10)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y, padx=(0, 10), pady=10)
        
        help_text = """
학생 출결·성적 관리 시스템 사용법

1. 학생 관리
   - 새 학생 등록, 기존 학생 정보 수정/삭제
   - 학번은 중복될 수 없습니다
   - 학생 목록에서 더블클릭으로 상세 정보 확인

2. 출결 관리
   - 날짜별 출결 입력 및 수정
   - 출석/지각/결석/조퇴 상태 관리
   - 학생별 출석률 통계 확인

3. 성적 관리
   - 시험, 과제, 퀴즈, 프로젝트별 성적 입력
   - 학생별/과목별 성적 분석
   - 등급(A+, A, B+ 등) 자동 계산

4. 데이터 관리
   - 자동 저장/불러오기
   - 백업 생성 및 복원 기능
   - JSON 형식으로 데이터 내보내기/가져오기

5. 단축키
   - Ctrl+S: 데이터 저장
   - Ctrl+O: 데이터 불러오기
   - Alt+F4: 프로그램 종료

※ 중요한 데이터는 정기적으로 백업하시기 바랍니다.
"""
        
        text_area.config(state=tk.NORMAL)
        text_area.insert(tk.END, help_text)
        text_area.config(state=tk.DISABLED)
    
    def show_about(self):
        about_text = """학생 출결·성적 관리 시스템 v1.0

개발자: AI Assistant
개발 언어: Python 3.x
UI 프레임워크: Tkinter
데이터 저장: JSON

이 프로그램은 학교나 교육기관에서 학생들의 
출결과 성적을 효율적으로 관리할 수 있도록 
개발된 통합 관리 시스템입니다.

© 2024 All Rights Reserved"""
        
        messagebox.showinfo("정보", about_text)
    
    def on_closing(self):
        if messagebox.askokcancel("종료", "프로그램을 종료하시겠습니까?\n변경사항이 자동으로 저장됩니다."):
            try:
                self.data_manager.save_all_data()
                self.root.destroy()
            except Exception as e:
                print(f"종료 시 저장 오류: {e}")
                self.root.destroy()
    
    def run(self):
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        self.root.mainloop()


if __name__ == "__main__":
    app = MainWindow()
    app.run()