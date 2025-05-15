//<pre style="margin: 10px; color: #5c8fd0"> <code class=language-typescript>
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialService } from '../material.service'; // Servicio para interactuar con el backend
import { Router } from '@angular/router';


interface Material {
  _id: string;
  clave: string;
  name: string;
  description: string;
  stockMinimo: number;
}

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css'],

})
export class MaterialesComponent implements OnInit {
  materialForm: FormGroup;
  materiales: Material[] = [];

  constructor(private formBuilder: FormBuilder, 
    private materialService: MaterialService,
    private router: Router
    ) { 
    this.materialForm = this.formBuilder.group({
      clave: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      stockMinimo: [10, Validators.required]
    });
  }

  ngOnInit(): void {
    this.materialService.getMaterials().subscribe(materiales => {
      this.materiales = materiales;
    });
  }

  onSubmit() {
    if (this.materialForm.valid) {
      this.materialService.createMaterial(this.materialForm.value)
        .subscribe(
          (material) => {
            // Material creado exitosamente, agregar a la lista
            this.materiales.push(material);
            // Limpiar el formulario
            this.materialForm.reset();
            // Redirigir a la vista materialList
            this.router.navigate(['/materiales']);
          },
          (error) => {
            // Manejar errores
            console.error('Error al crear el material:', error);
          }
        );
    }
  }

  cancelar() {
    this.router.navigate(['/materiales']);
  }
}