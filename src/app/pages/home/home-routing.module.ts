import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { PageDesignComponent } from "./pages/home/components/page-design/page-design.component";

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
  },
  {
    path: "page-design",
    redirectTo: "page-design/home-htmlCodes",
    pathMatch: "full"
  },
  {
    path: "page-design/:id",
    component: PageDesignComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
