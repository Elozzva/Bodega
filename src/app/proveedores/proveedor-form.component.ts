/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from '../proveedor.service';  // Importa tu servicio para gestionar proveedores

@Component({
  selector: 'app-proveedor-form',
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.css']
})
export class ProveedorFormComponent implements OnInit {
  proveedorForm!: FormGroup;  // Formulario reactivo
  isEditMode = false;  // Bandera para identificar si estamos en modo de edición

  constructor(
    private formBuilder: FormBuilder,
    private proveedorService: ProveedorService,  // Servicio de proveedores
    private router: Router,
    private route: ActivatedRoute  // Para obtener parámetros de la URL
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario reactivo
    this.proveedorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],  // Solo números, longitud de 10
      email: ['', [Validators.required, Validators.email]]  // Validación de email
    });

    // Comprobar si estamos en modo de edición
    const proveedorId = this.route.snapshot.paramMap.get('id');
    if (proveedorId) {
      this.isEditMode = true;
      this.proveedorService.getProveedorById(proveedorId).subscribe(
        (data) => this.proveedorForm.patchValue(data),
        (error) => console.error('Error al cargar el proveedor:', error)
      );
    }
  }

  // Manejar el envío del formulario
  onSubmit(): void {
    if (this.proveedorForm.valid) {
      if (this.isEditMode) {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.proveedorService.editProveedor(id, this.proveedorForm.value).subscribe(
          () => this.router.navigate(['/proveedores']),
          (error) => console.error('Error al actualizar el proveedor:', error)
        );
      } else {
        this.proveedorService.createProveedor(this.proveedorForm.value).subscribe(
          () => this.router.navigate(['/proveedores']),
          (error) => console.error('Error al crear el proveedor:', error)
        );
      }
    } else {
      console.log('Formulario no es válido');
    }
  }

  // Método para cancelar la operación y regresar a la lista de proveedores
  cancelar(): void {
    this.router.navigate(['/proveedores']);
  }
}
  

