/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../empleado.service';

@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.component.html',
  styleUrls: ['./empleado-form.component.css']
})
export class EmpleadoFormComponent implements OnInit {
  empleado = {
    nombre: '',
    apellido: ''
  };
  isEditMode = false;


  constructor(
    private empleadoService: EmpleadoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const empleadoId = this.route.snapshot.paramMap.get('id');
    if (empleadoId) {
      this.isEditMode = true;
      this.empleadoService.getEmpleadoById(empleadoId).subscribe(
        data => this.empleado = data,
        error => console.error('Error al cargar el empleado:', error)
      );
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.empleadoService.updateEmpleado(this.route.snapshot.paramMap.get('id')!, this.empleado).subscribe(
        () => this.router.navigate(['/empleados']),
        error => console.error('Error al actualizar el empleado:', error)
      );
    } else {
      this.empleadoService.createEmpleado(this.empleado).subscribe(
        () => this.router.navigate(['/empleados']),
        error => console.error('Error al crear el empleado:', error)
      );
    }
  }
   // Método para navegar de regreso
   navigateBack(): void {
    this.router.navigate(['/empleados']);  // Esto maneja la navegación
  }

}