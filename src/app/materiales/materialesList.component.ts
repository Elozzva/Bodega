/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../material.service';
import { Router } from '@angular/router';
//import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-materiales-list',
  templateUrl: './materialesList.component.html',
  styleUrls: ['./materialesList.component.css'] 

})
export class MaterialesListComponent implements OnInit {
  materials: any[] = [];

  constructor(
    private materialService: MaterialService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.materialService.getMaterials().subscribe(materials => {
      this.materials = materials;
    });
  }

  crearMaterial(): void {
    this.router.navigate(['materiales/create']);
  }

  editMaterial(id: string) {
    this.router.navigate(['/materiales/edit', id]);
  }

  //updateMaterialStock(materialId: string) {
  //  this.router.navigate(['/materiales/updatestock', materialId]); // Ajusta la ruta según tu configuración
  //}

  deleteMaterial(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialService.deleteMaterial(id)
          .subscribe(
            () => {
              this.materials = this.materials.filter(material => material._id !== id);
              Swal.fire('¡Éxito!', 'Material eliminado correctamente.', 'success');
            },
            (error) => {
              console.error('Error al eliminar el material:', error);
              Swal.fire('Error', 'Ocurrió un error al eliminar el material.', 'error');
            }
          );
      }
    });
  }
}
