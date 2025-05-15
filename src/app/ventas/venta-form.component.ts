/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../venta.service';
import { ClienteService } from '../cliente.service';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-venta-form',
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.css'],
})
export class VentaFormComponent implements OnInit {
  venta: any = {
    cliente: '',
    productos: [{ _id: '', cantidad: 0, cantidadDisponible: 0 }],
    estado: 'en preparación',
    facturas: [],
  };

  clientes: any[] = [];
  stockProductos: any[] = [];
  isEditMode: boolean = false;

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private stockService: StockService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Cargar clientes
    this.clienteService.getClientes().subscribe(
      (data) => (this.clientes = data),
      (error) => console.error('Error al cargar clientes:', error)
    );

    // Cargar stock de productos terminados
    this.stockService.getStockProductosTerminados().subscribe(
      (data) => (this.stockProductos = data),
      (error) => console.error('Error al cargar stock de productos terminados:', error)
    );

    const ventaId = this.route.snapshot.paramMap.get('id');
    if (ventaId) {
      this.isEditMode = true;
      this.ventaService.getVentaById(ventaId).subscribe(
        (data) => (this.venta = data),
        (error) => console.error('Error al cargar la venta:', error)
      );
    }
  }

  agregarProducto(): void {
    this.venta.productos.push({ _id: '', cantidad: 0, cantidadDisponible: 0 });
  }

  onProductoChange(index: number): void {
    const productoId = this.venta.productos[index]._id;

    const stockProducto = this.stockProductos.find(
        (stock) => stock.producto._id === productoId
    );

    if (stockProducto) {
        this.venta.productos[index].cantidadDisponible = stockProducto.cantidad;
    } else {
        this.venta.productos[index].cantidadDisponible = 0;
    }

    console.log('Producto actualizado:', this.venta.productos[index]);
}


onSubmit(): void {
  const productosValidos = this.venta.productos.every(
    (producto) => producto._id && producto.cantidad > 0
  );

  if (!productosValidos) {
    alert('Todos los productos deben tener un ID válido y una cantidad mayor a 0.');
    return;
  }

  if (this.isEditMode) {
    this.ventaService.updateVenta(this.venta._id, this.venta).subscribe(
      () => this.router.navigate(['/ventas']),
      (error) => console.error('Error al actualizar la venta:', error)
    );
  } else {
    this.ventaService.createVenta(this.venta).subscribe(
      () => this.router.navigate(['/ventas']),
      (error) => console.error('Error al crear la venta:', error)
    );
  }
}
}
