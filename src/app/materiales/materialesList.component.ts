/* eslint-disable @typescript-eslint/no-inferrable-types */
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
  materialesFiltrados: any[] = [];  // Lista para búsqueda y ordenación
  searchText: string = '';  // Texto del campo de búsqueda

  columnaOrden: string = 'name';  // Columna inicial para ordenar
  ordenAscendente: boolean = true; // Estado del orden (ascendente o descendente)

  constructor(
    private materialService: MaterialService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.materialService.getMaterials().subscribe(
      (materials) => {
        this.materials = materials;
        this.materialesFiltrados = [...this.materials]; // Inicializa la lista con los materiales
        this.ordenar('name'); // Orden inicial por nombre
      },
      (error) => console.error('Error al cargar materiales:', error)
    );
  }

  // Filtrar materiales por nombre en tiempo real
  filtrarMateriales(): void {
    this.materialesFiltrados = this.materials.filter(material =>
      material.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.ordenar(this.columnaOrden); // Mantener el orden después de filtrar
  }

  // Ordenar materiales por cualquier columna
  ordenar(campo: string): void {
    if (this.columnaOrden === campo) {
      this.ordenAscendente = !this.ordenAscendente; // Alternar entre ascendente y descendente
    } else {
      this.columnaOrden = campo;
      this.ordenAscendente = true; // Reiniciar el orden cuando se cambia de columna
    }

    this.materialesFiltrados.sort((a, b) => {
      const valorA = a[campo] ? a[campo].toString().toLowerCase() : '';
      const valorB = b[campo] ? b[campo].toString().toLowerCase() : '';

      if (valorA < valorB) return this.ordenAscendente ? -1 : 1;
      if (valorA > valorB) return this.ordenAscendente ? 1 : -1;
      return 0;
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
