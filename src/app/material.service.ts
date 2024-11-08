/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
//import { tap } from 'rxjs';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://localhost:3000/api/materials';
  private materialsSubject = new BehaviorSubject<any[]>([]);
  materials$ = this.materialsSubject.asObservable();
  getMaterialById(id: string | null) {
    return this.http.get<any>(`${this.apiUrl}/${id}`); // Retorna un Observable
    //throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Verificar el stock de un material específico
  obtenerStockPorMaterial(materialId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/stocks/material/${materialId}`);
  }

  createMaterial(material: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, material);
  }

  editMaterial(id: string, material: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, material)
      .pipe(
        catchError(error => {
          console.error('Error no se actualizo el material:', error);
          return throwError(error);
        })
      );
  }

  updateMaterialStock(materialId: string, cantidad: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/materiales/${materialId}/stock`, { cantidad })
    .pipe(
      catchError(error => {
        console.error('Error al actualizar el stock:', error);
        return throwError(error);
      })
    );
  }

  updateMaterial(material: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${material._id}`, material);
  }

  deleteMaterial(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al eliminar el material:', error);
          return throwError(error);
        })
      );
  }
}