import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';  



import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AppRoutingModule } from './app-routing.module';

import { EmpleadoService } from './empleado.service';
import { EmpleadoFormComponent } from './empleados/empleado-form.component';
import { EmpleadosComponent } from './empleados/empleados.component';

import { ClienteService } from './cliente.service';
import { ClienteFormComponent } from './clientes/cliente-form.component';
import { ClientesComponent } from './clientes/clientes.component';

import { ProveedorService } from './proveedor.service';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedorFormComponent } from './proveedores/proveedor-form.component';

import { MaterialService } from './material.service';
import { MaterialesComponent } from './materiales/materiales.component'; // Import MaterialesComponent que sirve para agregar Material
import { MaterialesListComponent } from './materiales/materialesList.component';
import { MaterialesEditComponent } from './materiales/materialesEdit.component';
import { MaterialFormComponent } from './materiales/material-form.component'; // Importa el módulo de la directiva
//import { MaterialesDeleteComponent } from './materiales/materialesDelete.component'; // Import MaterialesDeleteComponent

import { OrdenService } from './orden.service';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { OrdenFormComponent } from './ordenes/orden-form.component';

import { PiezaService } from './pieza.service';
import { PiezasComponent } from './piezas/piezas.component';
import { PiezaFormComponent } from './piezas/pieza-form.component';
import { PiezasEditComponent } from './piezas/piezasEdit.component';

import { ProductService } from './producto.service';
import { ProductosComponent } from './productos/productos.component';
import { ProductoFormComponent } from './productos/producto-form.component';

import { RecetaService } from './receta.service';
import { RecetasComponent } from './recetas/recetas.component';
import { RecetaFormComponent } from './recetas/receta-form.component';
import { RecetasEditComponent } from './recetas/recetasEdit.component';

import { StockService } from './stock.service';
import { StockComponent } from './stock/stock.component';
import { StockFormComponent } from './stock/stock-form.component';


//import { NgIfInstanceofDirective } from './directivas/ng-if-instanceof.directive'; // Importa la directiva NgIfInstanceofDirective que se usará en MaterialesListComponent
import { CustomDirectiveModule } from './directivas/custom-directives.module';
import { FabricacionService } from './fabricacion.service';
import { FabricacionesComponent } from './fabricaciones/fabricaciones.component';
import { FabricacionFormComponent } from './fabricaciones/fabricacion-form.component';





@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    MaterialesComponent, // Agrega MaterialesComponent aquí
    MaterialesListComponent, // Agrega MaterialesListComponent aquí
    MaterialesEditComponent, // Agrega MaterialesEditComponent aquí
    MaterialFormComponent,

    OrdenesComponent,
    OrdenFormComponent,
    
    PiezasComponent, // Agrega PiezasComponent aquí
    PiezaFormComponent, 
    PiezasEditComponent, // Agrega PiezasEditComponent aquí
  
    ProductosComponent, // Agrega ProductosComponent aquí
    ProductoFormComponent, 
    
    StockComponent,  
    StockFormComponent, 
    
    RecetasComponent,
    RecetaFormComponent,  // Agrega RecetaFormComponent aquí
    RecetasEditComponent, 
    
    FabricacionesComponent,
    FabricacionFormComponent,

    EmpleadosComponent, 
    EmpleadoFormComponent,

    ClientesComponent, 
    ClienteFormComponent,

    ProveedoresComponent,
    ProveedorFormComponent,  // Agrega ProveedorFormComponent aquí

    //NgIfInstanceofDirective

  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule, // Incluye el módulo de enrutamiento
    CustomDirectiveModule // Importa el módulo de la directiva
  ],
  providers: [
    EmpleadoService, 
    ClienteService,
    ProveedorService, 
    MaterialService, 
    OrdenService,  
    ProductService, 
    PiezaService, 
    StockService,
    FabricacionService,
    RecetaService],
  bootstrap: [AppComponent],

  schemas: [NO_ERRORS_SCHEMA]
})

export class AppModule { }
