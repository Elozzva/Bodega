/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FabricacionService {
  private apiUrl = 'http://localhost:3000/api/fabricaciones';

  constructor(private http: HttpClient) {}

   // Obtener todas las Fabricaciones
   getFabricaciones(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Crear una nueva fabricación
  crearFabricacion(fabricacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, fabricacion).pipe(
      catchError(error => {
        console.error('Error al crear la fabricación:', error);
        return throwError(error);
      })
    );
  }

  // Actualizar el estado de una fabricación
  actualizarEstado(fabricacionId: string, estado: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${fabricacionId}/estado`, { estado }).pipe(
      catchError(error => {
        console.error('Error al actualizar el estado de la fabricación:', error);
        return throwError(error);
      })
    );
  }

  // Completar una fabricación interna
  completarFabricacionInterna(fabricacionId: string): Observable<any> {
    // Usamos el fabricacionId en la URL, no en el cuerpo
    return this.http.post<any>(`${this.apiUrl}/${fabricacionId}/completar`, {}).pipe(
      catchError(error => {
        console.error('Error al completar la fabricación interna:', error);
        return throwError(error);
      })
    );
  }

  // Completar una fabricación externa
  completarFabricacionExterna(fabricacionId: string): Observable<any> {
    // Usamos el fabricacionId en la URL, no en el cuerpo
    return this.http.post<any>(`${this.apiUrl}/${fabricacionId}/completar`, {}).pipe(
      catchError(error => {
        console.error('Error al completar la fabricación externa:', error);
        return throwError(error);
      })
    );
  }

  // Actualizar una fabricacion existente
  updateFabricacion(id: string, fabricacion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, fabricacion);
  }

  // Obtener fabricación por ID
  getFabricacionById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

 /*  verificarStock(materialId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verificar-stock/${materialId}`);
  } */
}





