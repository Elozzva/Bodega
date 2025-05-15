/* eslint-disable @typescript-eslint/no-inferrable-types */
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

  // Variables de paginación
  pageMateriales: number = 1;
  pageSizeMateriales: number = 10;
  pagePiezas: number = 1;
  pageSizePiezas: number = 10;
  pageProductos: number = 1;
  pageSizeProductos: number = 10;

  // Variables de búsqueda
  filtroMateriales: string = '';
  filtroPiezas: string = '';
  filtroProductos: string = '';

  // Variables de ordenamiento
  ordenMateriales = { columna: '', asc: true };
  ordenPiezas = { columna: '', asc: true };
  ordenProductos = { columna: '', asc: true };

  constructor(
    private notificationService: NotificationService,
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerStockMateriales();
    this.obtenerStockPiezas();
    this.obtenerStockProductos();
  }

  crearAumentoMaterial(): void {
    this.router.navigate(['stocks/create']);
  }

  editarPiezas(): void {
    this.router.navigate(['stocks/editPiezas']);
  }

  editarProductos(): void {
    this.router.navigate(['stocks/editProductos']);
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

  // Función para paginación
  getPaginatedData(data: any[], page: number, pageSize: number): any[] {
    const startIndex = (page - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }

  // Cambio de página
  changePage(list: string, direction: number): void {
    if (list === 'materiales') this.pageMateriales += direction;
    if (list === 'piezas') this.pagePiezas += direction;
    if (list === 'productos') this.pageProductos += direction;
  }

  // Filtrar datos
  getFilteredData(stock: any[], filtro: string): any[] {
    return stock.filter(item =>
      (item.material?.name?.toLowerCase().includes(filtro.toLowerCase()) ||
      item.pieza?.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      item.producto?.name?.toLowerCase().includes(filtro.toLowerCase()))
    );
  }

  // Ordenamiento
  ordenarLista(lista: any[], columna: string, config: any): void {
    config.asc = config.columna === columna ? !config.asc : true;
    config.columna = columna;
    lista.sort((a, b) => this.comparar(a, b, columna, config.asc));
  }

  comparar(a: any, b: any, columna: string, asc: boolean): number {
    return asc ? (a[columna] > b[columna] ? 1 : -1) : (a[columna] < b[columna] ? 1 : -1);
  }

  agregarStock(tipo: string, id: string): void {
    if (!tipo || !id) return;
  
    switch (tipo) {
      case 'material':
        this.router.navigate(['/stocks/create'], { queryParams: { tipo: 'material', id } });
        break;
      case 'pieza':
        this.router.navigate(['/stocks/create'], { queryParams: { tipo: 'pieza', id } });
        break;
      case 'producto':
        this.router.navigate(['/stocks/create'], { queryParams: { tipo: 'producto', id } });
        break;
      default:
        console.warn('Tipo de stock no reconocido:', tipo);
    }
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
            this.obtenerStockMateriales();
            this.obtenerStockPiezas();
            this.obtenerStockProductos();
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
