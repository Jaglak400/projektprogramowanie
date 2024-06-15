import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserResponse } from '../model/user-response';
import { LoginRequest } from '../model/login-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private api: string = "http://localhost:8080/api/auth/";

  constructor(private http: HttpClient) { }

  // Metoda do logowania użytkownika
  login(loginData: LoginRequest) : Observable<UserResponse>{
    // Wykonanie żądania POST na adres URL this.api + 'login' z danymi logowania i zwrócenie wyniku jako obserwable
    return this.http.post<UserResponse>(this.api + 'login', loginData);
  }

  // Metoda do wylogowania użytkownika
  logout(){
    return this.http.get(this.api + 'logout');
  }
}
