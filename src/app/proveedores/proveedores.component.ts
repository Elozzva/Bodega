/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../proveedor.service';  // Importa tu servicio de proveedores
import Swal from 'sweetalert2';  // Importamos SweetAlert2 para las alertas de confirmación
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = [];  // Lista de proveedores

  constructor(
    private proveedorService: ProveedorService,  // Servicio de proveedores
    private router: Router  // Router para la navegación
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();  // Cargar proveedores al iniciar
  }

  crearProveedor(): void {
    this.router.navigate(['/proveedores/create']);
  }

  // Función para cargar los proveedores desde el servicio
  cargarProveedores(): void {
    this.proveedorService.getProveedores().subscribe(
      (data) => this.proveedores = data,
      (error) => console.error('Error al cargar los proveedores:', error)
    );
  }

  // Función para eliminar un proveedor
  eliminarProveedor(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.deleteProveedor(id).subscribe(
          () => {
            this.proveedores = this.proveedores.filter(proveedor => proveedor._id !== id);  // Eliminar de la lista local
            Swal.fire('Eliminado', 'El proveedor ha sido eliminado', 'success');
          },
          (error) => Swal.fire('Error', 'Ocurrió un error al eliminar el proveedor', 'error')
        );
      }
    });
  }

  // Función para navegar a la edición de un proveedor
  editarProveedor(id: string): void {
   this.router.navigate([`/proveedores/edit/${id}`]);
  }
}