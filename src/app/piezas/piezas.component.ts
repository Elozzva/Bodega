/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { PiezaService } from '../pieza.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-piezas',
  templateUrl: './piezas.component.html',
  styleUrls: ['./piezas.component.css']
})
export class PiezasComponent implements OnInit {
  piezas: any[] = [];

  constructor(
    private piezaService: PiezaService, 
    private notificationService: NotificationService,
    private router: Router) {}

  ngOnInit(): void {
    this.getPiezas();
  }

  getPiezas(): void {
    this.piezaService.getPiezas().subscribe(
      (data) => {
        this.piezas = data;
      },
      (error) => {
        this.notificationService.showError('Error al obtener las piezas');
        console.error('Error al obtener las piezas', error);
      }
    );
  }

  crearPieza(): void {
    this.router.navigate(['piezas/crear']);
  }

  editarPieza(id: string): void {
    this.router.navigate(['piezas/edit', id]);  // Redirige a un formulario de edición
  }

  eliminarPieza(id: string): void {
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
        this.piezaService.deletePieza(id).subscribe(
          () => {
            this.getPiezas();  // Recarga la lista después de la eliminación
              this.piezas = this.piezas.filter(pieza => pieza._id !== id);
              Swal.fire('¡Éxito!', 'Pieza eliminada correctamente.', 'success');
            },
            (error) => {
              console.error('Error al eliminar el pieza:', error);
              Swal.fire('Error', 'Ocurrió un error al eliminar el pieza.', 'error');
            }
          );
      }
    });
  }
}