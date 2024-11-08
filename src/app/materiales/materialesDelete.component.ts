import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '../material.service';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
    selector: 'app-materiales-deleted',
    templateUrl: './materialesDelete.component.html',
    styleUrls: ['./materialesDelete.component.css']
})
export class MaterialesDeleteComponent implements OnInit {
    materialId: string | null = null; // Almacenará el ID del material
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private materialService: MaterialService
      ) {}

    ngOnInit() {
      console.log('id', this.materialId);
      this.materialId = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la ruta
  }

  deleteMaterial() {
    if (this.materialId) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor:   
 '#d33',
        confirmButtonText: 'Sí, eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.materialService.deleteMaterial(this.materialId!)   

            .subscribe(
              () => {
                Swal.fire('¡Éxito!', 'Material eliminado correctamente.', 'success')
                  .then(() => {
                    this.router.navigate(['/lista-de-materiales']);
                  });
              },
              (error) => {
                Swal.fire('Error', 'Ocurrió un error al eliminar el material.', 'error');
                console.error('Error al eliminar el material:', error);
              }
            );
        }
      });
    } else {
      Swal.fire('Error', 'No se encontró el material a eliminar.', 'error');
      console.error('ID de material no encontrado');
    }
  }
}