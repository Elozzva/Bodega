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
  stock: any = {tipo: 'Material'};  // Solo Material, se inicializa como 'Material'

  materiales: any[] = [];  // Inicializamos la lista de materiales

  constructor(
    private stockService: StockService,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener los materiales para el formulario
    this.materialService.getMaterials().subscribe(
      data => {
        this.materiales = data;
        console.log('Materiales cargados:', this.materiales);  // Verifica si se cargan los materiales
      },
      error => console.error('Error al cargar materiales:', error)
    );

    const stockId = this.route.snapshot.paramMap.get('id');
    if (stockId) {
      this.isEditMode = true;
      this.stockService.getStockById(stockId).subscribe(
        data => {
          this.stock = data;
        },
        error => console.error('Error al cargar el stock:', error)
      );
    }
  }

  onSubmit(): void {
    const stockData: any = {
      tipo: 'Material',  // Se define el tipo como 'Material'
      cantidad: this.stock.cantidad,
      materialId: this.stock.material  // Asignamos el material seleccionado
    };

    if (!this.stock.material) {
      console.error('Error: El material es obligatorio');
      return;
    }

    // Si estamos en modo de edición, actualizamos el stock
    if (this.isEditMode) {
      this.stockService.updateStock(this.route.snapshot.paramMap.get('id')!, stockData).subscribe(
        () => this.router.navigate(['/stocks']),
        error => console.error('Error al actualizar el stock:', error)
      );
    } else {
      // Crear un nuevo registro de stock para material
      this.stockService.createStock(stockData).subscribe(
        () => this.router.navigate(['/stocks']),
        error => console.error('Error al crear el stock:', error)
      );
    }
  } 
}
