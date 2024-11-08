/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PiezaService } from '../pieza.service';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
//import { RecetaService } from '../receta.service';

@Component({
  selector: 'app-pieza-form',
  templateUrl: './pieza-form.component.html',
  styleUrls: ['./pieza-form.component.css']
})
export class PiezaFormComponent {
  pieza = {
    nombre: '',
    descripcion: '',
    stockMinimo: 10
  };
  recetas: any[] = [];

  constructor(
    private piezaService: PiezaService,
    private notificationService: NotificationService,
    //private recetaService: RecetaService,
    private router: Router
  ) {}

  /* ngOnInit(): void {
    this.recetaService.getRecetas().subscribe(
      (data) => {
        this.recetas = data;
      },
      (error) => {
        this.notificationService.showError('Error al obtener las recetas');
        console.error('Error al obtener las recetas', error);
      }
    );
  } */

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.piezaService.createPieza(this.pieza).subscribe(
        () => {
            this.notificationService.showSuccess('Pieza creada con éxito');
            this.router.navigate(['piezas/']);
        },
        (error) => {
            this.notificationService.showError('Error al crear la pieza');
            console.error('Error al crear la pieza', error);
        }
      );
    }
  }
}