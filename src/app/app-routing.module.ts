/*import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './formulario/formulario.component';
import { ResultadosComponent } from './resultados/resultados.component';

const routes: Routes = [
  { path: '', component: FormularioComponent },  // Directo al formulario al cargar la app
  { path: 'formulario', component: FormularioComponent },
  { path: 'resultados', component: ResultadosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
