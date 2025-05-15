/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:3000/api/ventas';

  constructor(private http: HttpClient) {}

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getVentaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createVenta(venta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, venta).pipe(
      catchError(error => {
        console.error('Error al crear el venta:', error);
        return throwError(error);
      })
    );
  }

   // Actualizar una venta existente
   updateVenta(id: string, venta: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, venta);
  }

  cambiarEstado(id: string, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/ventas/${id}/estado`, { nuevoEstado: estado });
  }

  getHistorialEstados(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/${id}/historial`);
  }

  subirFacturas(id: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/ventas/${id}/facturas`, formData);
  }

  deleteVenta(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar la venta:', error);
        return throwError(error);
      })
    );
  }
}

