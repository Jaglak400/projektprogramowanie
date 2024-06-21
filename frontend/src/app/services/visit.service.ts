import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VisitResponse } from '../model/visit-response';

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private api: string = "http://localhost:8081/api/visit";

  constructor(private http: HttpClient) { }

  // Metoda do pobierania wszystkich użytkowników
  getAll(){
    return this.http.get<VisitResponse[]>(this.api);
  }

  getPersonal(){
    return this.http.get<VisitResponse[]>(this.api + "/personal");
  }

  add(date: string, clientId: number){
    return this.http.post<VisitResponse>(this.api + `?client=${clientId}&date=${date}`, {});
  }
}
