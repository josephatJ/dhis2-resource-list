import { HttpClient, HttpClientModule } from "@angular/common/http";
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { NgxDhis2HttpClientModule } from "@iapps/ngx-dhis2-http-client";
import { NgxDhis2MenuModule } from "@iapps/ngx-dhis2-menu";
import { EffectsModule } from "@ngrx/effects";
import {
  RouterStateSerializer,
  StoreRouterConnectingModule
} from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { RoutingModule } from "./app.routes";
import { CoreModule, RouteSerializer } from "./core";
import { effects } from "./store/effects";
import { metaReducers, reducers } from "./store/reducers";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "./shared/shared.module";
import { NgxTinymceEditorModule } from "ngx-tinymce-editor";
import { NgxTinymceModule } from "ngx-tinymce";

import { MonacoEditorModule } from "ngx-monaco-editor";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    NgxDhis2HttpClientModule.forRoot({
      version: 1,
      namespace: "iapps",
      models: {}
    }),
    NgxTinymceEditorModule.forRoot(),
    NgxTinymceModule.forRoot({
      baseURL: "./assets/tinymce/"
    }),
    MonacoEditorModule.forRoot(),
    /**
     * Menu  module
     */
    NgxDhis2MenuModule,

    /**
     * Translation module
     */
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store
     */
    StoreRouterConnectingModule.forRoot(),

    !environment.production ? StoreDevtoolsModule.instrument() : [],

    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  providers: [{ provide: RouterStateSerializer, useClass: RouteSerializer }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
