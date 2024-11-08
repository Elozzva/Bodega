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

  isEditMode = false;
  isStockAvailable = true;

  constructor(
    private fabricacionService: FabricacionService,
    private materialService: MaterialService,
    private recetaService: RecetaService,  
    private proveedorService: ProveedorService,
    private empleadoService: EmpleadoService,
    private router: Router,
    private route: ActivatedRoute
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

  // Función para manejar el cambio de la pieza seleccionada
  onPiezaChange(event: any): void {
    const piezaId = (event.target as HTMLSelectElement).value;

    // Buscar la receta que coincide con la pieza seleccionada
    const recetaSeleccionada = this.recetas.find(receta => receta.pieza._id === piezaId);
    
    if (recetaSeleccionada) {
      this.fabricacion.tipo = recetaSeleccionada.seFabrica; // Asignar automáticamente el tipo basado en la receta
      this.fabricacion.receta = recetaSeleccionada._id; // Establecer la receta seleccionada
      this.fabricacion.material = recetaSeleccionada.material._id; // Asignar el material de la receta seleccionada

      // Verificar el stock del material asignado
      this.materialService.obtenerStockPorMaterial(recetaSeleccionada.material._id).subscribe(
        stock => {
          if (stock && stock.cantidad > 0) {
            this.isStockAvailable = true;  // Stock suficiente
          } else {
            this.isStockAvailable = false;  // Deshabilitar botón si el stock es insuficiente
            alert(`El stock del material seleccionado es insuficiente.`);
          }
        },
        error => console.error('Error al verificar el stock del material:', error)
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
  
            this.stockBajo = stockDisponible < stockMinimo;
  
            if (this.stockBajo) {
              alert(`El stock del material está por debajo del mínimo. Stock actual: ${stockDisponible}, Stock mínimo: ${stockMinimo}`);
            }
  
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

  onRecetaChange(): void {
    const recetaSeleccionada = this.recetas.find(r => r._id === this.fabricacion.receta);
    
    if (recetaSeleccionada) {
        this.fabricacion.tipo = recetaSeleccionada.seFabrica;  // Asignar 'interna' o 'externa' según la receta
        this.fabricacion.material = recetaSeleccionada.material._id; // Asignar el material automáticamente

        // Validar el stock disponible del material
        this.materialService.obtenerStockPorMaterial(this.fabricacion.material).subscribe(
          stock => {
            this.isStockAvailable = stock && stock.cantidad > 0;
            if (!this.isStockAvailable) {
              alert('Stock insuficiente para el material seleccionado.');
            }
          },
          error => console.error('Error al verificar el stock del material:', error)
        );
    }
}

  // Función que maneja la selección de tipo de fabricación
  onTipoChange(event: Event): void {
    const tipoSeleccionado = (event.target as HTMLSelectElement)?.value;

    if (tipoSeleccionado === 'interna') {
      this.empleadoService.getEmpleados().subscribe(
        data => {
          this.empleados = data;
          this.proveedores = [];
        },
        error => console.error('Error al cargar empleados:', error)
      );
    } else if (tipoSeleccionado === 'externa') {
      this.proveedorService.getProveedores().subscribe(
        data => {
          this.proveedores = data;
          this.empleados = [];
        },
        error => console.error('Error al cargar proveedores:', error)
      );
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