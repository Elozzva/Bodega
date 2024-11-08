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
  isEditMode = false;

  descripcionPieza = '';

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
      error => console.error('Error al cargar los materiales:', error)
    );

    this.piezaService.getPiezas().subscribe(
      data => this.piezas = data,
      error => console.error('Error al cargar las piezas:', error)
    );
    this.checkEditMode();

    const recetaId = this.route.snapshot.paramMap.get('id');
    if (recetaId) {
      this.isEditMode = true;
      this.cargarReceta(recetaId);
    }
  }

  checkEditMode(): void {
    const recetaId = this.route.snapshot.paramMap.get('id');
    if (recetaId) {
      this.isEditMode = true;
      this.recetaService.getRecetaById(recetaId).subscribe(
        data => this.receta = data,
        error => console.error('Error al cargar la receta:', error)
      );
    }
  }

  cargarReceta(recetaId: string): void {
    this.recetaService.getRecetaById(recetaId).subscribe(
      (data) => {
        this.receta = {
          material: data.material._id,  // solo ID para evitar [object Object]
          pieza: data.pieza._id,
          piezasPorUnidad: data.piezasPorUnidad,
          seFabrica: data.seFabrica
        };
        this.descripcionPieza = this.piezas.find(pieza => pieza._id === data.pieza._id)?.descripcion || '';
      },
      error => console.error('Error al cargar la receta:', error)
    );
  }

  onPiezaChange(event: Event): void {
    const piezaId = (event.target as HTMLSelectElement).value;

    // Consultar la receta para la pieza seleccionada para obtener el material necesario
    this.recetaService.getRecetaByPieza(piezaId).subscribe(
      (receta) => {
        this.receta.pieza = piezaId;
        this.descripcionPieza = this.piezas.find(pieza => pieza._id === piezaId)?.descripcion || '';
        this.receta.material = receta.material;  // Asignar el ID del material en receta
      },
      error => {
        console.error('Error al obtener la receta para la pieza seleccionada:', error);
        this.receta.material = '';  // Limpiar el material si no se encuentra la receta
      }
    );
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.recetaService.updateReceta(this.route.snapshot.paramMap.get('id')!, this.receta).subscribe(
        () => this.router.navigate(['/recetas']),
        error => console.error('Error al actualizar la receta:', error)
      );
    } else {
      this.recetaService.createReceta(this.receta).subscribe(
        () => this.router.navigate(['/recetas']),
        error => console.error('Error al crear la receta:', error)
      );
    }
  }
}