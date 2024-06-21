import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceResponse } from '../model/service/service-response';

@Injectable({
  providedIn: 'root' // Serwis jest dostępny w całej aplikacji
})
export class ClientService {

  private api: string = "http://localhost:8081/api/client/";

  constructor(private http: HttpClient) { }

  // Metoda do pobierania usług dla klienta
  getClientServices() : Observable<ServiceResponse[]>{
    return this.http.get<ServiceResponse[]>(this.api + 'services');
  }
}
