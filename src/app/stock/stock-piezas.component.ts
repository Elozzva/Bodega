/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnInit } from '@angular/core';
import { StockService } from '../stock.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-stock-piezas',
  templateUrl: './stock-piezas.component.html',
  styleUrls: ['./stock-piezas.component.css']
})
export class StockPiezasComponent implements OnInit {
  piezasStock: any[] = [];

  constructor(
    private stockService: StockService,
    private router: Router
) {}

  ngOnInit(): void {
    this.cargarPiezasStock();
  }

  cargarPiezasStock(): void {
    this.stockService.getStockPiezas().subscribe(
      (data) => {
        this.piezasStock = data; // Datos ya ordenados desde el backend
        console.log('Stock de piezas cargado:', this.piezasStock);
      },
      (error) => console.error('Error al cargar el stock de piezas:', error)
    );
  }

  modificarStock(stock: any, accion: string): void {
    console.log(`Modificando stock para ${stock.pieza.nombre}, Acción: ${accion}`);
    
    this.router.navigate(['stock-piezas/ajuste'], {
      state: {
        stockData: stock, // Datos del stock que deseas pasar
        accion: accion    // La acción que deseas realizar
      },
      queryParams: {
        stockId: stock._id, // Como respaldo, pasa el ID del stock por queryParams
        accion: accion
      }
    });
  }

}
