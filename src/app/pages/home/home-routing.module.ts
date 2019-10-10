import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "procedures/corporate-affairs",
    pathMatch: "full"
  },
  {
    path: "procedures/:id",
    component: HomeComponent
  },
  {
    path: "forms/:id",
    component: HomeComponent
  },
  {
    path: "forms",
    redirectTo: "forms/compliance",
    pathMatch: "full"
  },
  {
    path: "procedures",
    redirectTo: "procedures/corporate-affairs",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
