import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserResponse } from '../model/user-response';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  private api: string = "http://localhost:8081/api/user";

  constructor(private http: HttpClient) { }

  // Metoda do pobierania wszystkich użytkowników
  getAll(){
    return this.http.get<UserResponse[]>(this.api);
  }

  // Metoda do pobierania wszystkich użytkowników o określonej roli
  getAllByRole(role: string){
    return this.http.get<UserResponse[]>(this.api + "/role?name=" + role);
  }

  // Metoda do dodawania nowego użytkownika
  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.api}/add`, user);
  }

  // Metoda do usuwania użytkownika na podstawie identyfikatora
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  // Metoda do aktualizowania danych użytkownika na podstawie jego identyfikatora
  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${user.id}`, user);
  }
}
