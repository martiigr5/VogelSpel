import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private apiUrl = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) {}

  getMyProgress(): Observable<any[]> {
    return this.http.get<any[]>(`&{this.apiUrl}/me`);
  }

  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students`);
  }

  saveAnswer(sessionId: number, assignmentId: number, isCorrect: boolean, studentAnswer?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/answer`, {
      session_id: sessionId,
      assignment_id: assignmentId,
      is_correct: isCorrect,
      student_answer: studentAnswer
    });
  }

  startSession(levelId: number): Observable<any> {
    return this.http.post(`{$this.apiUrl}/session`, { level_id: levelId });
  }

  collectItem(sessionId: number, itemId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/collect`, {
      session_id: sessionId,
      item_id: itemId
    });
  }
}
