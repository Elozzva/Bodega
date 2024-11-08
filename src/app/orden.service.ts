/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private apiUrl = 'http://localhost:3000/api/ordenes';  // URL de la API

  constructor(private http: HttpClient) {}

  // Obtener todas las órdenes
  getOrdenes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Crear una nueva orden
  createOrden(orden: any): Observable<any> {
    return this.http.post(this.apiUrl, orden);
  }

  // Obtener una orden por ID
  getOrdenById(ordenId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${ordenId}`);
  }

  // Actualizar el estado de una orden
  updateOrdenStatus(ordenId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ordenId}`, { estado: status });
  }

  // Eliminar una orden
  deleteOrden(ordenId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ordenId}`);
  }

  // Obtener productos disponibles
  getProductos(): Observable<any> {
    return this.http.get('http://localhost:3000/api/productos');
  }
}