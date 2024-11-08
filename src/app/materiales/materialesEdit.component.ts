import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '../material.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar FormBuilder y FormGroup


@Component({
  selector: 'app-materiales-edit',
  templateUrl: './materialesEdit.component.html',
  styleUrls: ['./materialesEdit.component.css']   

})
export class MaterialesEditComponent implements OnInit {
    material: any = {};
    materialForm: FormGroup= this.fb.group({ // Inicialización de materialForm
        name: ['', Validators.required],
        description: ['', Validators.required]
      });

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private materialService: MaterialService,
      private fb: FormBuilder // Inyectar FormBuilder
    ) {}
  
    ngOnInit() {
        this.materialForm = this.fb.group({ // Inicializar materialForm
          name: ['', Validators.required],
          description: ['', Validators.required]
        });
    
        const id = this.route.snapshot.paramMap.get('id');
        this.materialService.getMaterialById(id).subscribe((material: any) => {
          this.material = material;
          this.materialForm.patchValue(material); // Rellenar el formulario con los datos del material
        });
      }
  
      onSubmit() {
        const updatedMaterial = this.materialForm.value;
        this.materialService.editMaterial(this.material._id, updatedMaterial) .subscribe(
            () => {
              console.log('Material actualizado correctamente');
              this.router.navigate(['/materiales']);
            },
            error => {
              console.error('Error al actualizar el material:', error);
            }
          );
      }
  }