/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetaService } from '../receta.service';
import { NotificationService } from '../notification.service';
import { MaterialService } from '../material.service';

@Component({
  selector: 'app-receta-edit',
  templateUrl: './recetasEdit.component.html',
  styleUrls: ['./recetasEdit.component.css']
})
export class RecetasEditComponent implements OnInit {
    receta = {
        material: '',
        pieza: '',
        piezasPorUnidad: 1,
        seFabrica:''
      };
  recetaId: string;
  materiales: any[] = [];

  constructor(
    private recetaService: RecetaService,
    private materialService: MaterialService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recetaId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.materialService.getMaterials().subscribe(
      data => this.materiales = data,
      error => console.error('Error al cargar los materiales:', error)
    );

    this.recetaService.getRecetaById(this.recetaId).subscribe(
      (data) => {
        this.receta = data;
      },
      (error) => {
        this.notificationService.showError('Error al cargar la receta');
        console.error('Error al cargar la receta', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.recetaService.updateReceta(this.recetaId, this.receta).subscribe(
        () => {
            this.notificationService.showSuccess('Receta actualizada con éxito');
            this.router.navigate(['/recetas']);
        },
        (error) => {
            this.notificationService.showError('Error al actualizar la receta');
            console.error('Error al actualizar la receta', error);
        }
      );
    }
  }
}