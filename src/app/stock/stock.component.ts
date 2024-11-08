/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { StockService } from '../stock.service';
import Swal from 'sweetalert2';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})

export class StockComponent implements OnInit {
  stockMateriales: any[] = [];
  stockPiezas: any[] = [];
  stockProductos: any[] = [];
  stocks: any[] = [];

  constructor(
    private notificationService: NotificationService,
    private stockService: StockService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerStockMateriales();
    this.obtenerStockPiezas();
    this.obtenerStockProductos();

    console.log('Materiales:', this.stockMateriales);
    console.log('Piezas:', this.stockPiezas);
    console.log('Productos Terminados:', this.stockProductos);
  }

  crearAumentoMaterial(): void {
    this.router.navigate(['stocks/create']);
  }

  obtenerStockMateriales(): void {
    this.stockService.getStockMateriales().subscribe(
      data => this.stockMateriales = data,
      error => console.error('Error al obtener el stock de materiales:', error)
    );
  }

  obtenerStockPiezas(): void {
    this.stockService.getStockPiezas().subscribe(
      data => this.stockPiezas = data,
      error => console.error('Error al obtener el stock de piezas:', error)
    );
  }

  obtenerStockProductos(): void {
    this.stockService.getStockProductosTerminados().subscribe(
      data => this.stockProductos = data,
      error => console.error('Error al obtener el stock de productos terminados:', error)
    );
  }

  getStocks(): void {
    this.stockService.getStock().subscribe(
      (data) => {
        this.stocks = data;
      },
      (error) => {
        this.notificationService.showError('Error al obtener los stocks');
        console.error('Error al obtener los stocks', error);
      }
    );
  }

  deleteStock(id: string): void {
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
        this.stockService.deleteStock(id).subscribe(
          () => {
            this.getStocks();  // Recarga la lista después de la eliminación
              this.stocks = this.stocks.filter(stock => stock._id !== id);
              Swal.fire('¡Éxito!', 'Stock eliminado correctamente.', 'success');
            },
            (error) => {
              console.error('Error al eliminar el stock:', error);
              Swal.fire('Error', 'Ocurrió un error al eliminar el stock.', 'error');
            }
          );
      }
    });
  }  
}


