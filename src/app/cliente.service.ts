/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api/clientes';
  
  constructor(private http: HttpClient) {}

  // Obtener todas las clientes
  getClientes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener una Cliente por ID
  getClienteById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva Cliente
  createCliente(cliente: any): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }

  // Actualizar una cliente existente
  updateCliente(id: string, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente);
  }

  // Eliminar una cliente
  deleteCliente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}
