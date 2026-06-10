import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = `${environment.apiUrl}/game`;

  constructor(private http: HttpClient) {}

  getLevels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/levels`);
  }

  getLevel(id: number): Observable<any> {
    console.log('getLevels aangeroepen');
    return this.http.get<any>(`${this.apiUrl}/levels/${id}`);
  } 
}