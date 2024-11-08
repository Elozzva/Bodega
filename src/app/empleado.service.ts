/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000/api/empleados';
  
  constructor(private http: HttpClient) {}

  // Obtener todas las empleados
  getEmpleados(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener una empleado por ID
  getEmpleadoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva empleado
  createEmpleado(empleado: any): Observable<any> {
    return this.http.post(this.apiUrl, empleado);
  }

  // Actualizar una empleado existente
  updateEmpleado(id: string, empleado: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, empleado);
  }

  // Eliminar una empleado
  deleteEmpleado(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}
