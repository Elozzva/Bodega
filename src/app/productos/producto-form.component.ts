/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../producto.service';
import { PiezaService } from '../pieza.service';  // Servicio para obtener piezas

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  producto = {
    clave: '',
    name: '',
    description: '',
    piezas: [{ pieza: '', cantidad: 0 }]  // Inicializamos con una pieza vacía
  };
  
  piezasDisponibles: any[] = [];  // Lista de piezas disponibles para seleccionar
  isEditMode = false;

  constructor(
    private productoService: ProductService,
    private piezaService: PiezaService,  // Servicio para cargar las piezas disponibles
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const productoId = this.route.snapshot.paramMap.get('id');
    
    if (productoId) {
      this.isEditMode = true;
      this.productoService.getProductoById(productoId).subscribe(
        data => this.producto = data,
        error => console.error('Error al cargar el producto:', error)
      );
    }

    // Cargar las piezas disponibles para seleccionar en el formulario
    this.piezaService.getPiezas().subscribe(
      data => {
        this.piezasDisponibles = data,
        console.log('Piezas cargadas disponibles:', this.piezasDisponibles);
      },
      error => console.error('Error al cargar las piezas:', error)
    );
  }

  // Función para agregar una fila más de pieza y cantidad
  agregarPieza(): void {
    this.producto.piezas.push({ pieza: '', cantidad: 0 });
  }

  // Función para eliminar una fila de pieza
  eliminarPieza(index: number): void {
    this.producto.piezas.splice(index, 1);
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.productoService.editProducto(this.route.snapshot.paramMap.get('id')!, this.producto).subscribe(
        () => this.router.navigate(['/productos']),
        error => console.error('Error al actualizar el producto:', error)
      );
    } else {
      this.productoService.createProducts(this.producto).subscribe(
        () => this.router.navigate(['/productos']),
        error => console.error('Error al crear el producto:', error)
      );
    }
  }

  // Cancelar y regresar a la lista de productos
  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}