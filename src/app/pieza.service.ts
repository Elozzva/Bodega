/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { tap } from 'rxjs';
//import { environment } from '../../environments/environment';
//import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PiezaService {
  private apiUrl = 'http://localhost:3000/api/pieza';
  
  constructor(private http: HttpClient) {}

  // Obtener todas las piezas
  getPiezas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener una pieza por ID
  getPiezaById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva pieza
  createPieza(pieza: any): Observable<any> {
    return this.http.post(this.apiUrl, pieza);
  }

  // Actualizar una pieza existente
  updatePieza(id: string, pieza: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, pieza);
  }

  // Eliminar una pieza
  deletePieza(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}