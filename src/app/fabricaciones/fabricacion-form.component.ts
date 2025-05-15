/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FabricacionService } from '../fabricacion.service';
import { MaterialService } from '../material.service';
import { ProveedorService } from '../proveedor.service';
import { EmpleadoService } from '../empleado.service'; 
import { RecetaService } from '../receta.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-fabricacion-form',
  templateUrl: './fabricacion-form.component.html',
  styleUrls: ['./fabricacion-form.component.css']
})

export class FabricacionFormComponent implements OnInit {
  
  isCheckingStock = false;
  fabricacion = {
    tipo: 'interna',  // Valor predeterminado
    material: '',
    receta: '',
    cantidadMaterial: 0,
    piezasCalculadas: 0,
    proveedor: '',
    empleado: '',
    fechaEntrega: new Date(),
    estado: 'pendiente'  
  };


  materiales: any[] = [];
  recetas: any[] = [];
  piezas: any[] = [];
  proveedores: any[] = [];
  empleados: any[] = [];

  // Inicialización de stockBajo
  stockBajo = false;
  stockDisponible: number | null = null;
  isEditMode = false;
  isStockAvailable: any;

  constructor(
    private fabricacionService: FabricacionService,
    private materialService: MaterialService,
    private recetaService: RecetaService,  
    private proveedorService: ProveedorService,
    private empleadoService: EmpleadoService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.materialService.getMaterials().subscribe(
      data => {
        this.materiales = data;
        console.log('Materiales cargados:', this.materiales);
      },
      error => console.error('Error al cargar materiales:', error)
    );

    this.recetaService.getRecetas().subscribe(
      data => {
        this.recetas = data;
        console.log('Recetas cargadas:', this.recetas);
      },
      error => console.error('Error al cargar recetas:', error)
    );

    this.proveedorService.getProveedores().subscribe(
      data => {
        this.proveedores = data;
        console.log('Proveedores cargados:', this.proveedores);
      },
      error => console.error('Error al cargar proveedores:', error)
    );

    this.empleadoService.getEmpleados().subscribe(
      data => {
        this.empleados = data;
        console.log('Empleados cargados:', this.empleados);
      },
      error => console.error('Error al cargar empleados:', error)
    );

    const fabricacionId = this.route.snapshot.paramMap.get('id');
    if (fabricacionId) {
      this.isEditMode = true;
      this.fabricacionService.getFabricacionById(fabricacionId).subscribe(
        (data) => this.fabricacion = data,
        error => console.error('Error al cargar la fabricación:', error)
      );
    }
  }


  // Función que se ejecuta cuando se selecciona un material
  onMaterialChange(event: any): void {
    const materialId = (event.target as HTMLSelectElement)?.value;
    
    console.log('Material cambiado:', materialId);

    if (materialId && !this.isCheckingStock) { // Solo permite una verificación a la vez
      this.isCheckingStock = true;
  
      this.materialService.obtenerStockPorMaterial(materialId).subscribe(
        stock => {
          if (stock && stock.material) {
            const stockDisponible = stock.cantidad;
            const stockMinimo = stock.material.stockMinimo;
            this.stockDisponible = stock.cantidad;
            this.stockBajo = stockDisponible < stockMinimo;
            
  
            this.recetaService.getRecetasByMaterial(materialId).subscribe(
              data => {
                this.recetas = data;  // Solo las recetas que usan el material seleccionado
                
                this.piezas = this.recetas.map(receta => receta.pieza);  // Mapear para obtener solo las piezas de estas recetas
                console.log('Piezas disponibles para el material seleccionado:', this.piezas);
              },
              error => console.error('Error al cargar las piezas disponibles para el material:', error)
            );
          } else {
            console.error('Material o stock no encontrado.');
          }
          this.isCheckingStock = false;
        },
        error => {
          console.error('Error al verificar el stock:', error);
          this.isCheckingStock = false;
        }
      );
    }
  }

  /* onRecetaChange(): void {
    const recetaSeleccionada = this.recetas.find(r => r._id === this.fabricacion.receta);
    if (recetaSeleccionada && this.fabricacion.cantidadMaterial > 0) {
      this.fabricacion.piezasCalculadas = recetaSeleccionada.piezasPorUnidad * this.fabricacion.cantidadMaterial;
    }
  } */

    onRecetaChange(): void {
      const recetaSeleccionada = this.recetas.find(receta => receta._id === this.fabricacion.receta);
    
      if (recetaSeleccionada) {
        console.log('Receta seleccionada:', recetaSeleccionada);
    
        // Asigna el tipo de fabricación basado en la receta seleccionada
        this.fabricacion.tipo = recetaSeleccionada.seFabrica;
    
        console.log('Tipo de fabricación asignado:', this.fabricacion.tipo);
    
        this.fabricacion.material = recetaSeleccionada.material; // Mantiene el material asociado
    
        // Actualiza la cantidad de piezas calculadas
        if (this.fabricacion.cantidadMaterial > 0) {
          this.fabricacion.piezasCalculadas = 
            recetaSeleccionada.piezasPorUnidad * this.fabricacion.cantidadMaterial;
        }
    
        // Cargar empleados o proveedores según el tipo
        this.cargarRecursosPorTipo(this.fabricacion.tipo);
      } else {
        console.error('No se encontró la receta seleccionada.');
      }
    }

    cargarRecursosPorTipo(tipo: string): void {
      if (tipo === 'interna') {
        this.empleadoService.getEmpleados().subscribe(
          data => {
            this.empleados = data;
            this.proveedores = []; // Limpia los proveedores si el tipo es interna
          },
          error => console.error('Error al cargar empleados:', error)
        );
      } else if (tipo === 'externa') {
        this.proveedorService.getProveedores().subscribe(
          data => {
            this.proveedores = data;
            this.empleados = []; // Limpia los empleados si el tipo es externa
          },
          error => console.error('Error al cargar proveedores:', error)
        );
      }
    }
    

  // Actualiza dinámicamente empleados o proveedores según el tipo de fabricación
actualizarTipoFabricacion(): void {
  if (this.fabricacion.tipo === 'interna') {
    this.empleadoService.getEmpleados().subscribe(
      data => {
        this.empleados = data;
        this.proveedores = []; // Limpiar lista de proveedores
      },
      error => console.error('Error al cargar empleados:', error)
    );
  } else if (this.fabricacion.tipo === 'externa') {
    this.proveedorService.getProveedores().subscribe(
      data => {
        this.proveedores = data;
        this.empleados = []; // Limpiar lista de empleados
      },
      error => console.error('Error al cargar proveedores:', error)
    );
  }
}

onPiezaChange(event: any): void {
  const piezaId = (event.target as HTMLSelectElement)?.value;

  const recetaSeleccionada = this.recetas.find(receta => receta.pieza._id === piezaId);

  if (recetaSeleccionada) {
    console.log('Receta seleccionada:', recetaSeleccionada); // Verificar receta seleccionada
    this.fabricacion.tipo = recetaSeleccionada.seFabrica; // Actualizar el tipo según la receta
    console.log('Tipo de fabricación asignado:', this.fabricacion.tipo); // Verificar tipo
    this.fabricacion.receta = recetaSeleccionada._id;
    this.fabricacion.material = recetaSeleccionada.material._id;

    this.actualizarTipoFabricacion(); // Actualizar empleados o proveedores
  } else {
    console.error('Receta no encontrada para la pieza seleccionada');
  }
}



  onSubmit(): void {
    const fabricacionData = {
      tipo: this.fabricacion.tipo,
      materialId: this.fabricacion.material,
      materialUsar: this.fabricacion.cantidadMaterial,
      cantidadFabricar: this.fabricacion.piezasCalculadas,
      recetaId: this.fabricacion.receta,
      proveedorId: this.fabricacion.tipo === 'externa' ? this.fabricacion.proveedor : undefined,
      empleadoId: this.fabricacion.tipo === 'interna' ? this.fabricacion.empleado : undefined,
      fechaEntrega: this.fabricacion.fechaEntrega  
    };

    if (this.isEditMode) {
      this.fabricacionService.updateFabricacion(this.route.snapshot.paramMap.get('id')!, fabricacionData).subscribe(
        () => this.router.navigate(['/fabricaciones']),
        error => console.error('Error al actualizar la fabricación:', error)
      );
    } else {
      this.fabricacionService.crearFabricacion(fabricacionData).subscribe(
        () => this.router.navigate(['/fabricaciones']),
        error => console.error('Error al crear la fabricación:', error)
      );
    }
  }

  cancelar(): void {
    this.router.navigate(['/fabricaciones']);
  }
}