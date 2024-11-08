import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmpleadoFormComponent } from './empleados/empleado-form.component';
import { EmpleadosComponent } from './empleados/empleados.component';

import { ClienteFormComponent } from './clientes/cliente-form.component';
import { ClientesComponent } from './clientes/clientes.component';

import { FabricacionFormComponent } from './fabricaciones/fabricacion-form.component';
import { FabricacionesComponent } from './fabricaciones/fabricaciones.component';

import { MaterialesComponent } from './materiales/materiales.component';
import { MaterialesListComponent } from './materiales/materialesList.component';
import { MaterialesEditComponent } from './materiales/materialesEdit.component';
import { MaterialesDeleteComponent } from './materiales/materialesDelete.component';

import { OrdenesComponent } from './ordenes/ordenes.component';
import { OrdenFormComponent } from './ordenes/orden-form.component';

import { PiezasComponent } from './piezas/piezas.component';
import { PiezaFormComponent } from './piezas/pieza-form.component';
import { PiezasEditComponent } from './piezas/piezasEdit.component';

import { ProductosComponent } from './productos/productos.component';
import { ProductoFormComponent } from './productos/producto-form.component';

import { StockComponent } from './stock/stock.component';
import { StockFormComponent } from './stock/stock-form.component';

import { RecetasComponent } from './recetas/recetas.component';
import { RecetaFormComponent } from './recetas/receta-form.component';

import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedorFormComponent } from './proveedores/proveedor-form.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'empleados', component: EmpleadosComponent },
  { path: 'empleados/create', component: EmpleadoFormComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/create', component: ClienteFormComponent },
  { path: 'fabricaciones', component: FabricacionesComponent },
  { path: 'fabricaciones/create', component: FabricacionFormComponent }, // Crear una nueva fabricación
  { path: 'fabricaciones/:id/edit', component: FabricacionFormComponent }, // Editar una fabricación
  { path: 'fabricaciones/:id/estado', component: FabricacionFormComponent }, // Actualizar el estado de la fabricación (por ejemplo, cancelada o completada)
  { path: 'fabricaciones/:id/completar', component: FabricacionFormComponent }, // Completar fabricación
  
  { path: 'materiales', component: MaterialesListComponent },
  { path: 'materiales/create', component: MaterialesComponent },
  { path: 'materiales/edit/:id', component: MaterialesEditComponent },
  { path: 'materiales/delete/:id', component: MaterialesDeleteComponent },
  { path: 'ordenes', component: OrdenesComponent},
  { path: 'ordenes/create', component: OrdenFormComponent},
  { path: 'piezas', component: PiezasComponent},
  { path: 'piezas/crear', component: PiezaFormComponent },
  { path: 'piezas/edit/:id', component: PiezasEditComponent},
  { path: 'productos', component: ProductosComponent},
  { path: 'productos/create', component: ProductoFormComponent},
  { path: 'stocks', component:StockComponent},
  { path: 'stocks/create', component: StockFormComponent},
  { path: 'recetas', component:RecetasComponent},
  { path: 'recetas/create', component:RecetaFormComponent}, 
  { path: 'recetas/edit/:id', component: RecetaFormComponent },
  { path: 'proveedores', component: ProveedoresComponent},
  { path: 'proveedores/create', component: ProveedorFormComponent},
  { path: '', redirectTo: '/proveedores', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
