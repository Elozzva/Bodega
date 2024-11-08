/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../cliente.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];

  constructor(
    private clienteService: ClienteService, 
    private notificationService: NotificationService,
    private router: Router) {}

  ngOnInit(): void {
    this.getCliente();
  }

  getCliente(): void {
    this.clienteService.getClientes().subscribe(
      (data) => {
        this.clientes = data;
      },
      (error) => {
        this.notificationService.showError('Error al obtener los clientes');
        console.error('Error al obtener los clientes', error);
      }
    );
  }

  crearCliente(): void {
    this.router.navigate(['clientes/create']);
  }

  editarCliente(id: string): void {
    this.router.navigate(['clientes/edit', id]);  // Redirige a un formulario de edición
  }

  eliminarCliente(id: string): void {
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
        this.clienteService.deleteCliente(id).subscribe(
          () => {
            this.getCliente();  // Recarga la lista después de la eliminación
              this.clientes = this.clientes.filter(cliente => cliente._id !== id);
              Swal.fire('¡Éxito!', 'Cliente eliminado correctamente.', 'success');
            },
            (error) => {
              console.error('Error al eliminar el cliente:', error);
              Swal.fire('Error', 'Ocurrió un error al eliminar el cliente.', 'error');
            }
          );
      }
    });
  }
}
