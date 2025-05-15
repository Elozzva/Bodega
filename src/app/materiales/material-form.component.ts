/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '../material.service';

@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.css']
})
export class MaterialFormComponent implements OnInit {
  material = {
    clave: '',
    name: '',
    description: '',
    stockMinimo: 10
  };
  isEditMode = false;


  constructor(
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const materialId = this.route.snapshot.paramMap.get('id');
    if (materialId) {
      this.isEditMode = true;
      this.materialService.getMaterialById(materialId).subscribe(
        data => this.material = data,
        error => console.error('Error al cargar el material:', error)
      );
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.materialService.editMaterial(this.route.snapshot.paramMap.get('id')!, this.material).subscribe(
        () => this.router.navigate(['/materiales']),
        error => console.error('Error al actualizar el material:', error)
      );
    } else {
      this.materialService.createMaterial(this.material).subscribe(
        () => this.router.navigate(['/materiales']),
        error => console.error('Error al crear el material:', error)
      );
    }
  }

  cancelar() {
    this.router.navigate(['/materiales']);
  }
}