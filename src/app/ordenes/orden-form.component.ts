/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { OrdenService } from '../orden.service';
import { Router } from '@angular/router';
import { EmpleadoService } from '../empleado.service';

@Component({
  selector: 'app-orden-form',
  templateUrl: './orden-form.component.html',
  styleUrls: ['./orden-form.component.css']
})
export class OrdenFormComponent implements OnInit {
  productos: any[] = [];
  empleados: any[] = [];
  orden = {
    productos: [{ producto: '', cantidad: 1 }],
    fechaEntrega: '',
    empleado: '',  // Asegurarse de tener el empleado aquí
    estado: 'pendiente'
  };

  constructor(private ordenService: OrdenService, private empleadoService: EmpleadoService, private router: Router) {}

  ngOnInit(): void {
    this.ordenService.getProductos().subscribe(
      data => this.productos = data,
      error => console.error('Error al cargar los productos:', error)
    );

    // Cargar empleados
    this.empleadoService.getEmpleados().subscribe(
      data => this.empleados = data,
      error => console.error('Error al cargar los empleados:', error)
    );
  }

  

  // Agregar un nuevo producto a la orden
  agregarProducto(): void {
    this.orden.productos.push({ producto: '', cantidad: 1 });
  }

  // Eliminar un producto de la orden
  eliminarProducto(index: number): void {
    this.orden.productos.splice(index, 1);
  }

  // Enviar el formulario para crear la orden
  onSubmit(): void {
    this.ordenService.createOrden(this.orden).subscribe(
      () => this.router.navigate(['/ordenes']),
      error => console.error('Error al crear la orden:', error)
    );
  }
}
