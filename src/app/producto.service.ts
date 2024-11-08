/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
//import { tap } from 'rxjs';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/productos';
  private productosSubject = new BehaviorSubject<any[]>([]);
  productos$ = this.productosSubject.asObservable();
  getProductoById(id: string | null) {
    return this.http.get<any>(`${this.apiUrl}/${id}`); // Retorna un Observable
    //throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener los productos:', error);
        return throwError(error);
      })
    );
  }

  // Obtener los productos terminados
  getProductosTerminados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/terminados`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los productos terminados:', error);
          return throwError(error);
        })
      );
  }


  createProducts(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  editProducto(id: string, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto)
      .pipe(
        catchError(error => {
          console.error('Error no se actualizo el producto:', error);
          return throwError(error);
        })
      );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error al eliminar el producto:', error);
          return throwError(error);
        })
      );
  }
}