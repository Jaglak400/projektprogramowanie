import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CarServiceRequest } from "../model/carService/car-service-request";
import { Observable } from "rxjs";
import {CarServiceResponse} from "../model/carService/car-service-response";

@Injectable({
  providedIn: 'root'
})
export class CarserviceService {
  private API: string = "http://localhost:8080/api/car-service";

  constructor(private http: HttpClient) { }

  // Metoda która pobiera wszystkie usługi samochodowe
  getAllCarServices(): Observable<any> {
    return this.http.get(this.API);
  }

  // Metoda która pobiera wszystkie usługi samochodowe jako tebele CarServiceResponse
  getAll(): Observable<CarServiceResponse[]> {
    return this.http.get<CarServiceResponse[]>(this.API);
  }

  // Metoda która dodaje nową usługe samochodową
  addCarService(carServiceRequest: CarServiceRequest): Observable<any> {
    return this.http.post(this.API, carServiceRequest);
  }

  // Metoda która aktualizuje usługe samochodową
  updateCarService(id: number, carServiceRequest: CarServiceRequest): Observable<any> {
    return this.http.put(`${this.API}/${id}`, carServiceRequest);
  }

  // Metoda która usuwa usługe samochodową
  deleteCarService(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
