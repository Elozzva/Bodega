/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = 'http://localhost:3000/api/recetas';  // URL base de la API para recetas

  constructor(private http: HttpClient) { }

  // Obtener todas las recetas
  getRecetas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error al obtener las recetas:', error);
          return throwError(error);
        })
      );
  }

  getRecetasByMaterial(materialId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/material/${materialId}`);
  }

  getRecetaByPieza(piezaId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/pieza/${piezaId}`);
  }

  // Obtener una receta por ID
  getRecetaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener la receta:', error);
          return throwError(error);
        })
      );
  }

  // Crear una nueva receta
  createReceta(receta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, receta)
      .pipe(
        catchError(error => {
          console.error('Error al crear la receta:', error);
          return throwError(error);
        })
      );
  }

  // Actualizar una receta existente
  updateReceta(id: string, receta: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, receta)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar la receta:', error);
          return throwError(error);
        })
      );
  }

  // Eliminar una receta
  deleteReceta(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al eliminar la receta:', error);
          return throwError(error);
        })
      );
  }
}

