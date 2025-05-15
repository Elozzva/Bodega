/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../producto.service';
import { PiezaService } from '../pieza.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-producto-edit',
  templateUrl: './producto-edit.component.html',
  styleUrls: ['./producto-edit.component.css']
})
export class ProductoEditComponent implements OnInit {
  productoForm: FormGroup;
  piezasDisponibles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductService,
    private piezaService: PiezaService,
    private fb: FormBuilder
  ) {
    // Inicializar el formulario
    this.productoForm = this.fb.group({
      clave: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      piezas: this.fb.array([])  // Usamos FormArray para manejar las piezas
    });
  }

  ngOnInit(): void {
    const productoId = this.route.snapshot.paramMap.get('id');
    if (productoId) {
      this.productoService.getProductoById(productoId).subscribe(
        (producto) => {
          this.productoForm.patchValue({
            clave: producto.clave,
            name: producto.name,
            description: producto.description
          });
          this.setPiezas(producto.piezas);  // Cargar piezas correctamente
        },
        (error) => console.error('Error al cargar el producto:', error)
      );
    }

    // Cargar piezas disponibles
    this.piezaService.getPiezas().subscribe(
      (data) => (this.piezasDisponibles = data),
      (error) => console.error('Error al cargar las piezas:', error)
    );
  }

  // Función para asignar las piezas al FormArray
  setPiezas(piezas: any[]): void {
    const piezasArray = this.productoForm.get('piezas') as FormArray;
    piezasArray.clear(); // Limpiar antes de cargar
    piezas.forEach((pieza) => {
      piezasArray.push(this.fb.group({
        pieza: [pieza.pieza._id, Validators.required],  // Asegurarse de que se carga el ID
        cantidad: [pieza.cantidad, Validators.required]
      }));
    });
  }

  get piezas(): FormArray {
    return this.productoForm.get('piezas') as FormArray;
  }

  // Agregar pieza manualmente
  agregarPieza(): void {
    this.piezas.push(this.fb.group({
      pieza: ['', Validators.required],
      cantidad: [1, Validators.required]
    }));
  }

  // Eliminar pieza del array
  eliminarPieza(index: number): void {
    this.piezas.removeAt(index);
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      return;
    }

    const productoId = this.route.snapshot.paramMap.get('id');
    this.productoService.editProducto(productoId!, this.productoForm.value).subscribe(
      () => this.router.navigate(['/productos']),
      (error) => console.error('Error al actualizar el producto:', error)
    );
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}
