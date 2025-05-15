/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { VentaService } from '../venta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  @ViewChild('facturasModal', { static: false }) facturasModalRef!: ElementRef;
  @ViewChild('historialModal', { static: false }) historialModalRef!: ElementRef;

  ventas: any[] = [];
  pageSize: number = 8; // Número de elementos por página
  currentPage: number = 1; // Página actual

  // **Nuevas variables para el modal**
  mostrarModalHistorial: boolean = false; // Controla si se muestra el modal de historial
  historialEstados: any[] = []; // Guarda el historial de estados de una venta
  historialModal!: Modal;

  mostrarModalFacturas: boolean = false; // Controla si se muestra el modal de facturas
  selectedFiles: File[] = []; // Archivos seleccionados para subir
  ventaSeleccionada: string = ''; // ID de la venta seleccionada

  constructor(private ventaService: VentaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.ventaService.getVentas().subscribe(
      (data) => {
        this.ventas = data.map((venta: any) => ({
          ...venta,
          cliente: venta.cliente?.nombre || 'Cliente no disponible', // Asegúrate de que el cliente tenga nombre
          fecha: venta.fecha ? new Date(venta.fecha) : 'Fecha no disponible', // Convertir la fecha a un objeto Date
        }));
      },
      (error) => console.error('Error al cargar las ventas:', error)
    );
  }
  
  crearVenta(): void {
    this.router.navigate(['ventas/create']);
  }

  verDetalle(ventaId: string): void {
    this.router.navigate([`/ventas/${ventaId}`]);
  }

  ngAfterViewInit(): void {
    // Inicializa el modal de Bootstrap después de que la vista esté renderizada
    this.historialModal = new Modal(this.historialModalRef.nativeElement);
  }

  cambiarEstado(ventaId: string, nuevoEstado: string): void {
    this.ventaService.cambiarEstado(ventaId, nuevoEstado).subscribe(
      (ventaActualizada) => {
        // Busca la venta en el arreglo y actualiza su referencia
        const index = this.ventas.findIndex((venta) => venta._id === ventaId);
        if (index !== -1) {
          this.ventas[index] = ventaActualizada;
          this.ventas = [...this.ventas]; // Fuerza la actualización del array
        }
      },
      (error) => console.error('Error al cambiar el estado:', error)
    );
  }
  


  eliminarVenta(ventaId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      this.ventaService.deleteVenta(ventaId).subscribe(
        () => this.cargarVentas(),
        error => console.error('Error al eliminar la venta:', error)
      );
    }
  }

  abrirModalFacturas(ventaId: string): void {
    this.ventaSeleccionada = ventaId;
    const modal = new Modal(this.facturasModalRef.nativeElement); // Inicializa el modal de Bootstrap
    modal.show(); // Muestra el modal
  }

  verHistorial(ventaId: string): void {
    // Simula cargar historial (reemplaza esto con tu llamada HTTP real)
    this.historialEstados = [
      { estado: 'en preparación', fecha: new Date() },
      { estado: 'en camino', fecha: new Date() }
    ];

    const modal = new Modal(this.historialModalRef.nativeElement);
    modal.show();
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
    console.log('Archivos seleccionados:', this.selectedFiles);
  }

  subirFacturas(): void {
    const formData = new FormData();
    Array.from(this.selectedFiles).forEach((file) => {
      formData.append('facturas', file);
    });

    this.ventaService.subirFacturas(this.ventaSeleccionada, formData).subscribe(
      (ventaActualizada) => {
        this.ventas = this.ventas.map((venta) =>
          venta._id === ventaActualizada._id ? ventaActualizada : venta
        );
        this.mostrarModalFacturas = false; // Cerrar el modal
      },
      (error) => console.error('Error al subir las facturas:', error)
    );
    console.log('Facturas subidas:', this.selectedFiles);
  }


}
