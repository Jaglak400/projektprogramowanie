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

  getAllCarServices(): Observable<any> {
    return this.http.get(this.API);
  }

  getAll(): Observable<CarServiceResponse[]> {
    return this.http.get<CarServiceResponse[]>(this.API);
  }

  addCarService(carServiceRequest: CarServiceRequest): Observable<any> {
    return this.http.post(this.API, carServiceRequest);
  }

  updateCarService(id: number, carServiceRequest: CarServiceRequest): Observable<any> {
    return this.http.put(`${this.API}/${id}`, carServiceRequest);
  }

  deleteCarService(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
