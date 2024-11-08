/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../empleado.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  empleados: any[] = [];

  constructor(
    private empleadoService: EmpleadoService, 
    private notificationService: NotificationService,
    private router: Router) {}

  ngOnInit(): void {
    this.getEmpleado();
  }

  getEmpleado(): void {
    this.empleadoService.getEmpleados().subscribe(
      (data) => {
        this.empleados = data;
      },
      (error) => {
        this.notificationService.showError('Error al obtener las empleados');
        console.error('Error al obtener las empleados', error);
      }
    );
  }

  crearEmpleado(): void {
    this.router.navigate(['empleados/create']);
  }

  editarEmpleado(id: string): void {
    this.router.navigate(['empleados/edit', id]);  // Redirige a un formulario de edición
  }

  eliminarEmpleado(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadoService.deleteEmpleado(id).subscribe(
          () => {
            this.getEmpleado();  // Recarga la lista después de la eliminación
              this.empleados = this.empleados.filter(empleado => empleado._id !== id);
              Swal.fire('¡Éxito!', 'Empleado eliminado correctamente.', 'success');
            },
            (error) => {
              console.error('Error al eliminar el empleado:', error);
              Swal.fire('Error', 'Ocurrió un error al eliminar el empleado.', 'error');
            }
          );
      }
    });
  }
}
