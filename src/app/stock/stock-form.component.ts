/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../stock.service';
import { MaterialService } from '../material.service';

@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.css']
})
export class StockFormComponent implements OnInit {
  stockMateriales: any[] = [];
  isEditMode = false;

  stock: any = {
    tipo: 'Material',
    cantidad: 0,
    material: ''
  };

  materiales: any[] = [];
  cantidadActual: number = 0;

  constructor(
    private stockService: StockService,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Verificar si vienen parámetros tipo e id desde query params
    this.route.queryParams.subscribe(params => {
      const tipo = params['tipo'];
      const id = params['id'];

      if (tipo && id) {
        this.stock.tipo = this.capitalizeFirst(tipo);
        if (tipo === 'material') {
          this.stock.material = id;
          this.onMaterialChange(); // Mostrar la cantidad actual
        }
      }
    });

    // Obtener todos los materiales para el select
    this.materialService.getMaterials().subscribe(
      data => {
        this.materiales = data;
        console.log('Materiales cargados:', this.materiales);
      },
      error => console.error('Error al cargar materiales:', error)
    );

    // Detectar si se está en modo edición
    const stockId = this.route.snapshot.paramMap.get('id');
    if (stockId) {
      this.isEditMode = true;
      this.stockService.getStockById(stockId).subscribe(
        data => {
          this.stock = data;
          this.onMaterialChange(); // Mostrar la cantidad actual
        },
        error => console.error('Error al cargar el stock:', error)
      );
    }
  }

  // Capitalizar texto (para el tipo)
  capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Mostrar la cantidad actual del material seleccionado
  onMaterialChange(): void {
    const materialSeleccionado = this.stock.material;
    if (materialSeleccionado) {
      this.stockService.getStockByMaterial2(materialSeleccionado).subscribe(
        data => {
          this.cantidadActual = data?.cantidad || 0;
          console.log(`Cantidad actual del material ${materialSeleccionado}:`, this.cantidadActual);
        },
        error => {
          console.error('Error al obtener la cantidad del material:', error);
          this.cantidadActual = 0;
        }
      );
    } else {
      this.cantidadActual = 0;
    }
  }

  onSubmit(): void {
    const stockData: any = {
      tipo: 'Material',
      cantidad: this.stock.cantidad,
      materialId: this.stock.material
    };

    if (!this.stock.material) {
      console.error('Error: El material es obligatorio');
      return;
    }

    if (this.isEditMode) {
      const stockId = this.route.snapshot.paramMap.get('id')!;
      this.stockService.updateStock(stockId, stockData).subscribe(
        () => this.router.navigate(['/stocks']),
        error => console.error('Error al actualizar el stock:', error)
      );
    } else {
      this.stockService.createStock(stockData).subscribe(
        () => this.router.navigate(['/stocks']),
        error => console.error('Error al crear el stock:', error)
      );
    }
  }

  cancelar(): void {
    this.router.navigate(['/stocks']);
  }
}
