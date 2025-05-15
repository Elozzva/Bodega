/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core'; 
import { FabricacionService } from '../fabricacion.service'; 
import { StockService } from '../stock.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fabricaciones', 
  templateUrl: './fabricaciones.component.html', 
  styleUrls: ['./fabricaciones.component.css'] 
})
export class FabricacionesComponent implements OnInit {
  fabricaciones: any[] = []; 
  stocks: any[] = [];
  advertencias: string[] = [];

  // Variables de paginación
  currentPage: number = 1; // Página actual
  pageSize: number = 8; // Cantidad de elementos por página
  totalItems: number = 0; // Total de elementos

  // Exponer Math para usarlo en el template
  Math = Math;

  constructor(
    private fabricacionService: FabricacionService,  
    private stockService: StockService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.cargarFabricaciones(); // Cargar las fabricaciones al iniciar
  }

  crearFabricacion(): void {
    this.router.navigate(['fabricaciones/create']);
  }

  // Cargar las fabricaciones al iniciar
  cargarFabricaciones(): void {
    this.fabricacionService.getFabricaciones().subscribe(
      data => {
        // Ordenar de la más reciente a la más antigua
        const sortedFabricaciones = data.fabricaciones.sort(
          (a: any, b: any) => new Date(b.fechaEntrega).getTime() - new Date(a.fechaEntrega).getTime()
        );

        // Total de elementos para la paginación
        this.totalItems = sortedFabricaciones.length;

        // Asignar fabricaciones paginadas
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.fabricaciones = sortedFabricaciones.slice(startIndex, startIndex + this.pageSize);

        this.fabricaciones = data.fabricaciones.map((fabricacion: any) => {
          fabricacion.proveedor = fabricacion.proveedor || { nombre: 'Proveedor no disponible' };
          fabricacion.empleado = fabricacion.empleado || { nombre: 'Empleado no disponible' };
          return fabricacion;
        });
      },
      error => console.error('Error al cargar las fabricaciones:', error)
    );
  }
  
  cambiarPagina(page: number): void {
    this.currentPage = page;
    this.cargarFabricaciones();
  }

   // Método para iniciar una fabricación (cambia el estado a "en progreso")
  iniciarFabricacion(fabricacion: any): void {
    // Verificar si la fabricación está en estado "pendiente"
    if (fabricacion.estado === 'completada' || fabricacion.estado === 'cancelada') {
      console.log('La fabricación ya está completada o cancelada.');
      return; // No se puede iniciar una fabricación que ya esté completada o cancelada
    }
  
    // Obtener el stock del material relacionado con la fabricación específica
    this.stockService.getStockByMaterial(fabricacion.material._id).subscribe(
      stockMaterial => {
        const advertencias = [];
  
        if (stockMaterial && stockMaterial.cantidad < fabricacion.material.stockMinimo) {
          advertencias.push(`Stock insuficiente de materiales para la fabricación de ${fabricacion.material.name}.`);
        }
  
        // Si hay advertencias, mostramos un mensaje y detenemos el proceso
        if (advertencias.length > 0) {
          alert(advertencias.join('\n'));
        } else {
          // Si no hay advertencias, actualizamos el estado de la fabricación a "en progreso"
          this.fabricacionService.actualizarEstado(fabricacion._id, 'en progreso').subscribe(
            () => {
              fabricacion.estado = 'en progreso';  // Actualizar estado localmente
              console.log(`Fabricación ${fabricacion._id} iniciada`);
            },
            error => console.error('Error al iniciar la fabricación:', error)
          );
        }
      },
      error => console.error('Error al verificar el stock del material:', error)
    );
  }

  // Método para completar una fabricación
  completarFabricacion(fabricacion: any): void {
    // Verificar si es fabricación interna o externa para llamar al endpoint adecuado
    const endpoint = fabricacion.tipo === 'interna' 
      ? this.fabricacionService.completarFabricacionInterna(fabricacion._id)
      : this.fabricacionService.completarFabricacionExterna(fabricacion._id);
  
    endpoint.subscribe(
      () => {
        fabricacion.estado = 'completada';  // Actualizar estado localmente
        console.log(`Fabricación ${fabricacion._id} completada`);
  
        // Verificamos el stock de piezas fabricadas después de completar la fabricación
        const stockPieza = this.stocks.find(stock => stock.tipo === 'Pieza' && stock.pieza._id === fabricacion.receta.pieza._id);
  
        if (stockPieza) {
          if (stockPieza.cantidad < fabricacion.receta.pieza.stockMinimo) {
            // Generar una advertencia si el stock de piezas es bajo después de la fabricación
            this.advertencias.push('El stock de la pieza ' + fabricacion.receta.pieza.nombre + ' está por debajo del mínimo después de la fabricación.');
          }
        } else {
          console.log(`No se encontró stock para la pieza: ${fabricacion.receta.pieza.nombre}`);
        }
  
        // Mostrar advertencias si existen
        if (this.advertencias.length > 0) {
          alert(this.advertencias.join('\n'));
        }
      },
      error => console.error('Error al completar la fabricación:', error)
    );
  }

  cancelarFabricacion(fabricacion: any): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta fabricación?')) {
      this.fabricacionService.actualizarEstado(fabricacion._id, 'cancelada').subscribe(
        () => {
          fabricacion.estado = 'cancelada';  // Actualizar estado localmente
          console.log(`Fabricación ${fabricacion._id} cancelada`);
        },
        error => console.error('Error al cancelar la fabricación:', error)
      );
    }
  }

  // Método para redirigir a la edición de fabricación
  editarFabricacion(fabricacion: any): void {
    this.router.navigate([`/fabricaciones/${fabricacion._id}/edit`]);
  }
}