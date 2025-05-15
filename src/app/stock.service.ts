/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:3000/api/stocks';  // URL base de la API para stock

  constructor(private http: HttpClient) { }

  // Obtener todo el stock
  getStock(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error al obtener el stock:', error);
          return throwError(error);
        })
      );
  }

  // Obtener stock por ID
  getStockById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener el stock por ID:', error);
          return throwError(error);
        })
      );
  }

  getStockByMaterial2(materialId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/material/${materialId}`);
  }

   // Método para actualizar un stock existente
   updateStock(id: string, stockData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, stockData).pipe(
      catchError(error => {
        console.error('Error al actualizar el stock:', error);
        return throwError(error);
      })
    );
  }

  // Eliminar una entrada de stock
  deleteStock(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al eliminar el stock:', error);
          return throwError(error);
        })
      );
  }

  // Obtener el stock de un material específico
  getStockByMaterial(materialId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/material/${materialId}`);
  }


  // Obtener stock de materiales
  getStockMateriales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materiales`).pipe(
      catchError(error => {
        console.error('Error al obtener el stock de materiales:', error);
        return throwError(error);
      })
    );
  }

  // Obtener stock de piezas
  getStockPiezas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/piezas`).pipe(
      catchError(error => {
        console.error('Error al obtener el stock de piezas:', error);
        return throwError(error);
      })
    );
  }

  // Obtener stock de productos terminados
  getStockProductosTerminados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`).pipe(
      catchError(error => {
        console.error('Error al obtener el stock de productos terminados:', error);
        return throwError(error);
      })
    );
  }

  // Crear una nueva entrada de stock
  createStock(stock: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, stock).pipe(
      catchError(error => {
        console.error('Error al crear el stock:', error);
        return throwError(error);
      })
    );
  }

  // Actualizar stock de material
  actualizarStockMaterial(materialId: string, cantidadUsar: number): Observable<any> {
    return this.http.put(`/api/stock/material/${materialId}`, { cantidadUsar });
  }

  // Actualizar stock de piezas
  actualizarStockPiezas(recetaId: string, cantidadPiezas: number): Observable<any> {
    return this.http.put(`/api/stock/piezas/${recetaId}`, { cantidadPiezas });
  }
}

