/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-stock-productos',
  templateUrl: './stock-productos.component.html',
  styleUrls: ['./stock-productos.component.css']
})
export class StockProductosComponent implements OnInit {
  stockProductos: any[] = []; // Lista de productos terminados

  constructor(
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarStockProductos();
  }

  // Cargar el stock de productos terminados desde el servicio
  cargarStockProductos(): void {
    this.stockService.getStockProductosTerminados().subscribe(
      data => {
        this.stockProductos = data;
        console.log('Stock de productos cargado:', this.stockProductos);
      },
      error => console.error('Error al cargar el stock de productos terminados:', error)
    );
  }

  // Abrir el ajuste de stock (redirigir al formulario de ajuste)
  abrirAjuste(stock: any, accion: string): void {
    console.log(`Modificando stock para ${stock.producto.name}, Acción: ${accion}`);
    this.router.navigate(['stock-productos/ajuste'], {
      queryParams: { stockId: stock._id, accion },
      state: { stockData: stock, accion }
    });
  }
}
