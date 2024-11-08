/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
//import { tap } from 'rxjs';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:3000/api/proveedores';
  private proveedoresSubject = new BehaviorSubject<any[]>([]);
  proveedores$ = this.proveedoresSubject.asObservable();
  getProveedorById(id: string | null) {
    return this.http.get<any>(`${this.apiUrl}/${id}`); // Retorna un Observable
    //throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createProveedor(proveedores: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, proveedores);
  }

  editProveedor(id: string, proveedor: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proveedor)
      .pipe(
        catchError(error => {
          console.error('Error no se actualizo el proveedor:', error);
          return throwError(error);
        })
      );
  }

  deleteProveedor(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al eliminar el proveedor:', error);
          return throwError(error);
        })
      );
  }
}