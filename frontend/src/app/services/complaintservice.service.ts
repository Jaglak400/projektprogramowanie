import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { ComplaintResponse } from '../model/complaint-response'

@Injectable({
  providedIn: 'root'
})
export class ComplaintserviceService {

  private API = 'http://localhost:8080/api/complaint';

  constructor(private http: HttpClient) { }

  getAllComplaints(): Observable<ComplaintResponse[]> {
    return this.http.get<ComplaintResponse[]>(`${this.API}`);
  }

  addComplaint(serviceId: number, description: string): Observable<ComplaintResponse> {
    const payload = { serviceId, description };
    return this.http.post<ComplaintResponse>(`${this.API}`, payload);
  }

  updateComplaintStatus(complaintId: number, status: string): Observable<ComplaintResponse> {
    return this.http.put<ComplaintResponse>(`${this.API}?complaint=${complaintId}&status=${status}`, {});
  }
}
