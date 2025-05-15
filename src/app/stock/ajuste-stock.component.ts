/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-ajuste-stock',
  templateUrl: './ajuste-stock.component.html',
  styleUrls: ['./ajuste-stock.component.css']
})
export class AjusteStockComponent implements OnInit {
  stockData: any; // Datos de la pieza
  accion: string = ''; // Acción a realizar (aumentar, disminuir, etc.)
  cantidad: number = 0; // Cantidad a ajustar
  motivo: string = ''; // Motivo del ajuste
  fecha: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockService: StockService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.stockData = navigation?.extras.state?.['stockData'] || null;
    this.accion = navigation?.extras.state?.['accion'] || null;

    console.log('Stock recibido:', this.stockData);
    console.log('Acción recibida:', this.accion);
  }

  ngOnInit(): void {
    // Obtener parámetros de la URL (queryParams)
    this.route.queryParams.subscribe(params => {
      const stockId = params['stockId'];
      this.accion = params['accion'];
  
      console.log('Acción recibida desde queryParams:', this.accion);
  
      if (!stockId) {
        console.error('No se proporcionó un ID de stock en los queryParams.');
        alert('Error: no se recibió un ID de stock válido.');
        this.router.navigate(['/stocks']); // Redirigir al listado general
        return;
      }
  
      // Cargar el stock desde el backend usando el stockId
      this.stockService.getStockById(stockId).subscribe(
        data => {
          this.stockData = data;
          console.log('Datos del stock cargados:', this.stockData);
        },
        error => console.error('Error al cargar los datos del stock:', error)
      );
    });
  }
  
  

  onSubmit(): void {
    const ajusteData = {
      cantidad: this.cantidad * (this.accion === 'disminuir' ? -1 : 1), // Ajustar cantidad según acción
      motivo: this.motivo
    };

    this.stockService.updateStock(this.stockData._id, ajusteData).subscribe(
      () => {
        console.log('Ajuste de stock realizado con éxito');
        this.router.navigate(['/stocks']);
      },
      error => console.error('Error al realizar el ajuste de stock:', error)
    );
  }

  guardarAjuste(): void {
    if (!this.cantidad || !this.accion) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    // Operación según la acción
    let nuevaCantidad = this.stockData.cantidad; // Valor actual del stock
    if (this.accion === 'aumentar') {
      nuevaCantidad += this.cantidad; // Sumar al stock
    } else if (this.accion === 'disminuir') {
      nuevaCantidad -= this.cantidad; // Restar al stock
      if (nuevaCantidad < 0) {
        alert('El stock no puede ser negativo.');
        return;
      }
    }
  
    // Crear el objeto actualizado
    const updatedStock = {
      ...this.stockData,
      cantidad: nuevaCantidad,
      fechaActualizacion: new Date(),
      motivo: this.motivo // Opcional
    };
  
    // Llamar al servicio para guardar el cambio
    this.stockService.updateStock(this.stockData._id, updatedStock).subscribe(
      () => {
        alert('Ajuste realizado con éxito.');
        this.router.navigate(['/stocks']); // Regresar a la vista principal
      },
      error => {
        console.error('Error al guardar el ajuste:', error);
        alert('Hubo un error al realizar el ajuste.');
      }
    );
  }
  
}
