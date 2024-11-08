/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { RecetaService } from '../receta.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css']
})
export class RecetasComponent implements OnInit {
  recetas: any[] = [];

  constructor(
    private recetaService: RecetaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.recetaService.getRecetas().subscribe(
      data => this.recetas = data,
      error => console.error('Error al cargar las recetas:', error)
    );
  }

  crearReceta(): void {
    this.router.navigate(['recetas/create']);
  }

  editarReceta(recetaId: string): void {
    this.router.navigate([`/recetas/edit/${recetaId}`]);
  }

  deleteReceta(id: string) {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta receta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.recetaService.deleteReceta(id)
          .subscribe(
            () => {
              this.recetas = this.recetas.filter(receta => receta._id !== id);
              Swal.fire('¡Éxito!', 'Receta eliminada correctamente.', 'success');
            },
            (error) => {
              console.error('Error al eliminar el receta:', error);
              Swal.fire('Error', 'Ocurrió un error al eliminar la receta.', 'error');
            }
          );
      }
    });
  }
  
}
