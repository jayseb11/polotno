import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolotnoComponent } from './polotno/polotno.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'polotno', component: PolotnoComponent },
  { path: 'home', component: HomeComponent },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
