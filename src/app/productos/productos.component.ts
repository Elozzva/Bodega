/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../producto.service';  // Servicio de productos
import Swal from 'sweetalert2';  // Para las alertas de confirmación
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];  // Lista de productos

  constructor(
    private productoService: ProductService,  // Servicio para manejar productos
    private router: Router  // Router para la navegación
  ) {}

  ngOnInit(): void {
    this.cargarProductos();  // Cargar productos al iniciar
  }

  crearProducto(): void {
    this.router.navigate(['productos/create']);
  }

  // Función para cargar los productos desde el servicio
  cargarProductos(): void {
    this.productoService.getProducts().subscribe(
      (data) => this.productos = data,
      (error) => console.error('Error al cargar los productos:', error)
    );
  }

  // Función para eliminar un producto
  eliminarProducto(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProduct(id).subscribe(
          () => {
            this.productos = this.productos.filter(producto => producto._id !== id);  // Actualizar la lista local
            Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
          },
          (error) => Swal.fire('Error', 'Ocurrió un error al eliminar el producto', 'error')
        );
      }
    });
  }

  // Función para navegar a la edición de un producto
  editarProducto(id: string): void {
    this.router.navigate([`/productos/edit/${id}`]);
  }
}