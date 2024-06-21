import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceResponse } from '../model/service/service-response';
import { ServicePartRequest } from '../model/part/service-part-request';
import {CarServiceResponse} from "../model/carService/car-service-response";
import {PartResponse} from "../model/part/part-response";

@Injectable({
  providedIn: 'root'
})
export class SerwisService {

  API: string = "http://localhost:8081/api/service"

  constructor(private http: HttpClient) { }

  // Metoda do pobierania wszystkich serwisów
  getAll(): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(this.API);
  }

  // Metoda do dodawania nowego serwisu
  add(description: string, clientId: number): Observable<any> {
    return this.http.post<any>(`${this.API}?description=${description}&client=${clientId}`, {});
  }

  // Metoda do przypisywania serwisanta do serwisu
  assignServiceManToService(serviceId: number, serviceManId: number){
    return this.http.post(this.API + "/assign?service=" + serviceId + "&serviceMan=" + serviceManId, {});
  }

  // Metoda do przypisywania części do serwisu
  assignPartsToService(serviceId: number, serviceParts: ServicePartRequest[]) {
    return this.http.post(this.API + "/"+serviceId+"/parts", serviceParts);
  }

  // Metoda do ustawiania statusu serwisu
  setStatus(serviceId: number, status: string): Observable<any> {
    return this.http.post<any>(`${this.API}/set/status?service=${serviceId}&status=${status}`, {});
  }

  // Metoda do usuwania serwisu
  delete(serviceId: number): Observable<any> {
    return this.http.delete(`${this.API}?service=${serviceId}`);
  }

  // Metoda do przypisywania usług samochodowych do usługi o podanym identyfikatorze
  assignCarServicesToService(serviceId: number, carServiceIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.API}/${serviceId}/car-service`, carServiceIds);
  }

  // Metoda do przypisywania dokumentow do serwisu o podanym identyfikatorze
  updateServiceDocuments(serviceId: number, document: boolean[]): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.API}/document?service=${serviceId}&document=${document}`, {});
  }
}
