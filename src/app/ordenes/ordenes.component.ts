/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { OrdenService } from '../orden.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent implements OnInit {
  orders: any[] = [];
  alertas: string[] = [];

  constructor(
    private ordenService: OrdenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ordenService.getOrdenes().subscribe(
      data => this.orders = data,
      error => console.error('Error al cargar las órdenes:', error)
    );
  }

  crearOrden(): void {
    this.router.navigate(['ordenes/create']);
  }

  // Cambiar estado de la orden
  changeOrdenStatus(orderId: string, status: string): void {
    this.ordenService.updateOrdenStatus(orderId, status).subscribe(
      (response: any) => {
        const order = this.orders.find(o => o._id === orderId);
        if (order) {
          order.estado = status;
      }

      // Mostrar alertas de stock bajo si existen
      this.alertas = response.alertas || [];
      },
      error => console.error('Error al cambiar el estado de la orden:', error)
    );
  }

  // Eliminar orden
  deleteOrden(orderId: string): void {
    this.ordenService.deleteOrden(orderId).subscribe(
      () => this.orders = this.orders.filter(o => o._id !== orderId),
      error => console.error('Error al eliminar la orden:', error)
    );
  }
}
