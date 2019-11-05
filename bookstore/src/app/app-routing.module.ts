import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './Components/pages/Home/home.component';
import { CateComponent } from './Components/pages/Cate/cate.component';
import { DetailComponent } from './Components/pages/Detail/detail.component';


const routesConfig: Routes = [
  {path: 'cate', component:CateComponent},
  {path: 'detail', component: DetailComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  declarations: [
    HomeComponent, CateComponent, DetailComponent
  ],
  imports: [RouterModule.forRoot(routesConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
