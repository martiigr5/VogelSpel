import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment.development";

export interface User {
    id: number;
    voornaam: string;
    achternaam: string;
    klas: string;
    email: string;
    role: 'student' | 'teacher';
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());

    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {}

    register(voornaam: string, achternaam: string, klas: string, email: string, password: string, role: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, { voornaam, achternaam, klas, email, password, role });
}
 
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
    );
}

logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
}

getToken(): string | null {
    return localStorage.getItem('token')
}

isLoggedIn(): boolean {
    return !!this.getToken();
}

isTeacher(): boolean {
    return this.currentUserSubject.value?.role === 'teacher';
}

isStudent(): boolean {
    return this.currentUserSubject.value?.role === 'student';
}

private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}
}