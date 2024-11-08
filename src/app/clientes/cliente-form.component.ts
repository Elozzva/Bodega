/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  cliente = {
    nombre: '',
    apellido: ''
  };
  isEditMode = false;


  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (clienteId) {
      this.isEditMode = true;
      this.clienteService.getClienteById(clienteId).subscribe(
        data => this.cliente = data,
        error => console.error('Error al cargar el cliente:', error)
      );
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.clienteService.updateCliente(this.route.snapshot.paramMap.get('id')!, this.cliente).subscribe(
        () => this.router.navigate(['/clientes']),
        error => console.error('Error al actualizar el cliente:', error)
      );
    } else {
      this.clienteService.createCliente(this.cliente).subscribe(
        () => this.router.navigate(['/clientes']),
        error => console.error('Error al crear el cliente:', error)
      );
    }
  }
   // Método para navegar de regreso
   navigateBack(): void {
    this.router.navigate(['/clientes']);  // Esto maneja la navegación
  }

}