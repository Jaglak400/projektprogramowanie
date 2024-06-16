import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  hasAnyRole(roles: string[]): Observable<boolean> {
    return this.http.get<string[]>(`${this.API}/roles`).pipe(
      map(userRoles => roles.some(role => userRoles.includes(role)))
    );
  }
}
