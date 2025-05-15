/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetaService } from '../receta.service';
import { MaterialService } from '../material.service';
import { PiezaService } from '../pieza.service';

@Component({
  selector: 'app-receta-form',
  templateUrl: './receta-form.component.html',
  styleUrls: ['./receta-form.component.css']
})
export class RecetaFormComponent implements OnInit {
  receta = {
    material: '',
    pieza: '',
    piezasPorUnidad: 1,
    seFabrica: ''
  };

  materiales: any[] = [];
  piezas: any[] = [];
  descripcionPieza = '';
  isEditMode = false;
  recetaYaExiste = false; // Nueva variable

  constructor(
    private recetaService: RecetaService,
    private materialService: MaterialService,
    private piezaService: PiezaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.materialService.getMaterials().subscribe(
      data => this.materiales = data,
      error => console.error('Error al cargar materiales', error)
    );

    this.piezaService.getPiezas().subscribe(
      data => this.piezas = data,
      error => console.error('Error al cargar piezas', error)
    );

    const recetaId = this.route.snapshot.paramMap.get('id');
    if (recetaId) {
      this.isEditMode = true;
      this.recetaService.getRecetaById(recetaId).subscribe(
        data => {
          this.receta = {
            material: data.material._id,
            pieza: data.pieza._id,
            piezasPorUnidad: data.piezasPorUnidad,
            seFabrica: data.seFabrica
          };
          this.descripcionPieza = data.pieza.descripcion;
        },
        error => console.error('Error al cargar receta', error)
      );
    }
  }

  onSeFabricaChange(): void {
    if (this.receta.seFabrica === 'no') {
      this.receta.material = '681c0de37577eee2d7ac3c89'; // Limpia el material si no se fabrica
    }
  }

  onPiezaChange(event: Event): void {
    const piezaId = (event.target as HTMLSelectElement).value;
    const piezaSeleccionada = this.piezas.find(p => p._id === piezaId);
    this.descripcionPieza = piezaSeleccionada?.descripcion || '';
  
    if (!this.isEditMode) {
      this.recetaService.getRecetaByPieza(piezaId).subscribe(
        recetaExistente => {
          if (recetaExistente && recetaExistente._id) {
            // Redirigir automáticamente al formulario de edición
            this.router.navigate(['/recetas/edit', recetaExistente._id]);
          }
        },
        error => {
          console.error('No se encontró receta para esta pieza. Puedes continuar.');
        }
      );
    }
  }

  onSubmit(): void {
    if (this.recetaYaExiste && !this.isEditMode) {
      alert('Ya existe una receta para esta pieza. No puedes crear otra.');
      return;
    }
    if (this.isEditMode) {
      this.recetaService.updateReceta(this.route.snapshot.paramMap.get('id')!, this.receta).subscribe(
        () => this.router.navigate(['/recetas']),
        error => console.error('Error al actualizar la receta', error)
      );
    } else {
      this.recetaService.createReceta(this.receta).subscribe(
        () => this.router.navigate(['/recetas']),
        error => console.error('Error al crear la receta', error)
      );
    }
  }

  cancelar(): void {
    this.router.navigate(['/recetas']);
  }
}
