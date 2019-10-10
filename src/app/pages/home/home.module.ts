import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { pages } from "./pages";
import { DashboardProgressComponent } from "./pages/home/components/dashboard-progress/dashboard-progress.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EffectsModule } from "@ngrx/effects";
import { effects } from "./store/effects";
import { reducers } from "./store/reducers";
import { ResourceFormComponent } from "./pages/home/components/resource-form/resource-form.component";

@NgModule({
  declarations: [...pages, DashboardProgressComponent, ResourceFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HomeRoutingModule,
    ...reducers,
    EffectsModule.forFeature(effects)
  ],
  entryComponents: [ResourceFormComponent, DashboardProgressComponent],
  exports: [ResourceFormComponent]
})
export class HomeModule {}
