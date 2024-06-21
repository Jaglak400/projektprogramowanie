import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PartResponse } from '../model/part/part-response';
import { Observable } from 'rxjs';
import {PartRequest} from "../model/part/part-request";

@Injectable({
  providedIn: 'root'
})
export class PartsService {

  private api: string = "http://localhost:8081/api/part";

  constructor(private http: HttpClient) { }

  // Metoda do pobierania pojedynczej części na podstawie identyfikatora
  get(id: number): Observable<PartResponse> {
    return this.http.get<PartResponse>(this.api + "/" + id);
  }

  // Metoda do pobierania wszystkich części
  getAll(): Observable<PartResponse[]> {
    return this.http.get<PartResponse[]>(this.api);
  }

  // Metoda do dodawania nowej części
  addPart(part: PartRequest): Observable<PartResponse>{
    return this.http.post<PartResponse>(this.api + "/new", part);
  }

  // Metoda do usuwania części na podstawie identyfikatora
  deletePart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  // Metoda do aktualizowania części na podstawie identyfikatora i nowych danych
  updatePart(id: number, part: PartRequest): Observable<PartResponse> {
    return this.http.put<PartResponse>(`${this.api}/${id}`, part);
  }

  // Metoda do aktualizowania dokumentu na podstawie identyfikatora
  updatePartDocuments(partId: number, documents: boolean[]): Observable<PartResponse> {
    return this.http.put<PartResponse>(`${this.api}/${partId}/documents`, documents);
  }
}
